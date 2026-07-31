/**
 * Pull amplify_outputs.json from the SANDBOX backend for local dev + CI
 * acceptance. Wraps `ampx generate outputs` and treats a correctly-written
 * outputs file as success even when the CLI process exits non-zero.
 *
 * Why the wrapper: `ampx generate outputs` writes the file and logs
 * "File written: amplify_outputs.json", then sometimes CRASHES on shutdown with
 * exit code 13 — "Detected unsettled top-level await" in its OpenTelemetry
 * tracer (an ampx + Node 24 teardown bug). The file is already correct; the
 * non-zero exit is a spurious post-write crash. Because this step runs on EVERY
 * acceptance job (~60), that crash intermittently red-fails an otherwise-green
 * area. So: run the command, then decide success on whether a VALID
 * amplify_outputs.json exists — not on the exit code.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';

const run = promisify(execFile);

const STACK = 'amplify-taskflow-xss-sandbox-86303460ee';
const PROFILE = 'personal';
const OUTPUTS = 'amplify_outputs.json';

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

try {
  const { stdout } = await run('npx', GENERATE_ARGS, { encoding: 'utf8' });
  process.stdout.write(stdout);
} catch (err) {
  const out = `${err.stdout ?? ''}${err.stderr ?? ''}`;
  process.stdout.write(out);
  // The CLI exited non-zero. If it still wrote a valid outputs file, this is the
  // known post-write shutdown crash — swallow it. Otherwise the pull really failed.
  if (!(await outputsAreValid())) {
    console.error('ampx generate outputs failed and no valid amplify_outputs.json was written.');
    process.exit(1);
  }
  console.log(
    'ampx exited non-zero but a valid amplify_outputs.json was written — treating as success.',
  );
}

if (!(await outputsAreValid())) {
  console.error(`No valid ${OUTPUTS} after generate — cannot continue.`);
  process.exit(1);
}
