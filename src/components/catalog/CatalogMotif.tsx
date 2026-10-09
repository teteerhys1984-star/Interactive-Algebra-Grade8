import React from 'react';

/**
 * Decorative mathematical line motifs for catalog cards and heroes.
 * Pure stroke geometry rendered with `currentColor` — the parent scopes
 * `color` to the unit accent. Always `aria-hidden` (decoration only).
 */

interface MotifProps {
  /** Motif variant; cycles safely for any unit count. */
  variant?: number;
  className?: string;
}

const MOTIF_COUNT = 4;

export const CatalogMotif: React.FC<MotifProps> = ({ variant = 0, className }) => {
  const v = ((variant % MOTIF_COUNT) + MOTIF_COUNT) % MOTIF_COUNT;

  return (
    <svg
      className={className ?? 'unit-card-motif'}
      viewBox="0 0 400 160"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {v === 0 && (
        /* Rational numbers: coordinate axes, fraction bars, divided circle */
        <g fill="none" stroke="currentColor">
          <g opacity="0.16" strokeWidth="1">
            <path d="M0 80 H400" />
            <path d="M200 0 V160" />
            <path d="M40 0 V160 M120 0 V160 M280 0 V160 M360 0 V160 M0 40 H400 M0 120 H400" />
          </g>
          <g opacity="0.5" strokeWidth="1.6" strokeLinecap="round">
            {/* fraction bar pair */}
            <path d="M252 52 H312" strokeWidth="2.4" />
            <circle cx="282" cy="38" r="7" opacity="0.7" />
            <circle cx="282" cy="66" r="7" opacity="0.7" />
            {/* divided circle */}
            <circle cx="120" cy="80" r="34" strokeWidth="2" />
            <path d="M120 46 V114" opacity="0.8" />
            <path d="M120 80 L148 62" opacity="0.8" />
            <path d="M120 80 L94 104" opacity="0.45" />
            {/* operation marks */}
            <path d="M330 96 H352 M341 85 V107" opacity="0.8" />
            <path d="M330 126 H352" opacity="0.8" />
          </g>
        </g>
      )}
      {v === 1 && (
        /* Powers of ten: ascending bars swept by an exponential curve */
        <g fill="none" stroke="currentColor">
          <g opacity="0.16" strokeWidth="1">
            <path d="M0 132 H400" />
            <path d="M40 0 V160" />
          </g>
          <g opacity="0.55" strokeWidth="2">
            <path d="M84 124 V120 M124 124 V108 M164 124 V88 M204 124 V54 M244 124 V18" strokeLinecap="round" />
            <path d="M70 124 Q170 122 214 74 T262 12" strokeWidth="2.4" strokeLinecap="round" />
          </g>
          <g opacity="0.85" fill="currentColor" stroke="none">
            <circle cx="84" cy="120" r="3.4" />
            <circle cx="124" cy="108" r="3.4" />
            <circle cx="164" cy="88" r="3.4" />
            <circle cx="204" cy="54" r="3.4" />
            <circle cx="244" cy="18" r="3.4" />
          </g>
          <g opacity="0.4" strokeWidth="1.6" strokeLinecap="round">
            <path d="M300 96 l10 -22 l10 22" />
            <path d="M330 78 l9 -18 l9 18" opacity="0.7" />
          </g>
        </g>
      )}
      {v === 2 && (
        /* Curve study: axes, parabola, tangent, sampled points */
        <g fill="none" stroke="currentColor">
          <g opacity="0.16" strokeWidth="1">
            <path d="M0 130 H400" />
            <path d="M110 0 V160" />
            <path d="M0 66 H400" opacity="0.6" />
          </g>
          <path d="M40 18 Q150 190 250 78 T396 40" opacity="0.55" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M196 128 L300 44" opacity="0.45" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="6 7" />
          <g fill="currentColor" stroke="none" opacity="0.85">
            <circle cx="110" cy="130" r="3.4" />
            <circle cx="232" cy="86" r="3.4" />
            <circle cx="330" cy="50" r="3.4" />
          </g>
        </g>
      )}
      {v === 3 && (
        /* Geometric rings: concentric arcs with a radial lattice */
        <g fill="none" stroke="currentColor">
          <g opacity="0.5" strokeWidth="1.8">
            <circle cx="200" cy="80" r="18" />
            <circle cx="200" cy="80" r="38" opacity="0.7" />
            <circle cx="200" cy="80" r="58" opacity="0.45" />
            <circle cx="200" cy="80" r="78" opacity="0.28" />
          </g>
          <g opacity="0.35" strokeWidth="1.2" strokeLinecap="round">
            <path d="M200 80 L272 38" />
            <path d="M200 80 L132 128" />
            <path d="M200 80 L200 2" />
            <path d="M200 80 L286 108" />
          </g>
          <g fill="currentColor" stroke="none" opacity="0.8">
            <circle cx="272" cy="38" r="3" />
            <circle cx="132" cy="128" r="3" />
            <circle cx="286" cy="108" r="3" />
          </g>
        </g>
      )}
    </svg>
  );
};

/** Wide architectural motif used behind the home hero. */
export const HeroMotif: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className ?? 'catalog-hero-motif'}
    viewBox="0 0 560 420"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <g fill="none">
      {/* faint coordinate lattice */}
      <g stroke="#94a3b8" opacity="0.14" strokeWidth="1">
        <path d="M60 0 V420 M140 0 V420 M220 0 V420 M300 0 V420 M380 0 V420 M460 0 V420" />
        <path d="M0 60 H560 M0 140 H560 M0 220 H560 M0 300 H560 M0 380 H560" />
      </g>
      {/* axes */}
      <g stroke="#94a3b8" opacity="0.3" strokeWidth="1.4">
        <path d="M0 300 H560" />
        <path d="M140 0 V420" />
      </g>
      {/* cyan rational curve */}
      <path
        d="M20 340 Q170 300 250 210 T520 70"
        stroke="#22d3ee"
        opacity="0.55"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* violet parabola */}
      <path
        d="M110 60 Q 300 430 490 90"
        stroke="#a78bfa"
        opacity="0.4"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* cosine hint */}
      <path
        d="M0 300 Q 70 240 140 300 T 280 300 T 420 300 T 560 300"
        stroke="#67e8f9"
        opacity="0.22"
        strokeWidth="1.6"
      />
      {/* sampled points */}
      <g fill="#22d3ee" opacity="0.8">
        <circle cx="250" cy="210" r="4" />
        <circle cx="385" cy="120" r="4" />
      </g>
      <g fill="#a78bfa" opacity="0.7">
        <circle cx="300" cy="376" r="4" />
        <circle cx="490" cy="90" r="4" />
      </g>
      {/* exponent bars */}
      <g stroke="#a78bfa" opacity="0.35" strokeWidth="2.4" strokeLinecap="round">
        <path d="M468 300 V286 M490 300 V268 M512 300 V240 M534 300 V196" />
      </g>
    </g>
  </svg>
);

export default CatalogMotif;
