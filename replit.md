# Vastra - Saree E-commerce Platform

## Overview

Vastra is a premium e-commerce platform for handcrafted Indian sarees. The application provides a complete shopping experience including product browsing, filtering, cart management, user authentication, address management, and checkout functionality. The platform emphasizes elegant visual presentation with a focus on traditional aesthetics suited for luxury fashion retail.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: 
  - TanStack React Query for server state and caching
  - React Context for client-side state (auth, cart, theme)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system (CSS variables for theming, light/dark mode support)
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints under `/api` prefix
- **Session Management**: express-session with in-memory storage (MemoryStorage class)
- **Authentication**: Custom session-based auth with SHA-256 password hashing

### Data Layer
- **Schema Definition**: Zod for runtime validation, shared between client and server
- **ORM**: Drizzle ORM configured for PostgreSQL (schema in `shared/schema.ts`)
- **Current Storage**: In-memory storage implementation (`server/storage.ts`) with sample product data
- **Database Ready**: Drizzle config exists for PostgreSQL migration when database is provisioned

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route page components
│   │   ├── lib/            # Utilities and context providers
│   │   └── hooks/          # Custom React hooks
├── server/                 # Express backend
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route handlers
│   ├── storage.ts          # Data access layer
│   └── vite.ts             # Vite dev server integration
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Zod schemas for validation
└── migrations/             # Drizzle database migrations
```

### Key Design Patterns
- **Shared Schema Pattern**: TypeScript interfaces and Zod schemas in `shared/` directory are used by both frontend and backend
- **Context-Based State**: Cart and Auth state wrapped in React Context providers for global access
- **API Request Utility**: Centralized `apiRequest` function in `queryClient.ts` handles all API calls with error handling
- **Component Composition**: UI built using shadcn/ui primitives with Radix UI for accessibility

### Design System
- **Typography**: Playfair Display (serif) for headings, Inter (sans-serif) for body text
- **Color Scheme**: Primary color is a deep rose/burgundy (HSL 340, 82%, 42%), with full light/dark mode support
- **Layout**: max-w-7xl container, consistent spacing using Tailwind units (4, 6, 8, 12, 16, 20, 24)

## External Dependencies

### UI Framework
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-built component library using Radix primitives with Tailwind styling
- **Lucide React**: Icon library

### Data & State
- **@tanstack/react-query**: Server state management and caching
- **Zod**: Schema validation (shared between client/server)
- **Drizzle ORM**: Database ORM with PostgreSQL driver ready

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: For creating variant-based component styles
- **tailwind-merge**: Intelligent class name merging

### Backend
- **Express**: Web server framework
- **express-session**: Session middleware for authentication
- **connect-pg-simple**: PostgreSQL session store (available when DB is provisioned)

### Build & Development
- **Vite**: Frontend build tool with HMR
- **tsx**: TypeScript execution for server
- **esbuild**: Production bundling for server code
- **Replit plugins**: Development banner and error overlay for Replit environment