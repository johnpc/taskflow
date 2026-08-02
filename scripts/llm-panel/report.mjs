// Synthesize the panel's per-model feedback into one markdown report: a score
// table, then each panelist's notes, then an aggregated "what to fix" list
// ranked by how many panelists raised each theme.

function avg(nums) {
  const v = nums.filter((n) => typeof n === 'number');
  return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : '—';
}

export function renderReport(scenario, base, results) {
  const ok = results.filter((r) => r.feedback && !r.feedback.parseError);
  const lines = [];
  lines.push(`# Taskflow LLM feedback panel — ${scenario.title}`);
  lines.push('');
  lines.push(`Target: \`${base}\` · Panelists: ${results.length}`);
  lines.push('');

  // Score table.
  lines.push('## Scores');
  lines.push('');
  lines.push('| Panelist | Delight | Clarity | Steps | First impression |');
  lines.push('|---|---|---|---|---|');
  for (const r of results) {
    const f = r.feedback ?? {};
    lines.push(
      `| ${r.label} | ${f.delight ?? '—'} | ${f.clarity ?? '—'} | ${r.transcript?.length ?? '—'} | ${(f.firstImpression ?? r.error ?? '—').replace(/\|/g, '/')} |`,
    );
  }
  lines.push('');
  lines.push(
    `**Average delight ${avg(ok.map((r) => r.feedback.delight))}/10 · clarity ${avg(ok.map((r) => r.feedback.clarity))}/10**`,
  );
  lines.push('');

  // Aggregate improvement themes (naive fuzzy grouping by first 4 words).
  const themes = new Map();
  for (const r of ok) {
    for (const imp of r.feedback.top_improvements ?? []) {
      const key = imp.toLowerCase().split(/\s+/).slice(0, 4).join(' ');
      const e = themes.get(key) ?? { text: imp, votes: 0 };
      e.votes += 1;
      themes.set(key, e);
    }
  }
  const ranked = [...themes.values()].sort((a, b) => b.votes - a.votes);
  if (ranked.length) {
    lines.push('## Top improvements (ranked by how many panelists raised it)');
    lines.push('');
    for (const t of ranked) lines.push(`- **(${t.votes}×)** ${t.text}`);
    lines.push('');
  }

  // Per-panelist detail.
  lines.push('## Per-panelist feedback');
  lines.push('');
  for (const r of results) {
    lines.push(`### ${r.label}`);
    if (r.error) {
      lines.push(`> Run error: ${r.error}`);
      lines.push('');
      continue;
    }
    const f = r.feedback ?? {};
    if (f.parseError) {
      lines.push(`> Could not parse feedback JSON. Raw: ${f.raw}`);
      lines.push('');
      continue;
    }
    lines.push(`- **Delight ${f.delight}/10 · Clarity ${f.clarity}/10**`);
    lines.push(`- vs Asana: ${f.vs_asana ?? '—'}`);
    if (f.worked_well?.length) lines.push(`- 👍 ${f.worked_well.join('; ')}`);
    if (f.confusing_or_bad?.length) lines.push(`- 👎 ${f.confusing_or_bad.join('; ')}`);
    if (f.top_improvements?.length) lines.push(`- 🛠 ${f.top_improvements.join('; ')}`);
    lines.push('');
  }
  return lines.join('\n');
}
