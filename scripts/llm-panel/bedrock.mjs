// Thin wrapper over the Bedrock Converse API (no SDK dep — signs requests with
// SigV4 by shelling out to `aws bedrock-runtime converse`). Every panelist model
// is reached through this one call, so the panel is genuinely multi-vendor
// (Anthropic / Amazon / Meta / Mistral) with identical plumbing.
//
// AWS_PROFILE=personal + region us-west-2 are the project defaults; never inline
// keys.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REGION = process.env.AWS_REGION || 'us-west-2';
const PROFILE = process.env.AWS_PROFILE || 'personal';

/** Run the aws CLI and resolve parsed JSON stdout (rejects on non-zero exit). */
function awsJson(args, { input } = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn('aws', args, { env: { ...process.env, AWS_PROFILE: PROFILE } });
    let out = '';
    let err = '';
    proc.stdout.on('data', (d) => (out += d));
    proc.stderr.on('data', (d) => (err += d));
    proc.on('close', (code) => {
      if (code !== 0) return reject(new Error(`aws ${args[0]} ${args[1]} failed: ${err.trim()}`));
      try {
        resolve(JSON.parse(out));
      } catch (e) {
        reject(new Error(`bad JSON from aws: ${e.message}\n${out.slice(0, 400)}`));
      }
    });
  });
}

/**
 * One Converse turn. `messages` is the running Bedrock message array; `image` is
 * an optional PNG buffer appended to the latest user turn so the model can see
 * the current screen. Returns the assistant's text.
 */
export async function converse({ modelId, system, messages, image, maxTokens = 1200 }) {
  const msgs = messages.map((m) => ({ role: m.role, content: [{ text: m.content }] }));
  if (image && msgs.length) {
    msgs[msgs.length - 1].content.push({
      image: { format: 'png', source: { bytes: image.toString('base64') } },
    });
  }
  const body = {
    messages: msgs,
    inferenceConfig: { maxTokens, temperature: 0.4 },
    ...(system ? { system: [{ text: system }] } : {}),
  };
  // The payload (with a base64 screenshot) is far past ARG_MAX, so hand it to the
  // CLI via a temp file rather than an inline argument.
  const dir = mkdtempSync(join(tmpdir(), 'panel-'));
  const bodyPath = join(dir, 'req.json');
  writeFileSync(bodyPath, JSON.stringify(body));
  const res = await awsJson([
    'bedrock-runtime',
    'converse',
    '--region',
    REGION,
    '--model-id',
    modelId,
    '--cli-input-json',
    `file://${bodyPath}`,
  ]);
  const parts = res.output?.message?.content ?? [];
  return parts
    .map((p) => p.text ?? '')
    .join('')
    .trim();
}
