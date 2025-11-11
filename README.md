# GENISIS SYSTEM — Angular 20 (Standalone) Frontend

Modern Angular 20 frontend using Standalone Components, organized into clear routes and layouts for Clients, Employees, Admin, and Auth. The project leverages Bootstrap, SCSS, FontAwesome, SweetAlert2, and SignalR for real-time updates, with JWT support.

---

## Overview

- Package name: `structure-angular` in the `GENISIS-SYSTEM` workspace.
- Standalone Angular app bootstrapped via `bootstrapApplication` (no `NgModule`).
- Logical route grouping: clients, admin, employees, and authentication.
- Static assets served from `public/`; global styles via SCSS.

---

## Tech Stack

- Angular `20.1` (Standalone Components)
- RxJS `7.8`
- Bootstrap `5.3` + SCSS
- `@fortawesome/fontawesome-free`
- `sweetalert2`
- `@microsoft/signalr` (real-time support)
- `jwt-decode`
- Testing: Karma + Jasmine

---

## Prerequisites

- Node.js `18` or `20` (LTS recommended)
- Recent `npm`
- Optional: Angular CLI globally: `npm i -g @angular/cli`

---

## Quick Start

1) Install dependencies:
```
npm install
```

2) Start the dev server:
```
npm start
```
Opens at `http://localhost:4200/`.

3) Production build:
```
npm run build
```
Outputs to `dist/structureAngular` with `outputHashing` enabled.

4) Watch mode for development:
```
npm run watch
```

5) Run tests:
```
npm test
```

---

## Configuration

- Environment file: `src/environments/environment.ts`
  - `apiUrl`: API base URL — default: `https://genesissystem.runasp.net/api/`
  - `baseimageUrl`: static files/images — default: `https://genesissystem.runasp.net/`

- Assets: all contents of `public/` are included in the build.
- Styles loaded:
  - `src/bootstrap.min.css`
  - `node_modules/@fortawesome/fontawesome-free/css/all.min.css`
  - `src/styles.scss`
- Scripts added: `node_modules/bootstrap/dist/js/bootstrap.bundle.min.js`

- Formatting (Prettier):
  - `printWidth: 100`, `singleQuote: true`
  - `*.html` files use `parser: angular`

---

## Project Structure

```
e:/GENISIS-SYSTEM
├── public/
│   ├── assets/
│   │   ├── employeeBadge/
│   │   └── img/
│   ├── Icons/
│   ├── Image/
│   └── Sound/
├── src/
│   ├── app/
│   │   ├── Core/
│   │   │   └── guards/ (e.g., is-auth.guard.ts)
│   │   ├── Layout/
│   │   ├── Pages/
│   │   │   └── Interfaces_Clients/ (e.g., set-meeting, projectDetalis)
│   │   ├── Routes/ (admin.routes, employ.routes, client.routes, auth.routes)
│   │   ├── Shared/
│   │   ├── app.config.ts
│   │   ├── app.html / app.scss / app.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   └── environment.ts
│   ├── main.ts
│   └── styles.scss
├── angular.json
└── package.json
```

---

## Routing

- Defined in `src/app/app.routes.ts` combining:
  - `clientRoutes`, `adminroutes`, `employeroutes`, `authRoutes`
- Root renders `RouterOutlet` via `App` (`src/app/app.ts`).

---

## Authentication

- Guard `isAuthGuard` checks for `auth_token` in `localStorage`:
  - If present, redirects to `/home` and blocks access to auth pages.
  - If absent, allows navigation.

---

## Key Features

- Clients — Set Meeting: `Pages/Interfaces_Clients/set-meeting`
  - Select a project, day, time slot; submit via `MeetingService`.
- Project Details & File Uploads: `Pages/Interfaces_Clients/projectDetalis/components/upload-files`
  - Upload multiple files and associate them with a project.
- Project Chat UI: supports messages with file attachments; ready to integrate with `SignalR`.
- Employee Layout: `Layout/Employee/mainlayout-employee` with sidebar and footer.

---

## Testing

- Run: `npm test`
- Tools: Karma, Jasmine, Chrome launcher (if configured locally).

---

## Deployment

- Build with `npm run build` to produce files in `dist/structureAngular`.
- Serve using any static server (Nginx, Apache, IIS, or cloud hosting).
- `outputHashing: all` improves cache-busting for safe long-term caching.

---

## Development Guidelines

- Use SCSS for styles and prefer reusable components.
- Follow built-in Prettier settings for consistent formatting.
- Organize services under `Core/service`, views under `Pages`, and shared utilities under `Shared`.

---

## Troubleshooting

- Node version conflicts: ensure Node 18/20.
- Port already in use: run `ng serve --port 4300`.
- API connectivity issues: update `apiUrl` and `baseimageUrl` in `environment.ts`.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Push changes: `git push origin feature/your-feature`.
4. Open a Pull Request for review.

---

## License

No specific license currently. Update this section if adopting one (MIT, Apache-2.0, etc.).

---

## Author

✨ Mostafa Hamed ✨  
Frontend Developer | Angular • React • Next.js  
📧 Email: [mostafahamed3003@gmail.com](mailto:mostafahamed3003@gmail.com)  
🌐 Portfolio: [portfoliomostafa-hamed.vercel.app](https://portfoliomostafa-hamed.vercel.app/)