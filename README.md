# MediBook

**Medical Clinic Appointment Booking System**

MediBook is a frontend project designed to make medical appointments easier to manage. It provides a simple interface for discovering medical specialists and learning how to arrange an appointment.

## Current Features

- Responsive homepage layout
- Main navigation
- Sample medical specialist cards
- Overview of the appointment booking process
- Global CSS styles and reusable design elements
- Accessible focus indicators and semantic HTML structure

## Technology Stack

- React
- JavaScript
- Vite
- CSS
- Git and GitHub

## Design System

The global stylesheet defines reusable CSS variables for brand colors, backgrounds, text, borders, spacing, and border radii. It also includes a CSS reset, a reusable container, button styles, and keyboard focus indicators.

## Getting Started

1. Clone the repository.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## Project Status

This project is under development as part of a frontend development course. The current version focuses on the homepage and the initial global design system.

**Note:** The doctors shown are sample data for demonstration purposes, not verified real medical providers.


## Performance & Clean Code (Optimization Task)

### Changes implemented

- Added `React.lazy()` and `Suspense` for route-level code splitting in `src/App.jsx`. The route component is downloaded when its route is needed, and a loading fallback is displayed while it loads.
- Memoized the filtered doctors list with `useMemo()` in `src/hooks/useDoctors.js`, so filtering is recalculated only when the doctors list or debounced search query changes.
- Wrapped `DoctorCard` with `React.memo()` and stabilized the doctor action handlers with `useCallback()`. The add/update/delete actions in `useDoctors` also use stable callbacks.
- Kept doctor data/search logic in the existing `useDoctors` custom hook.
- Added `loading="lazy"` and `decoding="async"` to the external illustrative image on the About page.
- Replaced dashboard emoji icons and the mobile navigation glyphs with reusable inline SVG icons in `src/components/Icon/Icon.jsx`.
- Converted the existing PNG asset to WebP.

### Image size comparison

| Asset | Before | After | Difference |
|---|---:|---:|---:|
| `src/assets/hero.png` → `src/assets/hero.webp` | 13,057 bytes (12.75 KiB) | 11,368 bytes (11.10 KiB) | 1,689 bytes smaller (~12.9%) |

Note: `hero.png` was not referenced by the current UI before conversion, so this asset-size reduction does not change the page's current network transfer size. The About page's illustrative image is loaded from an external URL and is now lazy-loaded; it is not a local JPEG/PNG asset.

### Form validation status

The existing forms use Zod schema validation with `safeParse()`. React Hook Form is not yet integrated. To satisfy that additional requirement, install `react-hook-form` and refactor the form state/submit handling to use `useForm()` with the existing Zod schemas. Do not report this step as completed until it has been implemented and tested.

### Verification

- ESLint check: `node ./node_modules/eslint/bin/eslint.js src` — passed in the provided working environment.
- Production build could not be verified in the provided ZIP environment because the installed Vite/Rolldown dependencies are missing a platform-specific native binding. After extracting the project, run `npm install` followed by `npm run build` to refresh dependencies and verify the production bundle.
