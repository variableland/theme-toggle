import { afterEach, beforeEach, vi } from "vitest";
import { COLOR_MODE } from "../../src/const.ts";

function resetEnvironment() {
  localStorage.clear();
  document.documentElement.classList.remove(COLOR_MODE.DARK);
  Reflect.deleteProperty(window, "__COLOR_MODE__");
  vi.unstubAllGlobals();
}

beforeEach(resetEnvironment);
afterEach(resetEnvironment);
