# Frontend - Tesa AI Hub

React + TypeScript + Vite frontend application for the Tesa AI Hub use case management platform.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── components/      # Reusable UI components
│   │   ├── Footer.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── LoginModal.tsx
│   │   ├── NewUseCaseModal.tsx
│   │   ├── UseCaseCard.tsx
│   │   └── UseCaseDetailModal.tsx
│   ├── config/          # Configuration files
│   │   └── index.ts     # Centralized app configuration
│   ├── contexts/        # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── LanguageContext.tsx
│   ├── features/        # Feature-based modules
│   ├── hooks/           # Custom React hooks
│   ├── i18n/            # Internationalization
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   │   ├── App.tsx
│   │   ├── LandingPage.tsx
│   │   └── UseCaseOverview.tsx
│   ├── routes/          # Routing configuration
│   ├── services/        # API services
│   │   └── api.ts       # Axios-based API client
│   ├── store/           # State management
│   ├── styles/          # Global styles
│   │   └── index.css
│   ├── test/            # Test utilities
│   ├── types/           # TypeScript type definitions
│   │   └── types.ts
│   ├── utils/           # Utility functions
│   └── main.tsx         # Application entry point
├── public/              # Static public assets
├── dist/                # Production build output
├── .env                 # Environment variables
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Testing

```bash
npm run test          # Run tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run typecheck
```

## 🔧 Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SHAREPOINT_URL=
VITE_CONFLUENCE_URL=
VITE_BITS_URL=
VITE_SUPPORT_PORTAL=
VITE_SUPPORT_EMAIL=
```

## 📦 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

## 🏗️ Architecture

### API Layer
All API calls use axios with centralized configuration in `src/services/api.ts`:
- Automatic auth token injection via interceptors
- Centralized error handling
- Type-safe API methods

### State Management
- React Context for global state (Auth, Language)
- Local component state with hooks

### Routing
Currently using conditional rendering. Ready for React Router integration.

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Generate test coverage |

## 🔐 Authentication

The app uses JWT-based authentication:
- Login credentials are sent to the backend
- JWT token is stored in localStorage
- Axios interceptor automatically adds token to requests

## 🌐 Internationalization

The app supports multiple languages:
- English (en)
- German (de)

Language preference is stored in localStorage.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: 640px
- Tablet: 768px
- Desktop: 1024px
- Wide: 1280px

## 🐳 Docker

Build the Docker image:

```bash
docker build -t tesa-frontend .
```

Run the container:

```bash
docker run -p 80:80 tesa-frontend
```

## 🤝 Contributing

1. Follow the existing folder structure
2. Use TypeScript for all new files
3. Follow the existing code style
4. Write tests for new features
5. Update this README if needed

## 📄 License

[Your License Here]
