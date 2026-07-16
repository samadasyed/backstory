import "@testing-library/jest-dom/vitest";

if (typeof HTMLMediaElement !== "undefined") {
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: () => Promise.resolve()
  });

  Object.defineProperty(HTMLMediaElement.prototype, "pause", {
    configurable: true,
    value: () => undefined
  });
}
