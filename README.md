# @vlandoss/theme-toggle

Light/dark/system color-mode toggle for React apps, with a tiny inline script that
sets the theme **before first paint** to avoid the flash of the wrong theme (FOUC).

- Three modes: `light`, `dark`, and `system` (defaults to `system`).
- `system` resolves against the OS `prefers-color-scheme` and tracks it live.
- Persists the user's choice in `localStorage`.
- Applies a `dark` class on `<html>` so you can style with plain CSS.
- Emits a `CustomEvent` on every change so non-React code can react too.

## Installation

```sh
pnpm add @vlandoss/theme-toggle
```

## Usage

The package ships **two pieces** that work together.

### 1. Inline script (prevents the theme flash)

Load the prebuilt IIFE **before your app renders** — ideally as the first thing in
`<head>`, blocking, so the correct `dark` class is on `<html>` before the page paints.

```html
<head>
  <script src="https://unpkg.com/@vlandoss/theme-toggle/dist/initial.js"></script>
  <!-- ...rest of head... -->
</head>
```

On load it reads the stored mode (or `system` by default), toggles the `dark` class
on `<html>` — resolving `system` against the OS preference — persists the mode, and
exposes its runtime contract on `window.__COLOR_MODE__`.

### 2. React hook (read & control the mode)

```tsx
import { useColorMode } from "@vlandoss/theme-toggle";

function ThemeSwitch() {
  const { mode, setMode } = useColorMode();
  // mode -> "light" | "dark" | "system"

  return (
    <select value={mode} onChange={(e) => setMode(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

Calling `setMode` persists the choice to `localStorage`, toggles the `dark` class on
`<html>`, and dispatches the change event. While `mode` is `system`, the hook also
follows the OS preference live as it changes.

## Styling

Style the two themes with the `dark` class that gets toggled on `<html>`:

```css
:root {
  --bg: white;
  --fg: black;
}

.dark {
  --bg: black;
  --fg: white;
}

body {
  background: var(--bg);
  color: var(--fg);
}
```

## How it works

| Concern        | Value                                      |
| -------------- | ------------------------------------------ |
| DOM class      | `dark` on `document.documentElement`       |
| Storage key    | `@vlandoss/theme-toggle.colorMode`         |
| Change event   | `@vlandoss/theme-toggle.colorModeChange`   |

The change event is a `CustomEvent` dispatched on `document`, with the new value in
`event.detail.colorMode`:

```ts
document.addEventListener("@vlandoss/theme-toggle.colorModeChange", (event) => {
  console.log(event.detail.colorMode); // "light" | "dark" | "system"
});
```

The inline script also publishes these names on `window.__COLOR_MODE__`
(`STORAGE_KEY`, `CUSTOM_EVENT`, `COLOR_MODE`) so other scripts can read them without
importing the package.

## Development

```sh
pnpm install
pnpm test   # functional tests run in a real browser via Vitest Browser Mode + Playwright
```

The suite in `test/functional` covers both entry points: the `useColorMode` hook
(`src/index.ts`) and the inline script (`src/initial.ts`).

## License

MIT
