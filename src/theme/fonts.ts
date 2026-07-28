/**
 * Brand fonts, bundled via fontsource (not a CDN) so the app works offline
 * inside Capacitor. Only the weights the design uses are imported, to keep the
 * bundle lean.
 *
 * - Inter (sans): all UI chrome, task titles, and body text.
 * - Newsreader (serif): the marketing hero / empty-state display copy.
 */

// Inter — 400 (body), 500 (labels), 600 (headings/buttons), 700 (display)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

// Newsreader — 500/600 for editorial display copy
import '@fontsource/newsreader/500.css';
import '@fontsource/newsreader/600.css';
