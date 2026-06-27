declare global {
  interface Window {
    __COLOR_MODE__: {
      STORAGE_KEY: string;
      CUSTOM_EVENT: string;
      COLOR_MODE: {
        DARK: "dark";
        LIGHT: "light";
        SYSTEM: "system";
      };
    };
  }
}

export {};
