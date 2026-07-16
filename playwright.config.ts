import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "test-results/playwright",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:5173/api/health",
    reuseExistingServer: true,
    timeout: 120_000
  },
  projects: [
    {
      name: "small-mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 320, height: 568 },
        isMobile: true,
        hasTouch: true
      }
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
        viewport: { width: 390, height: 844 }
      }
    },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 }
      }
    }
  ]
});
