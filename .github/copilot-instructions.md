# AI Coding Agent Instructions for Squoosh-Photo

## Project Overview
**Squoosh-Photo** is a Next.js 16.2.6 web application for client-side image compression and format conversion. The app provides a visual before/after comparison using a slider component. All image processing happens in the browser using Canvas API.

**Key Tech Stack:**
- Next.js 16.2.6 with App Router (breaking changes from older versions)
- React 19.2.4 with TypeScript 5
- Tailwind CSS v4 with @tailwindcss/postcss
- react-compare-slider v4.0.0 for visual comparison UI
- RTL (Right-to-Left) layout with Persian/Farsi content

## Critical Developer Workflows

### Development & Building
```bash
npm run dev       # Starts Next.js dev server on http://localhost:3000 with hot reload
npm run build    # Production build
npm start        # Runs production server
npm run lint     # ESLint (Next.js core-web-vitals + TypeScript)
```

**Note:** Next.js 16.2.6 has breaking API changes from training data. Always check `node_modules/next/dist/docs/` before implementing Next.js features.

## Architecture & Data Flows

### Single Page Component Structure (`app/page.tsx`)
- **"use client"** directive required for browser-only features (file input, Canvas API)
- **State Management:** Uses React hooks (useState, useEffect, useRef) for:
  - Image data URLs (original & compressed)
  - Compression quality (1-100%, default 80%)
  - Output format selection (WebP or JPEG)
  - File size tracking (original vs compressed)
  
### Image Compression Pipeline
1. **File Upload:** User selects file → stored as Blob URL via `URL.createObjectURL()`
2. **Canvas Rendering:** Image drawn to canvas with specified dimensions
3. **Format Conversion:** `canvas.toDataURL(`image/${format}`, quality/100)` converts to WebP/JPEG
4. **Size Estimation:** Base64 string length × 3/4 estimates actual file size
5. **Display:** React-Compare-Slider shows original vs compressed side-by-side
6. **Download:** Data URL as downloadable file via `<a href download>`

### UI Layout Pattern (`app/page.tsx`)
- **Responsive Flexbox:** Main flex container (`md:flex-row`) splits into full-width mobile, sidebar on desktop
- **Dark Theme:** Custom Tailwind classes (`bg-[#121212]`, `bg-[#0a0a0a]`)
- **Right-to-Left:** HTML lang="fa" with `dir="rtl"` in `layout.tsx`
- **Settings Sidebar:** Appears only when image loaded (conditional rendering via `{originalUrl &&}`)

## Project-Specific Patterns & Conventions

### File Organization
```
app/
  page.tsx          # Main image optimizer component (145 lines, single file)
  layout.tsx        # Root layout with RTL metadata
  globals.css       # Tailwind imports + CSS variables for themes
public/             # Static assets (favicon.ico)
```

### Styling Approach
- **Tailwind v4** with `@import "tailwindcss"` in globals.css
- **CSS Variables:** `--background`, `--foreground` for theme switching
- **Dark Mode Only:** Uses inline dark colors (`bg-[#121212]`), no light theme implementation
- **Custom Theming:** Define colors inline via Tailwind's bracket notation (e.g., `text-blue-500`)

### Type Safety Conventions
- **TypeScript strict mode** enabled in `tsconfig.json`
- **React types:** Props use `Readonly` wrapper (see `RootLayout`)
- **Ref types:** `useRef<HTMLInputElement>(null)` for file input reference
- **Event typing:** `React.ChangeEvent<HTMLInputElement>` for form handlers

### Persian/Farsi Content
- All UI labels use Persian text (comments also in Farsi with English equivalents)
- RTL layout critical for proper text alignment and component positioning
- Preserve `lang="fa" dir="rtl"` attributes when modifying layouts

## Integration Points & Dependencies

### External Dependencies
- **react-compare-slider:** Provides `ReactCompareSlider` and `ReactCompareSliderImage` components
  - Used for side-by-side image comparison with draggable divider
  - Expects same-height images; container height controlled by parent (h-[70vh])
  - No custom configuration in current setup

### Browser APIs Used
- **File API:** `FileReader` via `URL.createObjectURL()` for preview
- **Canvas API:** `canvas.getContext('2d')` for image drawing and format conversion
- **Download API:** HTML5 `<a href download>` attribute for file downloads

### Build Configuration
- **next.config.ts:** Currently empty (default config applied)
- **tsconfig.json:** Includes path alias `@/*` mapping to root for imports
- **ESLint:** Uses `eslint-config-next/core-web-vitals` + TypeScript preset
  - Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Important Notes for AI Agents

1. **Canvas API Limitations:** Image data URL conversions estimate file size; actual compression varies by image content
2. **Browser-Only Features:** All image processing must stay in "use client" components; cannot move to server
3. **No API Routes:** Currently a pure client-side app with no backend compression
4. **Performance Consideration:** Large images may freeze UI during compression; consider adding loading state
5. **Next.js 16.2.6 Breaking Changes:** Always verify API usage in `node_modules/next/dist/docs/`; training data may have outdated patterns

## Common Implementation Patterns

### Adding New Features
- **New Controls:** Add state in main component, wire to canvas compression logic, update settings sidebar
- **New Formats:** Add `<option>` to format select, update Canvas toDataURL() format string
- **New Metadata:** Modify `metadata` object in `layout.tsx` (title, description, keywords)
- **Styling:** Use Tailwind classes inline; follow dark theme colors already in use
