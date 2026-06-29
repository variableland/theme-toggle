# @vlandoss/theme-toggle

## 1.0.0

### Major Changes

- [#2](https://github.com/variableland/theme-toggle/pull/2) [`dd42ff8`](https://github.com/variableland/theme-toggle/commit/dd42ff8bd1ca2b96c6484f8a323d17aa916e158a) Thanks [@rqbazan](https://github.com/rqbazan)! - Initial stable release. Ships the `useColorMode` React hook and an inline pre-paint script for `light` / `dark` / `system` color modes. The `system` mode resolves against the OS `prefers-color-scheme` and tracks it live, the choice is persisted to `localStorage`, a `dark` class is toggled on `<html>`, and a `CustomEvent` is dispatched on every change.
