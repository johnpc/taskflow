/** Guard a user-supplied href: allow only http(s) and mailto; reject
 * javascript:/data:/vbscript: and anything else (returns null). Mirrors the
 * link-safety rule from other apps — never render an unguarded href. */
export function safeHref(href: string): string | null {
  const trimmed = href.trim();
  // Allow protocol-relative + relative? Keep it strict: absolute http(s)/mailto.
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) return trimmed;
  return null;
}
