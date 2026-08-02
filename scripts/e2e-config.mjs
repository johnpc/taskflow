/**
 * Pull amplify_outputs.json from the SANDBOX backend for local dev + CI
 * acceptance. Wraps `ampx generate outputs` and treats a correctly-written
 * outputs file as success even when the CLI process exits non-zero.
 *
 * Why the wrapper: `ampx generate outputs` writes the file and logs
 * "File written: amplify_outputs.json", then sometimes CRASHES on shutdown with
 * exit code 13 — "Detected unsettled top-level await" in its OpenTelemetry
 * tracer (an ampx + Node 24 teardown bug). The file is already correct; the
 * non-zero exit is a spurious post-write crash. So: decide success on whether a
 * VALID amplify_outputs.json exists — not on the exit code.
 *
 * Separately, the network call to AppSync intermittently dies with
 * `connect ETIMEDOUT …:443` (a GitHub-runner → AWS blip) and writes NO file — a
 * genuine transient failure that red-fails a random acceptance job (~20-min hang
 * each). So we also RETRY the generate a few times before giving up.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

const run = promisify(execFile);

const STACK = 'amplify-taskflow-xss-sandbox-86303460ee';
const PROFILE = 'personal';
const OUTPUTS = 'amplify_outputs.json';
const ATTEMPTS = 3;

const GENERATE_ARGS = ['ampx', 'generate', 'outputs', '--stack', STACK, '--profile', PROFILE];

/** True when amplify_outputs.json exists and parses with the keys the client
 * needs — proves the pull actually wrote a usable file. */
async function outputsAreValid() {
  try {
    const parsed = JSON.parse(await readFile(OUTPUTS, 'utf8'));
    return Boolean(parsed?.auth?.user_pool_id && parsed?.data?.url);
  } catch {
    return false;
  }
}

/** Run the generate once; a valid outputs file = success (the CLI may exit
 * non-zero on the post-write crash yet still have written the file). */
async function tryGenerate() {
  try {
    const { stdout } = await run('npx', GENERATE_ARGS, { encoding: 'utf8' });
    process.stdout.write(stdout);
  } catch (err) {
    process.stdout.write(`${err.stdout ?? ''}${err.stderr ?? ''}`);
  }
  return outputsAreValid();
}

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  if (await tryGenerate()) process.exit(0);
  console.error(`ampx generate outputs attempt ${attempt}/${ATTEMPTS} produced no valid file.`);
  if (attempt < ATTEMPTS) await sleep(5000);
}

console.error(`No valid ${OUTPUTS} after ${ATTEMPTS} attempts — cannot continue.`);
process.exit(1);
