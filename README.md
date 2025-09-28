# ishe-group-crm
ISHE Group Crm system with Supabase backend and GitHub integration

## 🚀 Live Demo
Visit the live application: [https://iansmith35.github.io/atomic-crm/](https://iansmith35.github.io/atomic-crm/)

## 📋 Features
- Modern, responsive web interface
- Customer management dashboard
- Lead tracking system
- Analytics and reporting
- Mobile-friendly design
- Deployed automatically to GitHub Pages

## 🛠️ Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with Flexbox & Grid
- **Icons**: Font Awesome
- **Deployment**: GitHub Pages with automated CI/CD
- **Version Control**: Git & GitHub

## 📦 Deployment

### Automated Deployment Script

The project includes a comprehensive deployment script (`deploy.sh`) that handles the complete deployment process:

```bash
./deploy.sh
```

**What the deployment script does:**

1. **Frontend Build** - Builds the frontend application (static HTML optimization)
2. **Supabase Operations** - Runs database migrations and generates TypeScript types
3. **Backend/API Deployment** - Deploys Supabase Edge Functions and backend services
4. **Frontend Deployment** - Deploys to GitHub Pages or your hosting platform

### Prerequisites

- **Supabase CLI** (for database operations):
  ```bash
  npm install supabase --save-dev
  # or
  curl -sSL https://supabase.com/install.sh | bash
  ```

- **Node.js and npm** (for package management)

### Manual Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow:

1. Triggers on pushes to the `main` branch
2. Builds the static site using Jekyll
3. Deploys to GitHub Pages environment
4. Available at the live demo URL above

### Local Testing

Before deploying, test locally:

```bash
npm run dev      # Start development server on port 3000
npm run start    # Start server on port 8000
npm run validate # Validate HTML files
```

## 🏗️ Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/iansmith35/atomic-crm.git
   cd atomic-crm
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. Navigate to `http://localhost:8000` to view the application

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
