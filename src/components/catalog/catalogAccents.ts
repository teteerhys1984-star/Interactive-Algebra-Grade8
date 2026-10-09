/**
 * Presentational accent system for the catalog layer.
 *
 * Accents are chosen purely by unit order (unit.number is the registry's
 * ordering key), so any unit added through the normal curriculum
 * registration automatically receives a coherent accent without new
 * metadata. This is visual styling only — curriculum metadata such as
 * titles, IDs, and ordering is never duplicated here.
 */

export interface UnitAccent {
  /** Primary accent color (emblem, badges, CTA). */
  main: string;
  /** Soft translucent glow for surfaces. */
  soft: string;
  /** Translucent border/line color. */
  line: string;
}

const UNIT_ACCENTS: UnitAccent[] = [
  { main: '#22d3ee', soft: 'rgba(34, 211, 238, 0.14)', line: 'rgba(34, 211, 238, 0.42)' },   // electric cyan
  { main: '#a78bfa', soft: 'rgba(167, 139, 250, 0.15)', line: 'rgba(167, 139, 250, 0.44)' }, // refined violet
  { main: '#38bdf8', soft: 'rgba(56, 189, 248, 0.14)', line: 'rgba(56, 189, 248, 0.42)' },   // sky
  { main: '#818cf8', soft: 'rgba(129, 140, 248, 0.15)', line: 'rgba(129, 140, 248, 0.44)' }, // indigo
];

/** Resolve the catalog accent for a unit, cycling by its registry number. */
export function getUnitAccent(unitNumber: number): UnitAccent {
  const index = (Math.max(1, unitNumber) - 1) % UNIT_ACCENTS.length;
  return UNIT_ACCENTS[index];
}

/** CSS custom properties to set on a card/hero root element. */
export function accentStyle(accent: UnitAccent): Record<string, string> {
  return {
    '--accent': accent.main,
    '--accent-soft': accent.soft,
    '--accent-line': accent.line,
  } as Record<string, string>;
}
