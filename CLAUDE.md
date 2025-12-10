# Angular NgRx Frontend - AI Assistant Context

> **Project**: Angular NgRx Frontend Template
> **Author**: Tarmo Leppänen
> **License**: MIT
> **Last Updated**: December 2025

## Overview

This is a production-ready Angular 21 frontend template powered by NgRx state management.
It's designed as a standalone SPA (Single Page Application) that works with RESTful
backends, particularly the [Symfony Flex Backend](https://github.com/tarlepp/symfony-flex-backend).

### Key Characteristics

- **Framework**: Angular 21.0.0 with standalone components
- **State Management**: NgRx 20.1.0 (Store, Effects, Router Store, Entity, Operators)
- **Language**: TypeScript 5.9.3 with strict mode enabled
- **Styling**: SCSS with Angular Material 21.0.0
- **Layout**: @ngbracket/ngx-layout (flexbox-based)
- **i18n**: @jsverse/transloco (supports English and Finnish)
- **Authentication**: JWT-based with @auth0/angular-jwt
- **Development**: Docker-based with hot reload
- **Testing**: Karma + Jasmine

## Project Structure

```
angular-ngrx-frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts          # Root component
│   │   ├── app.routes.ts             # Route configuration (standalone)
│   │   ├── auth/                     # Authentication module
│   │   │   ├── enums/                # Role enum
│   │   │   ├── factories/            # JWT options factory
│   │   │   ├── guards/               # Auth & role guards
│   │   │   ├── interfaces/           # User data interfaces
│   │   │   ├── login/                # Login component
│   │   │   └── services/             # Authentication service
│   │   ├── landing/                  # Landing page component
│   │   ├── shared/                   # Shared utilities
│   │   │   ├── components/           # Reusable components (header, footer, etc.)
│   │   │   ├── constants/            # App constants
│   │   │   ├── directives/           # Custom directives
│   │   │   ├── enums/                # Shared enums (Theme, Viewport)
│   │   │   ├── interceptors/         # HTTP interceptors
│   │   │   ├── interfaces/           # Shared interfaces
│   │   │   ├── pipes/                # Custom pipes
│   │   │   ├── services/             # Shared services
│   │   │   └── utils/                # Utility functions
│   │   └── store/                    # NgRx store
│   │       ├── app.state.ts          # Root state definition
│   │       ├── app.reducers.ts       # Root reducers
│   │       ├── app.effects.ts        # Root effects
│   │       ├── authentication/       # Auth state slice
│   │       ├── error/                # Error state slice
│   │       ├── layout/               # Layout state slice
│   │       ├── router/               # Router state slice
│   │       ├── version/              # Version state slice
│   │       ├── meta-reducers/        # Meta reducers (localStorage sync)
│   │       └── aware-states/         # State awareness utilities
│   ├── assets/
│   │   ├── config/                   # Environment configs (dev/prod)
│   │   ├── i18n/                     # Translation files (en.json, fi.json)
│   │   └── version.json              # App version info
│   ├── environments/                 # Environment files
│   └── styles/                       # Global SCSS files
├── docker/                           # Docker configuration
├── doc/                              # Documentation
├── e2e/                              # E2E tests
└── scripts/                          # Build/utility scripts
```

## Technology Stack

### Core Dependencies

- **Angular 21.0.0**: Latest Angular with signals and standalone components
- **NgRx 20.1.0**: Complete state management suite
  - @ngrx/store: State container
  - @ngrx/effects: Side effect management
  - @ngrx/entity: Entity state management
  - @ngrx/router-store: Router state integration
  - @ngrx/store-devtools: Redux DevTools integration
- **RxJS 7.8.2**: Reactive programming
- **Angular Material 21.0.0**: Material Design UI components
- **@ngbracket/ngx-layout 20.0.1**: Flexbox layout system
- **@jsverse/transloco 8.2.0**: i18n library
- **@auth0/angular-jwt 5.2.0**: JWT authentication
- **Luxon 3.7.2**: Date/time handling (via luxon-angular)
- **ngx-webstorage 20.0.0**: Browser storage wrapper
- **ngrx-store-localstorage 20.0.0**: LocalStorage sync for NgRx

### Development Dependencies

- **TypeScript 5.9.3**
- **ESLint 9.39.1** with:
  - @angular-eslint
  - @ngrx/eslint-plugin
  - @typescript-eslint
  - @stylistic/eslint-plugin
- **Stylelint 16.26.0** with SCSS support
- **Karma + Jasmine**: Unit testing
- **Protractor**: E2E testing

## Architecture Patterns

### 1. NgRx State Management

The application uses a modular NgRx architecture with feature slices:

**Store Structure:**
```typescript
AppState {
  router: RouterReducerState           // Router state
  authentication: AuthenticationState  // User auth state
  error: ErrorState                    // Error handling state
  layout: LayoutState                  // UI layout state (theme, viewport)
  version: VersionState                // App version state
}
```

**Key Files:**
- `src/app/store/app.state.ts` - Root state interface
- `src/app/store/app.reducers.ts` - Root reducer configuration
- `src/app/store/app.effects.ts` - Root effects
- `src/app/store/*/` - Feature state slices

**Best Practices:**
- Use selectors for all state access
- Keep effects for side effects (HTTP, routing, storage)
- Use actions with clear naming: `[Source] Event`
- Implement meta-reducers for cross-cutting concerns (localStorage sync)

### 2. Authentication Flow

JWT-based authentication with:
- Token stored in localStorage
- Auto-refresh mechanism
- Route guards (AuthenticationGuard, RoleGuard variants)
- HTTP interceptors for token injection
- Role-based access control (RBAC)

**Key Components:**
- `src/app/auth/guards/authentication.guard.ts` - Login check
- `src/app/auth/guards/role-*.guard.ts` - Role-based guards
- `src/app/auth/services/authentication.service.ts` - Auth service
- `src/app/auth/factories/jwt-options.factory.ts` - JWT config

### 3. Routing

Uses Angular standalone routing with lazy loading:

```typescript
// Route example
{
  path: 'auth',
  loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
}
```

### 4. HTTP Interceptors

Multiple interceptors handle cross-cutting HTTP concerns:
- `accept-language.interceptor.ts` - Language header injection
- `backend-version.interceptor.ts` - Backend version checking
- `error.interceptor.ts` - Global error handling
- `http-cache.interceptor.ts` - Response caching

### 5. Internationalization (i18n)

Uses Transloco with:
- Translation files in `src/assets/i18n/`
- Supported languages: English (en), Finnish (fi)
- Keys extracted via `transloco-keys-manager`
- Missing translations marked as `"--- MISSING TRANSLATION ---"`

**Key Commands:**
```bash
yarn extract-translations  # Extract translation keys
yarn check-translations    # Validate translations
```

### 6. Theming

Material Design theming with:
- Theme enum: `Theme.LIGHT`, `Theme.DARK`
- Stored in NgRx layout state
- Persisted to localStorage
- Applied via CSS classes

## Development Workflow

### Docker-Based Development

The project uses Docker Compose for consistent development environments:

```bash
# Start development server (https://localhost:4200)
make start

# Build and start (rebuild containers)
make start-build

# Get shell access
make bash

# Stop containers
make stop
```

**Important**: Uses self-signed SSL certificates in `docker/ssl/`. First-time users
need to trust the certificate.

### Without Docker

```bash
yarn install
yarn start          # Dev server with SSL
yarn start-prod     # Local production mode
```

### Common Tasks

```bash
# Linting
yarn lint:ts        # TypeScript
yarn lint:scss      # SCSS
make lint           # Both

# Fixing
yarn fix:ts         # Auto-fix TypeScript
yarn fix:scss       # Auto-fix SCSS
make fix            # Both

# Testing
yarn test           # Unit tests
yarn e2e            # E2E tests

# Building
yarn build          # Development build
yarn build-prod     # Production build

# Translations
yarn i18n:extract   # Extract translation keys
yarn i18n:find      # Find unused keys
```

## Configuration

### Environment Files

Three environment configurations:
- `environment.ts` - Development (local)
- `environment.local-prod.ts` - Local production testing
- `environment.prod.ts` - Production deployment

### Runtime Configuration

Config loaded from `src/assets/config/*.json`:
- `config.dev.json` - Development settings
- `config.prod.json` - Production settings

### TypeScript Configuration

Strict mode enabled with:
```json
{
  "strict": true,
  "strictTemplates": true,
  "strictInjectionParameters": true,
  "strictInputAccessModifiers": true
}
```

### ESLint Configuration

Comprehensive linting with:
- Angular-specific rules
- NgRx best practices
- TypeScript strict checks
- Stylistic formatting
- Import organization

## Key Conventions

### File Organization

- **Barrel exports**: Use `index.ts` for module exports
- **Feature modules**: Group by feature (auth, shared, store)
- **Naming**: `*.component.ts`, `*.service.ts`, `*.guard.ts`, etc.

### Component Architecture

- **Standalone components**: No NgModules (Angular 14+ approach)
- **OnPush change detection**: Performance optimization
- **Reactive forms**: For user input
- **Smart/Dumb pattern**: Container vs. presentational components

### State Management

- **Immutability**: Always return new state objects
- **Selectors**: Memoized state derivation
- **Actions**: Past tense for events (`userLoggedIn`)
- **Effects**: Handle side effects, dispatch actions

### Styling

- **SCSS**: Nested, variables, mixins
- **BEM-like naming**: Block-Element-Modifier pattern
- **Material theming**: Use Material Design color system
- **Responsive**: Use flex-layout directives

## Backend Integration

Designed to work with REST APIs. Default backend: `https://localhost:8000`

**Expected API Patterns:**
- JWT authentication endpoint
- RESTful resource endpoints
- Version endpoint for compatibility checking
- CORS configuration for local development

## Common Issues & Solutions

### SSL Certificate Issues

First-time setup shows "Your connection is not private":

1. Navigate to `docker/ssl/`
2. Follow `README.md` to trust the certificate
3. Or use the `make generate-ssl-cert` command

### Port Conflicts

Default port 4200 in use:

- Stop other Angular dev servers
- Or modify port in `package.json` start script

### Docker Issues

Container won't start:

```bash
make stop
docker system prune -a  # Warning: removes all stopped containers
make start-build
```

### Translation Errors

Missing translation keys:

```bash
yarn extract-translations
yarn check-translations
```

## IDE Setup

### Recommended Extensions (WebStorm/IntelliJ)

- Angular Language Service
- TypeScript support (built-in)
- SCSS/Sass support

### VS Code

- Angular Language Service
- ESLint
- Stylelint
- Docker
- EditorConfig

## Testing Strategy

### Unit Tests

- Jasmine framework
- Karma test runner
- Test files: `*.spec.ts`
- Coverage reporting

### E2E Tests

- Protractor (note: deprecated, consider migration to Cypress/Playwright)
- Test files in `e2e/src/`

## Security Considerations

- **JWT Storage**: Tokens in localStorage (consider security implications)
- **HTTPS**: Required for production
- **CORS**: Backend must allow frontend origin
- **Snyk Protection**: Dependency vulnerability scanning
- **Content Security Policy**: Configure as needed
- **XSS Prevention**: Angular's built-in sanitization

## Performance Optimization

- **Lazy Loading**: Routes loaded on-demand
- **OnPush Change Detection**: Reduces change detection cycles
- **TrackBy**: Used in ngFor loops
- **Service Workers**: Can be added for PWA
- **AOT Compilation**: Enabled in production builds
- **Tree Shaking**: Dead code elimination

## Migration Notes

### From Earlier Angular Versions

- Project uses standalone components (no NgModules)
- Uses new Angular Router (functional guards)
- Signal-based reactivity available

### Key Deprecations to Watch

- Protractor (E2E) - consider Cypress/Playwright
- Some Material components - check Angular Material changelog

## Useful Resources

- **Angular Docs**: https://angular.dev
- **NgRx Docs**: https://ngrx.io
- **Material Design**: https://material.angular.io
- **Transloco**: https://jsverse.github.io/transloco
- **Project Issues**: https://github.com/tarlepp/angular-ngrx-frontend/issues

## AI Assistant Guidelines

When working with this codebase:

1. **Always use TypeScript strict mode** - No implicit any, strict null checks
2. **Follow NgRx patterns** - Actions, reducers, effects, selectors
3. **Use standalone components** - No NgModules
4. **Respect the architecture** - Don't break the feature module structure
5. **Test changes** - Run linting and tests before committing
6. **Update translations** - Add keys to both en.json and fi.json
7. **Use Material components** - Don't introduce new UI libraries
8. **Follow reactive patterns** - Use RxJS operators, avoid imperative code
9. **Check for errors** - Use `make lint` or individual yarn commands
10. **Docker first** - Development is designed for Docker environment

### Making Changes

**Adding a new feature:**
1. Create feature folder in appropriate location (auth/shared/store)
2. Create component with `ng generate component`
3. Add routes if needed
4. Create NgRx slice if state management needed
5. Add translations for UI text
6. Write tests
7. Run linters

**Modifying state:**
1. Update state interface in `*.state.ts`
2. Update actions in `*.actions.ts`
3. Update reducers in `*.reducers.ts`
4. Update selectors in `*.selectors.ts`
5. Update effects in `*.effects.ts` if needed

**Adding dependencies:**
```bash
# Inside Docker container (make bash)
yarn add <package>
yarn add -D <dev-package>
```

## Version Information

- **Angular**: 21.0.0
- **NgRx**: 20.1.0
- **TypeScript**: 5.9.3
- **Node**: 25.2.1 (in Docker)
- **Package Manager**: Yarn

---

*This document is maintained for AI assistants (Claude, GitHub Copilot, etc.) to
provide context about the project structure, patterns, and conventions.*
