// The agentic loop: give a Bedrock vision model a screenshot + a compact list of
// the interactive elements on the page, let it choose ONE action per turn, run
// it with Playwright, and repeat until it says done or hits the step cap.
//
// Actions are DOM-target based (by visible text / label / testid), not pixel
// coordinates — far more reliable across models than coordinate clicking.
import { converse } from './bedrock.mjs';

const ACTIONS = `You control a real web browser to accomplish a goal on a task-management web app.
Each turn you receive a screenshot and a numbered list of interactive elements.
Respond with ONE action as a single line of JSON (no prose, no code fences):
  {"action":"click","target":<number>}            - click element by its number
  {"action":"type","target":<number>,"text":"..."} - focus element, type text
  {"action":"enter","target":<number>}             - focus element, press Enter (submit)
  {"action":"goto","path":"/my-tasks"}             - navigate to an in-app path
  {"action":"note","text":"..."}                   - record an observation, no browser change
  {"action":"done","text":"..."}                   - finished; text summarizes what you did
Prefer clicking visible buttons/links. Work toward the goal step by step.`;

/** Snapshot the page's interactive elements into a numbered, model-readable list
 * and a parallel array of Playwright handles. Kept small so it fits the prompt. */
async function inventory(page) {
  const handles = await page.$$(
    'button, a, input, textarea, select, [role="button"], [data-testid]',
  );
  const items = [];
  const kept = [];
  for (const h of handles) {
    if (kept.length >= 60) break;
    const visible = await h.isVisible().catch(() => false);
    if (!visible) continue;
    const info = await h
      .evaluate((el) => {
        const t = (
          el.getAttribute('aria-label') ||
          el.getAttribute('placeholder') ||
          el.value ||
          el.innerText ||
          el.getAttribute('data-testid') ||
          ''
        )
          .trim()
          .slice(0, 60);
        return { tag: el.tagName.toLowerCase(), t };
      })
      .catch(() => null);
    if (!info || !info.t) continue;
    kept.push(h);
    items.push(`${kept.length - 1}: <${info.tag}> ${info.t}`);
  }
  return { list: items.join('\n'), handles: kept };
}

async function runAction(page, act, handles) {
  const el = typeof act.target === 'number' ? handles[act.target] : null;
  if (act.action === 'goto') return page.goto(act.path).then(() => page.waitForTimeout(1500));
  if (!el && ['click', 'type', 'enter'].includes(act.action)) return;
  if (act.action === 'click')
    return el.click({ timeout: 5000 }).then(() => page.waitForTimeout(1200));
  if (act.action === 'type') {
    await el.click({ timeout: 5000 }).catch(() => {});
    await el.fill('').catch(() => {});
    await el.type(act.text ?? '', { delay: 20 });
    return page.waitForTimeout(600);
  }
  if (act.action === 'enter') {
    await el.click({ timeout: 5000 }).catch(() => {});
    await el.type(act.text ?? '', { delay: 20 }).catch(() => {});
    await page.keyboard.press('Enter');
    return page.waitForTimeout(1200);
  }
}

function parseAction(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return { action: 'note', text: text.slice(0, 120) };
  try {
    return JSON.parse(m[0]);
  } catch {
    return { action: 'note', text: text.slice(0, 120) };
  }
}

/**
 * Drive `page` toward `goal` with `modelId` for up to `maxSteps`. Calls
 * onStep({ n, action, shotPath }) after each turn (for transcript/screenshots).
 * Returns the running transcript of actions.
 */
export async function runAgent({ page, modelId, goal, maxSteps = 22, onStep }) {
  const messages = [];
  const transcript = [];
  for (let n = 1; n <= maxSteps; n++) {
    const shot = await page.screenshot();
    const { list, handles } = await inventory(page);
    const user =
      n === 1
        ? `GOAL: ${goal}\n\nInteractive elements:\n${list}\n\nChoose your first action.`
        : `Interactive elements now:\n${list}\n\nChoose the next action toward the goal.`;
    messages.push({ role: 'user', content: user });
    let reply;
    try {
      reply = await converse({ modelId, system: ACTIONS, messages, image: shot });
    } catch (e) {
      transcript.push({ n, error: e.message });
      break;
    }
    messages.push({ role: 'assistant', content: reply });
    const act = parseAction(reply);
    transcript.push({ n, action: act, raw: reply.slice(0, 200) });
    if (onStep) await onStep({ n, action: act });
    if (act.action === 'done') break;
    try {
      await runAction(page, act, handles);
    } catch (e) {
      messages.push({ role: 'user', content: `That action failed: ${e.message}. Try another.` });
    }
  }
  return transcript;
}
