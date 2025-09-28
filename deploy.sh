#!/bin/bash
set -e

echo "Building front-end…"
if [ -d "frontend" ]; then
    cd frontend
    if [ -f "package.json" ]; then
        npm ci
        npm run build
    fi
    cd ..
elif [ -d "client" ]; then
    cd client
    if [ -f "package.json" ]; then
        npm ci
        npm run build
    fi
    cd ..
else
    # No separate frontend directory, check if root has package.json
    if [ -f "package.json" ]; then
        npm ci
        npm run build
    else
        echo "Static HTML project - no build process needed"
    fi
fi

echo "Running Supabase migrations / seeds…"
# assuming you have supabase cli configured
if command -v supabase &> /dev/null; then
    supabase db push
    supabase gen types typescript --local > types/supabase.ts 2>/dev/null || supabase gen types typescript > types/supabase.ts 2>/dev/null || echo "Warning: Could not generate types"
else
    echo "Warning: Supabase CLI not found. Install with: npm install -g supabase"
fi

echo "Deploying backend / API…"
if [ -d "server" ]; then
    cd server
    if [ -f "package.json" ]; then
        npm ci
        npm run build
        # deploy, e.g. via Vercel, Fly, or supabase edge functions
    fi
    cd ..
elif [ -d "backend" ]; then
    cd backend
    if [ -f "package.json" ]; then
        npm ci
        npm run build
        # deploy, e.g. via Vercel, Fly, or supabase edge functions
    fi
    cd ..
fi

# Handle Supabase Edge Functions deployment
if command -v supabase &> /dev/null && [ -d "supabase/functions" ]; then
    echo "Deploying Supabase Edge Functions..."
    for func_dir in supabase/functions/*/; do
        if [ -d "$func_dir" ]; then
            func_name=$(basename "$func_dir")
            echo "Deploying function: $func_name"
            supabase functions deploy "$func_name" || echo "Warning: Failed to deploy $func_name"
        fi
    done
else
    echo "Note: Supabase Edge Functions detected but CLI not available or functions directory missing"
fi

echo "Deploying front-end…"
# example: to GitHub Pages or your hosting
if [ -f "package.json" ] && grep -q "deploy" package.json; then
    npm run deploy
elif [ -f ".github/workflows/deploy.yml" ]; then
    echo "GitHub Pages deployment will be triggered by git push"
    # Check if there are uncommitted changes
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        echo "Warning: Uncommitted changes detected. Commit and push to trigger deployment."
    fi
else
    echo "No deployment configuration found. Manual deployment required."
fi

echo "Done deployment!"