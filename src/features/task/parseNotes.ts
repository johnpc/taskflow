import { safeHref } from './safeHref';

export type Inline =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'link'; text: string; href: string };

export interface NoteLine {
  /** 'check' = a "[ ]"/"[x]" checklist item; 'text' = a normal line. */
  kind: 'check' | 'text';
  checked?: boolean;
  content: Inline[];
}

const LINK = /\[([^\]]+)\]\(([^)]+)\)/;
const BOLD = /\*\*([^*]+)\*\*/;

/** Parse one line's inline spans: **bold** and [label](url) (url guarded by
 * safeHref — an unsafe link degrades to plain text). Pure + total. */
export function parseInline(line: string): Inline[] {
  const out: Inline[] = [];
  let rest = line;
  while (rest) {
    const link = LINK.exec(rest);
    const bold = BOLD.exec(rest);
    const next = [link, bold].filter(Boolean).sort((a, b) => a!.index - b!.index)[0];
    if (!next) {
      out.push({ kind: 'text', text: rest });
      break;
    }
    if (next.index > 0) out.push({ kind: 'text', text: rest.slice(0, next.index) });
    if (next === link) {
      const href = safeHref(link![2]);
      out.push(href ? { kind: 'link', text: link![1], href } : { kind: 'text', text: link![0] });
    } else {
      out.push({ kind: 'bold', text: bold![1] });
    }
    rest = rest.slice(next.index + next[0].length);
  }
  return out;
}

/** Parse notes into lines, detecting "[ ]"/"[x]" checklist items. Pure + total. */
export function parseNotes(notes: string | null | undefined): NoteLine[] {
  if (!notes) return [];
  return notes.split('\n').map((raw) => {
    const check = /^\s*\[( |x|X)\]\s?(.*)$/.exec(raw);
    if (check) {
      return {
        kind: 'check',
        checked: check[1].toLowerCase() === 'x',
        content: parseInline(check[2]),
      };
    }
    return { kind: 'text', content: parseInline(raw) };
  });
}
