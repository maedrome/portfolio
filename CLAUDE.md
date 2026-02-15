# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm start` / `ng serve` — Start dev server at http://localhost:4200
- `npm run build` / `ng build` — Production build (output: `dist/portfolio/`)
- `npm test` / `ng test` — Run unit tests with Karma/Jasmine
- `ng generate component <name>` — Scaffold a new component

## Architecture

This is a **single-page portfolio website** built with Angular 19 and Tailwind CSS v4. The entire site lives in one standalone component — there is no routing, no lazy-loaded modules, and no separate feature components.

**Key files:**
- `src/app/app.component.ts` — All application logic: navigation state, scroll tracking, experience/project data, contact form handling, terminal typing animation, toast notifications
- `src/app/app.component.html` — Full page template with sections: Hero, About, Experience, Projects, Skills, Contact, Footer
- `src/styles.css` — Tailwind v4 config via `@theme`, custom color palette, reusable component classes (`btn-primary`, `card`, `input-field`), and all custom keyframe animations

**Styling approach:**
- Tailwind CSS v4 with PostCSS (configured via `@tailwindcss/postcss`)
- Custom dark theme defined in `@theme` block in `styles.css` (primary: `#0f0f0f`, accent: `#dc2626` red)
- Fonts: Inter (sans) and Fira Code (mono), loaded via Google Fonts in `index.html`
- Animations are CSS keyframes defined in `styles.css` and triggered via Angular's `ngClass` + `IntersectionObserver`

**Contact form:**
- Uses Angular Reactive Forms with EmailJS (`@emailjs/browser`) for sending emails directly from the browser
- EmailJS is initialized in the `AppComponent` constructor

**Patterns used:**
- Angular signals (`signal()`, `effect()`) for reactive state (animated sections, selected experience)
- `IntersectionObserver` for scroll-triggered section animations and terminal typing effect
- `@defer(on viewport)` for deferred rendering of the tech list
- Mix of `@if`/`@for` (new control flow) and `*ngIf`/`*ngFor` (legacy directives) in templates

## TypeScript Config

Strict mode is enabled with additional strictness: `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`. Angular strict templates are also enabled.
