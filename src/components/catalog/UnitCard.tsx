import React from 'react';
import { ChevronLeft } from 'lucide-react';
import type { UnitData } from '../../data/curriculum';
import { CatalogMotif } from './CatalogMotif';
import { getUnitAccent, accentStyle } from './catalogAccents';

interface UnitCardProps {
  unit: UnitData;
}

/**
 * Catalog entry card for one registered curriculum unit.
 * All displayed data comes from the unit registry entry itself.
 */
export const UnitCard: React.FC<UnitCardProps> = ({ unit }) => {
  const accent = getUnitAccent(unit.number);
  const firstPage = Math.min(...unit.sourcePages);
  const lastPage = Math.max(...unit.sourcePages);
  const unitUrl = `#/unit/${unit.id}`;

  return (
    <article className="unit-card" style={accentStyle(accent) as React.CSSProperties}>
      <div className="unit-card-visual">
        <CatalogMotif variant={unit.number - 1} />
        <span className="unit-emblem">
          <span className="unit-emblem-label">الوحدة</span>
          <span className="unit-emblem-num">{unit.number}</span>
        </span>
      </div>

      <div className="unit-card-body">
        <span className="unit-card-pages">
          صفحات الكتاب {firstPage} – {lastPage}
        </span>
        <h3 className="unit-card-title">{unit.title}</h3>
        <p className="unit-card-desc">{unit.description}</p>

        <a className="unit-card-cta" href={unitUrl}>
          <span>دخول إلى الوحدة</span>
          <ChevronLeft size={18} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
};

export default UnitCard;
