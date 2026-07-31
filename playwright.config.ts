import { existsSync, readFileSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * Load .env.local (gitignored) for local runs so TEST_USERNAME / TEST_PASSWORD
 * are available without a dependency. In CI these come from GitHub secrets.
 */
if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

/**
 * Acceptance tests are written as Gherkin .feature files in e2e/features/
 * with step definitions in e2e/steps/. playwright-bdd compiles them into
 * Playwright specs under .features-gen/ at run time.
 */
const testDir = defineBddConfig({
  features: 'e2e/features/**/*.feature',
  steps: 'e2e/steps/**/*.ts',
  // Scenarios tagged @requires-deploy assert LIVE backend behavior (authz,
  // owner isolation, seeded reads) that only holds once a schema change is
  // deployed; excluded from default runs so they don't go red pre-deploy.
  // Include them with RUN_PENDING_DEPLOY=1 against a real sandbox.
  tags: process.env.RUN_PENDING_DEPLOY ? undefined : 'not @requires-deploy',
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  // Cap concurrency: every worker hits the SAME shared deployed backend. Too
  // many parallel workers overwhelm it and trip timeouts on reads/writes that
  // pass in isolation. A small pool trades wall-clock for stability.
  workers: 4,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  // 90s per test: most finish in seconds, but a few flows reload-until a
  // just-seeded task's GSI entry propagates on the shared backend under peak CI
  // load, which can take longer than the 60s default in the worst case.
  timeout: 90_000,
  // Reads against the shared backend can exceed Playwright's 5s default; give
  // assertions and actions more headroom so genuine slowness isn't a failure.
  expect: { timeout: 15_000 },
  // Port is overridable via TF_PORT so a local run can dodge another app already
  // holding 5173 (e.g. a sibling repo's dev server). CI uses the default 5173.
  use: {
    baseURL: `http://localhost:${process.env.TF_PORT ?? '5173'}`,
    // Grant clipboard read/write so copy-link flows can verify the copied URL.
    permissions: ['clipboard-read', 'clipboard-write'],
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    // SLOWMO=<ms> launches a visible browser that pauses between actions so a
    // human can watch the Gherkin run, e.g. `SLOWMO=600 npm run test:e2e`.
    launchOptions: { slowMo: Number(process.env.SLOWMO) || 0 },
    // VIDEO=1 records a .webm per test under test-results/ — used to attach a
    // demo artifact to a PR. Off by default so CI stays lean.
    video: process.env.VIDEO ? 'on' : 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${process.env.TF_PORT ?? '5173'} --strictPort`,
    url: `http://localhost:${process.env.TF_PORT ?? '5173'}`,
    // Don't adopt a stranger's server on the same port — only reuse when NOT in
    // CI AND we own the port. With a dedicated TF_PORT locally, start our own.
    reuseExistingServer: !process.env.CI && !process.env.TF_PORT,
    timeout: 120_000,
  },
});
