import { COLOR_MODE, COLOR_MODE_EVENT, COLOR_MODE_STORAGE_KEY } from "./const.ts";

function getColorMode() {
  const persistedColorMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY);

  return typeof persistedColorMode === "string" ? persistedColorMode : COLOR_MODE.SYSTEM;
}

const colorMode = getColorMode();

const isDark =
  colorMode === COLOR_MODE.DARK ||
  (colorMode === COLOR_MODE.SYSTEM &&
    typeof matchMedia === "function" &&
    matchMedia("(prefers-color-scheme: dark)").matches === true);

document.documentElement.classList.toggle(COLOR_MODE.DARK, isDark);

localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);

window.__COLOR_MODE__ = {
  STORAGE_KEY: COLOR_MODE_STORAGE_KEY,
  CUSTOM_EVENT: COLOR_MODE_EVENT,
  COLOR_MODE: {
    DARK: "dark",
    LIGHT: "light",
    SYSTEM: "system",
  },
};
