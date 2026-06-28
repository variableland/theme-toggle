---
"@vlandoss/theme-toggle": major
---

Initial stable release. Ships the `useColorMode` React hook and an inline pre-paint script for `light` / `dark` / `system` color modes. The `system` mode resolves against the OS `prefers-color-scheme` and tracks it live, the choice is persisted to `localStorage`, a `dark` class is toggled on `<html>`, and a `CustomEvent` is dispatched on every change.
