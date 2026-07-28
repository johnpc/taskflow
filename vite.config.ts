/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: ['es2020', 'chrome67', 'safari14', 'firefox68', 'edge79'],
    rollupOptions: {
      output: {
        // Split the heavy vendors into their own chunks. They change far less
        // often than app code, so they stay cached across deploys, and the
        // browser can parse them in parallel — keeps first paint fast.
        manualChunks: {
          amplify: ['aws-amplify'],
          ionic: ['@ionic/react', '@ionic/react-router', 'ionicons'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
  plugins: [react(), legacy({ modernTargets: 'chrome>=67, safari>=14, firefox>=68, edge>=79' })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    // Generous timeout so async hook/waitFor tests don't flake under the CPU
    // contention of the pre-commit hook (build + tests running together).
    testTimeout: 15000,
    // Acceptance tests live in e2e/ and run under Playwright, not Vitest.
    // .features-gen/ holds Playwright-BDD's generated specs — never Vitest's.
    exclude: ['node_modules', 'dist', 'e2e', '.features-gen', '.idea', '.git', '.cache', '.claude'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      // Measure EVERY source + amplify LOGIC file, even untested ones.
      all: true,
      include: ['src/**/*.{ts,tsx}', 'amplify/**/*.ts'],
      // Excluded: tests, type decls, setup — AND declarative amplify files
      // (resource/backend config, fixture data) + the seed runner entrypoint
      // (side-effects on import; its logic lives in tested helpers). Backend
      // LOGIC (seed helpers) IS measured — fix low coverage with tests.
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/vite-env.d.ts',
        'src/setupTests.ts',
        'src/test/**',
        'amplify/**/resource.ts',
        'amplify/backend.ts',
        'amplify/seed/fixtures/**',
        // Composition roots: pure provider/route wiring + Amplify.configure from
        // the generated outputs (environment config, not logic). No unit-testable
        // surface — exercised end-to-end by the Playwright acceptance suite.
        'src/main.tsx',
        'src/App.tsx',
        'src/AppRoutes.tsx',
        'src/lib/amplify.ts',
        // Seed/maintenance runner entrypoints: side-effecting scripts (Amplify
        // config on import, sign in, mutate, exit) with no unit-testable surface
        // — the seeding LOGIC lives in the tested seedWorkspace helper. Run
        // manually against a live backend.
        'amplify/seed/seed.ts',
        'amplify/seed/seedClient.ts',
        'amplify/seed/clearAll.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
