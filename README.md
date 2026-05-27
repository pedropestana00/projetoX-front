# ProjetoX Frontend

A modern, type-safe React application built with TypeScript, Vite, and industry best practices.
use user:"admin" password "123" to test backoffice

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building](#building)
- [Code Quality](#code-quality)
- [Contributing](#contributing)

## 🎯 Overview

ProjetoX Frontend is a professional React application that leverages TypeScript and Vite to provide a fast, type-safe development experience with excellent developer ergonomics and build performance.

### Language Composition

- **TypeScript**: 97.9%
- **JavaScript**: 1.3%
- **Other**: 0.8%

This project is written predominantly in TypeScript, ensuring type safety across the codebase and improving maintainability and developer experience.

## 🛠 Technology Stack

- **Framework**: [React 18+](https://react.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Build Tool**: [Vite](https://vitejs.dev)
- **Linting**: [ESLint](https://eslint.org)
- **Code Formatting**: [Prettier](https://prettier.io) (recommended)
- **Package Manager**: [npm](https://www.npmjs.com) or [pnpm](https://pnpm.io)

### Available Vite React Plugins

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) - Uses [Oxc](https://oxc.rs) for faster transpilation
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) - Uses [SWC](https://swc.rs/) for even faster builds

## 📁 Project Structure

```
src/
├── components/      # Reusable React components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── styles/         # Global and component styles
├── App.tsx         # Main App component
└── main.tsx        # Application entry point
public/            # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm 7+ or pnpm 6+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pedropestana00/projetoX-front.git
cd projetoX-front
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

## 💻 Development

### Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run type checking
npm run type-check

# Lint code with ESLint
npm run lint

# Format code with Prettier (recommended)
npm run format
```

### Hot Module Replacement (HMR)

Vite provides instant HMR out of the box. Changes to your React components will reflect immediately in the browser without losing application state.

## 🏗 Building

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## ✅ Code Quality

### ESLint Configuration

This project uses ESLint with TypeScript support. For production applications, we recommend enabling type-aware lint rules:

**Basic Configuration** (`eslint.config.js`):
```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      tseslint.configs.recommendedTypeChecked,
      // For stricter rules:
      // tseslint.configs.strictTypeChecked,
      // For stylistic rules:
      // tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

**Enhanced Configuration** (with React plugins):
```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

### React Compiler

The React Compiler is not enabled by default due to its impact on development and build performance. To enable it in your production configuration, see the [React Compiler documentation](https://react.dev/learn/react-compiler/installation).

### Additional ESLint Plugins

Consider installing these community plugins for enhanced development:

- [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) - Modern React linting rules
- [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-plugin-react-dom) - React DOM specific rules

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m "Add your feature"`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Open a Pull Request

### Code Standards

- Follow the existing code style and conventions
- Ensure all tests pass
- Update documentation as needed
- Use meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/pedropestana00/projetoX-front/issues).

---

**Last Updated**: May 27, 2026
