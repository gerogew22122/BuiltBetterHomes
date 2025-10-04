# Overview

This is a construction/home building company website called "Built Better Homes" that serves a static WordPress site while adding a React-based contact form. The application is built using a modern full-stack architecture with Express.js backend, React frontend (powered by Vite), and includes a comprehensive UI component library based on shadcn/ui.

The WordPress site is served statically from extracted files, while the React application provides an enhanced contact form at `/contact` that sends email notifications via Resend. The application uses TypeScript throughout for type safety.

# Recent Changes

**October 4, 2025 - GitHub Import to Replit Setup**:
- Successfully imported GitHub repository to Replit environment
- Installed all npm dependencies (571 packages)
- Configured workflow "Start application" to run `npm run dev` on port 5000 with webview output
- Verified Vite dev server starts successfully with HMR enabled
- Confirmed WordPress static site loads correctly at root `/`
- Confirmed React contact form page loads correctly at `/contact`
- Set up autoscale deployment configuration with build and start commands
- Environment uses Node.js 20 and existing package.json scripts
- Both frontend (Vite) and backend (Express) running on port 5000 as required by Replit
- Server configured to bind to 0.0.0.0 for external access
- Vite configured with `allowedHosts: true` for Replit proxy compatibility

**Important Notes**:
- Environment variables `RESEND_API_KEY` and `NOTIFICATION_EMAIL` need to be set via Replit Secrets
- Contact form will not send emails until Resend API key is configured
- Application is ready for immediate use and deployment

**January 2025**: 
- Updated API serverless function to use proper Vercel handler format
- Installed @vercel/node for Vercel serverless compatibility
- Simplified vercel.json to let Vercel auto-handle API routes

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server

**UI Component System**: shadcn/ui component library with Radix UI primitives
- Comprehensive set of pre-built components (40+ components including buttons, cards, forms, dialogs, etc.)
- Tailwind CSS for styling with custom design tokens
- CSS variables for theming support (light/dark modes)
- "New York" style variant selected in configuration

**Routing**: Wouter for client-side routing
- Lightweight alternative to React Router
- `/contact` route for the React contact form
- Fallback 404 page for unmatched routes

**State Management**: TanStack Query (React Query) for server state management
- Centralized query client configuration
- Custom fetch wrapper functions for API communication
- Configured for minimal refetching (staleTime: Infinity)

**Design System**:
- Custom color palette using HSL color space with CSS variables
- Neutral base color scheme
- Support for primary, secondary, muted, accent, and destructive color variants
- Custom border radius values (lg: 9px, md: 6px, sm: 3px)
- Elevation system using opacity-based overlays for hover/active states

## Backend Architecture

**Server Framework**: Express.js with TypeScript

**Architecture Pattern**: Monolithic server with separated concerns
- Route handlers in `server/routes.ts`
- Vite integration for development mode in `server/vite.ts`

**Static Site Serving**: The application serves an extracted WordPress site from `attached_assets/extracted_site/Mjol4GohOxlM.au/`
- WordPress site served at root `/`
- Static assets (CSS, JS, images) served via Express static middleware
- React SPA routes (like `/contact`) handled separately

**API Design**: RESTful endpoints under `/api` prefix
- POST `/api/contact` - Handles contact form submissions with email notifications via Resend
- CORS enabled - API accepts requests from any domain, allowing form integration on external websites

**Email Notifications**: Resend integration for contact form submissions
- API Key: Stored in environment variable `RESEND_API_KEY`
- Notification Email: Stored in environment variable `NOTIFICATION_EMAIL`
- Sends formatted HTML emails with submission details (name, email, phone, budget, location, message)

**Request Logging**: Custom middleware for API request logging
- Logs method, path, status code, and duration
- Captures and logs JSON responses (truncated to 80 characters)
- Only logs API routes to reduce noise

**Error Handling**: Global error handler middleware
- Extracts status code from error object or defaults to 500
- Returns JSON error responses

## Data Storage

**No Database**: Application does not persist data
- Contact form submissions are sent via email only
- No storage of submissions or user data
- Stateless design for simple deployment

**Validation**: Zod schemas for runtime validation
- `insertContactSubmissionSchema` validates incoming contact form data
- Type inference from schemas ensures frontend/backend type consistency

## Contact Form Fields

The contact form collects the following information:
- Name (required)
- Email (required)
- Phone (required)
- Budget (required)
- Location (required)
- Message (required)

## Development Workflow

**Development Server**: Vite middleware mode integrated with Express
- HMR (Hot Module Replacement) support
- Custom error logging that exits on Vite errors
- Template-based SSR setup for development
- Configured to allow all hosts for Replit proxy compatibility

**Production Build**: 
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Both outputs are ESM modules

**Type Checking**: TypeScript with strict mode enabled
- Incremental builds for faster compilation
- Path aliases configured for cleaner imports (@, @shared, @assets)

**Environment Variables**:
- `RESEND_API_KEY` - API key for Resend email service
- `NOTIFICATION_EMAIL` - Email address to receive contact form notifications
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (defaults to 5000)

## Deployment

**Replit Deployment**: Configured for autoscale deployment
- Build command: `npm run build`
- Run command: `npm run start`
- Serves on port 5000 (only non-firewalled port)
- Host: 0.0.0.0 for external access

**Vercel Configuration**: Ready for Vercel deployment
- `vercel.json` configured with proper routing
- Framework: Vite
- Static WordPress site and React SPA properly routed

## External Dependencies

**UI Component Libraries**:
- Radix UI primitives (accordion, dialog, dropdown, select, tabs, tooltip, etc.)
- Provides accessible, unstyled component primitives
- 20+ Radix UI packages for comprehensive UI building blocks

**Styling**:
- Tailwind CSS for utility-first styling
- PostCSS with autoprefixer
- class-variance-authority for variant-based component styling
- clsx and tailwind-merge for conditional class composition

**Form Handling**:
- React Hook Form for form state management
- @hookform/resolvers for Zod schema integration
- Provides performant, flexible form validation

**Email Service**:
- Resend - Email API for sending notification emails

**Utilities**:
- date-fns - Date manipulation library
- adm-zip - ZIP file handling (for asset management)
- wouter - Lightweight routing
- nanoid - Unique ID generation

**Development Tools**:
- @replit/vite-plugin-runtime-error-modal - Development error overlay
- @replit/vite-plugin-cartographer - Replit integration
- @replit/vite-plugin-dev-banner - Development banner
- tsx - TypeScript execution for development server

**Google Fonts Integration**: Custom font loading system
- Roboto and Roboto Slab font families
- Self-hosted fonts with optimized subsets (cyrillic, greek, latin, vietnamese)
- Multiple font weights and styles pre-configured

**WordPress Assets**: Static site extraction
- Elementor page builder CSS assets
- Theme CSS (Hello Elementor theme)
- jQuery and jQuery Migrate for legacy WordPress functionality
- Multiple widget-specific stylesheets for Elementor components
