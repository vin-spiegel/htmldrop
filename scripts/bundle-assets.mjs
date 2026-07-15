// Copy runtime assets into dist/ so they survive the deploy image regardless
// of the builder (Railpack does not reliably keep loose root files / web/dist).
// - dist/AGENTS.md   → served at /agents.md
// - dist/landing/*   → the static Astro landing (served by the Express app)
import { copyFileSync, cpSync, rmSync, existsSync } from 'node:fs';

copyFileSync('AGENTS.md', 'dist/AGENTS.md');

if (existsSync('dist/landing')) rmSync('dist/landing', { recursive: true, force: true });
cpSync('web/dist', 'dist/landing', { recursive: true });

console.log('bundled AGENTS.md and web/dist -> dist/landing');
