// LLM feedback panel: point a panel of different vendors' vision models at a
// running Taskflow instance, let each drive a real browser (Playwright) to
// organize a project, then collect structured product feedback and synthesize a
// report. See CLAUDE.md > "LLM feedback panel".
//
//   npm run panel                 # default: wedding scenario vs the dev server
//   PANEL_SCENARIO=trip npm run panel
//   PANEL_BASE=https://taskflow.example npm run panel   # target a deployed URL
//
// Env: TEST_USERNAME / TEST_PASSWORD (from .env.local) to sign in; AWS_PROFILE
//=personal for Bedrock. Output: /tmp/tf-panel/<runId>/ (transcripts, shots,
// report.md).
import { chromium } from '@playwright/test';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runAgent } from './agent.mjs';
import { converse } from './bedrock.mjs';
import { PANEL, SCENARIOS, FEEDBACK_PROMPT } from './scenarios.mjs';
import { renderReport } from './report.mjs';

if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const BASE = process.env.PANEL_BASE || 'http://localhost:5173';
const SCENARIO = SCENARIOS[process.env.PANEL_SCENARIO || 'wedding'];
const OUT = join('/tmp/tf-panel', String(process.env.PANEL_RUN_ID || 'run'));

async function signIn(page) {
  await page.goto(`${BASE}/signin`);
  await page.getByLabel('Email').waitFor({ timeout: 20_000 });
  await page.getByLabel('Email').fill(process.env.TEST_USERNAME);
  await page.getByLabel('Password').fill(process.env.TEST_PASSWORD);
  await page.getByTestId('signin-submit').click();
  await page.getByTestId('home-greeting').waitFor({ timeout: 25_000 });
}

async function askFeedback(modelId, transcript) {
  const summary = transcript
    .map((t) => (t.action ? `${t.n}. ${JSON.stringify(t.action)}` : `${t.n}. error: ${t.error}`))
    .join('\n');
  const reply = await converse({
    modelId,
    system: FEEDBACK_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Here is what you did:\n${summary}\n\nNow give your product feedback as JSON.`,
      },
    ],
    maxTokens: 900,
  });
  const m = reply.match(/\{[\s\S]*\}/);
  try {
    return JSON.parse(m[0]);
  } catch {
    return { parseError: true, raw: reply.slice(0, 500) };
  }
}

async function runPanelist(browser, panelist) {
  const dir = join(OUT, panelist.key);
  mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const result = { ...panelist, steps: [] };
  try {
    await signIn(page);
    const goal = `${SCENARIO.persona}\n\n${SCENARIO.goal}`;
    result.transcript = await runAgent({
      page,
      modelId: panelist.modelId,
      goal,
      onStep: async ({ n }) => {
        await page.screenshot({ path: join(dir, `step-${String(n).padStart(2, '0')}.png`) });
      },
    });
    await page.screenshot({ path: join(dir, 'final.png') });
    result.feedback = await askFeedback(panelist.modelId, result.transcript);
  } catch (e) {
    result.error = e.message;
  } finally {
    await ctx.close();
  }
  writeFileSync(join(dir, 'result.json'), JSON.stringify(result, null, 2));
  return result;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  // PANEL_ONLY=claude,nova runs a subset (cheaper smoke runs); default = all.
  const only = (process.env.PANEL_ONLY || '').split(',').filter(Boolean);
  const panel = only.length ? PANEL.filter((p) => only.includes(p.key)) : PANEL;
  console.log(`LLM panel — scenario "${SCENARIO.title}" vs ${BASE}`);
  console.log(`Panel: ${panel.map((p) => p.label).join(', ')}\nOutput: ${OUT}\n`);
  const browser = await chromium.launch();
  const results = [];
  for (const panelist of panel) {
    console.log(`▶ ${panelist.label} …`);
    const r = await runPanelist(browser, panelist);
    const d = r.feedback?.delight ?? '—';
    console.log(
      `  ${r.error ? 'ERROR: ' + r.error : `done (delight ${d}/10, ${r.transcript?.length} steps)`}`,
    );
    results.push(r);
  }
  await browser.close();
  const report = renderReport(SCENARIO, BASE, results);
  writeFileSync(join(OUT, 'report.md'), report);
  console.log(`\n✅ Report: ${join(OUT, 'report.md')}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
