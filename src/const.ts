export const COLOR_MODE_EVENT = "@vlandoss/theme-toggle.colorModeChange";

export const COLOR_MODE_STORAGE_KEY = "@vlandoss/theme-toggle.colorMode";

export const COLOR_MODE = {
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system",
} as const;

export type ColorMode = (typeof COLOR_MODE)[keyof typeof COLOR_MODE];
