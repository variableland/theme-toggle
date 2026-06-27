import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import { COLOR_MODE, COLOR_MODE_EVENT, COLOR_MODE_STORAGE_KEY, type ColorMode } from "../../src/const.ts";
import { useColorMode } from "../../src/index.ts";

function hasDarkClass() {
  return document.documentElement.classList.contains(COLOR_MODE.DARK);
}

function readStoredMode() {
  return localStorage.getItem(COLOR_MODE_STORAGE_KEY);
}

function stubPrefersColorScheme(matches: boolean) {
  const listeners = new Set<() => void>();
  const query = {
    matches,
    addEventListener: (_type: "change", listener: () => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: "change", listener: () => void) => {
      listeners.delete(listener);
    },
  };

  vi.stubGlobal("matchMedia", () => query);

  return {
    emitChange(next: boolean) {
      query.matches = next;
      for (const listener of listeners) {
        listener();
      }
    },
  };
}

function captureColorModeEvents() {
  const details: ColorMode[] = [];

  function onChange(event: Event) {
    details.push((event as CustomEvent<{ colorMode: ColorMode }>).detail.colorMode);
  }

  document.addEventListener(COLOR_MODE_EVENT, onChange);

  return {
    details,
    stop: () => document.removeEventListener(COLOR_MODE_EVENT, onChange),
  };
}

describe("useColorMode — initialization from localStorage", () => {
  it('defaults to "system" when nothing is persisted', async () => {
    stubPrefersColorScheme(false);

    const { result } = await renderHook(() => useColorMode());

    expect(result.current.colorMode).toBe(COLOR_MODE.SYSTEM);
    expect(readStoredMode()).toBe(COLOR_MODE.SYSTEM);
    expect(hasDarkClass()).toBe(false);
  });

  it('initializes from a persisted "dark" value and adds the dark class', async () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, COLOR_MODE.DARK);

    const { result } = await renderHook(() => useColorMode());

    expect(result.current.colorMode).toBe(COLOR_MODE.DARK);
    expect(hasDarkClass()).toBe(true);
  });

  it('initializes from a persisted "light" value without the dark class', async () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, COLOR_MODE.LIGHT);

    const { result } = await renderHook(() => useColorMode());

    expect(result.current.colorMode).toBe(COLOR_MODE.LIGHT);
    expect(hasDarkClass()).toBe(false);
  });

  it('falls back to "system" and logs when the persisted value is invalid', async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    stubPrefersColorScheme(false);
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, "not-a-real-mode");

    const { result } = await renderHook(() => useColorMode());

    expect(result.current.colorMode).toBe(COLOR_MODE.SYSTEM);
    expect(consoleError).toHaveBeenCalledWith("Failed to read color mode from localStorage", expect.any(Error));

    consoleError.mockRestore();
  });
});

describe("useColorMode — system mode follows the OS preference", () => {
  it('applies the dark class for "system" when the OS prefers dark', async () => {
    stubPrefersColorScheme(true);

    const { result } = await renderHook(() => useColorMode());

    expect(result.current.colorMode).toBe(COLOR_MODE.SYSTEM);
    expect(hasDarkClass()).toBe(true);
  });

  it('stays light for "system" when the OS prefers light', async () => {
    stubPrefersColorScheme(false);

    await renderHook(() => useColorMode());

    expect(hasDarkClass()).toBe(false);
  });

  it('reacts to OS changes while in "system" without changing the mode', async () => {
    const media = stubPrefersColorScheme(false);

    const { result } = await renderHook(() => useColorMode());
    expect(hasDarkClass()).toBe(false);

    media.emitChange(true);

    expect(hasDarkClass()).toBe(true);
    expect(result.current.colorMode).toBe(COLOR_MODE.SYSTEM);
  });
});

describe("useColorMode — setColorMode side effects", () => {
  it("toggles the dark class, persists, and emits an event when switching to dark", async () => {
    const events = captureColorModeEvents();
    const { result, act } = await renderHook(() => useColorMode());

    await act(() => {
      result.current.setColorMode(COLOR_MODE.DARK);
    });

    expect(result.current.colorMode).toBe(COLOR_MODE.DARK);
    expect(hasDarkClass()).toBe(true);
    expect(readStoredMode()).toBe(COLOR_MODE.DARK);
    expect(events.details.at(-1)).toBe(COLOR_MODE.DARK);

    events.stop();
  });

  it("removes the dark class again when switching back to light", async () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, COLOR_MODE.DARK);
    const { result, act } = await renderHook(() => useColorMode());
    expect(hasDarkClass()).toBe(true);

    await act(() => {
      result.current.setColorMode(COLOR_MODE.LIGHT);
    });

    expect(result.current.colorMode).toBe(COLOR_MODE.LIGHT);
    expect(hasDarkClass()).toBe(false);
    expect(readStoredMode()).toBe(COLOR_MODE.LIGHT);
  });

  it("dispatches a COLOR_MODE_EVENT carrying the new mode on every change", async () => {
    const events = captureColorModeEvents();
    const { result, act } = await renderHook(() => useColorMode());

    await act(() => {
      result.current.setColorMode(COLOR_MODE.DARK);
    });
    await act(() => {
      result.current.setColorMode(COLOR_MODE.LIGHT);
    });

    expect(events.details).toContain(COLOR_MODE.DARK);
    expect(events.details).toContain(COLOR_MODE.LIGHT);

    events.stop();
  });
});

afterEach(() => {
  document.documentElement.classList.remove(COLOR_MODE.DARK);
});
