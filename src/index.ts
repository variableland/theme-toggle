import * as React from "react";
import { COLOR_MODE, COLOR_MODE_EVENT, COLOR_MODE_STORAGE_KEY, type ColorMode } from "./const.ts";

export function useColorMode() {
  const [mode, setMode] = React.useState<ColorMode>(() => {
    if (typeof localStorage === "undefined") {
      return COLOR_MODE.SYSTEM;
    }

    try {
      const raw = localStorage.getItem(COLOR_MODE_STORAGE_KEY);

      if (!raw) {
        return COLOR_MODE.SYSTEM;
      }

      // @ts-expect-error
      if (!Object.values(COLOR_MODE).includes(raw)) {
        throw new Error(`Invalid color mode value: ${raw}`);
      }

      return raw as ColorMode;
    } catch (err) {
      console.error("Failed to read color mode from localStorage", err);
      return COLOR_MODE.SYSTEM;
    }
  });

  React.useEffect(() => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
    document.dispatchEvent(
      new CustomEvent(COLOR_MODE_EVENT, {
        detail: { colorMode: mode },
      }),
    );

    const query = matchMedia("(prefers-color-scheme: dark)");

    function applyColorMode() {
      const isDark = mode === COLOR_MODE.DARK || (mode === COLOR_MODE.SYSTEM && query.matches);
      document.documentElement.classList.toggle(COLOR_MODE.DARK, isDark);
    }

    applyColorMode();

    if (mode === COLOR_MODE.SYSTEM) {
      query.addEventListener("change", applyColorMode);
      return () => query.removeEventListener("change", applyColorMode);
    }
  }, [mode]);

  return { mode, setMode };
}
