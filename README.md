# EventEase – Vue 3 Implementation

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)

This is the Vue 3 implementation of EventEase, featuring the Composition API, Pinia for state management, and Vite for a lightning-fast development experience.

## ✨ Features

- **Vue 3** with Composition API and `<script setup>`
- **Vite** for fast development and optimized production builds
- **Vue Router 4** for client-side navigation
- **Pinia** for state management
- **Tailwind CSS** for utility-first styling
- **Fully Responsive** design that works on all devices
- **Form Validation** with Vuelidate
- **Toast Notifications** for user feedback

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or later
- npm 9 or later (or pnpm/yarn)

### Installation

1. Clone the repository
2. Navigate to the Vue app directory:
   ```bash
   cd stage_2_project_EventEase/vue
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Create a production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

This will create a `dist` directory with optimized production assets.

To preview the production build locally:

```bash
npm run preview
```

## 🛠️ Project Structure

```
vue/
├── public/           # Static files
├── src/
│   ├── assets/       # Local assets (images, fonts, etc.)
│   ├── components/   # Reusable UI components
│   ├── composables/  # Composition API functions
│   ├── router/       # Vue Router configuration
│   ├── stores/       # Pinia stores
│   ├── styles/       # Global styles and Tailwind config
│   ├── utils/        # Utility functions
│   ├── views/        # Page components
│   ├── App.vue       # Root component
│   └── main.js       # Application entry point
├── .eslintrc.cjs     # ESLint configuration
├── .prettierrc.json  # Prettier configuration
├── index.html        # HTML template
├── package.json      # Project dependencies and scripts
└── vite.config.js    # Vite configuration
```

## 🔧 Configuration

Environment variables can be configured in `.env` files:

- `.env` - Default environment variables
- `.env.development` - Development environment overrides
- `.env.production` - Production environment overrides

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
# or
pnpm test
```

## 🚀 Deployment

### Static Hosting

Deploy the `dist` directory to any static hosting service:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)

### Important Notes

- The application expects the root `/assets` directory to be available at the root of your domain
- Configure proper redirects for client-side routing
- Set up environment variables in your hosting platform

## 📚 Learn More

- [Vue 3 Documentation](https://v3.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
