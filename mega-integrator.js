// mega-integrator.js
// This script injects Google Sign-In + OpenAI Chat widgets into every HTML file
// AND scaffolds the Supabase Edge Function needed to store Google tokens.

const fs = require("fs");
const path = require("path");

// ⚙️ CONFIG: Fill these three values before running
const GOOGLE_CLIENT_ID = "624596716963-huc2ef9rt7q8vckvjtbr84tfrjbs5cic.apps.googleusercontent.com"; 
const OPENAI_KEY = "lUepvP1YcbQtr75QPYZzZrELqqdRnk72KxZ3On5cY_rgeduG7q-m12s74s4vwczZP1HEIoWwW_T3BlbkFJNkpxiHDdAzSZvKitmOPezOvhsFJVzswOZ5jSIL3MeQCxUGdTIwluch6oLbltVO5-nmSJeWnNMA  ";

// Supabase Edge Function code that will store the Google token
const supabaseEdgeFunctionCode = `
// supabase/functions/save-google-token/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
  const body = await req.json();
  const token = body.token;

  // store or update the token for this user
  const { error } = await supabase
    .from("google_tokens")
    .upsert({ id: "primary", token });

  if (error) {
    return new Response(JSON.stringify({ ok: false, error }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
`;

// snippet to inject in every HTML file
const snippet = `
<!-- === GOOGLE SIGN-IN + SUPABASE SAVE === -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
<script>
  function initClient() {
    google.accounts.id.initialize({
      client_id: "${GOOGLE_CLIENT_ID}",
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("googleSignIn"),
      { theme: "outline", size: "large" }
    );
  }
  function handleCredentialResponse(response) {
    fetch("/functions/v1/save-google-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential })
    }).then(() => alert("Google linked! Reload page."));
  }
  window.onload = initClient;
</script>
<div id="googleSignIn"></div>

<!-- === DIRECT OPENAI CHAT WIDGET === -->
<script src="https://cdn.jsdelivr.net/npm/@openai/chat-widget"></script>
<script>
  new OpenAIChatWidget({
    apiKey: "${OPENAI_KEY}",
    model: "gpt-4o-mini",
    container: document.body,
    persona: document.title // uses room name automatically
  });
</script>
`;

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".html")) {
      let content = fs.readFileSync(fullPath, "utf8");
      if (!content.includes("@openai/chat-widget")) {
        content = content.replace(/<\/body>/i, `${snippet}\n</body>`);
        fs.writeFileSync(fullPath, content, "utf8");
        console.log("✅ Updated " + fullPath);
      }
    }
  });
}

// Write Supabase Edge Function
fs.mkdirSync("./supabase/functions/save-google-token", { recursive: true });
fs.writeFileSync(
  "./supabase/functions/save-google-token/index.ts",
  supabaseEdgeFunctionCode,
  "utf8"
);
console.log("✅ Supabase Edge Function created at supabase/functions/save-google-token/index.ts");

// Inject snippet into all HTML files
walk("./");
console.log("✨ All HTML files updated with Google + OpenAI widgets");