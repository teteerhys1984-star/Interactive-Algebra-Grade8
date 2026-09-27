import React, { useState } from 'react';
import { Math } from '../math/Math';
import { MathText } from '../math/MathText';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface IntruderItem {
  fraction: string;
  value: number;
  isIntruder: boolean;
}

export interface IntruderList {
  id: string;
  label: string;
  items: IntruderItem[];
  explanation: string;
}

export interface IntruderFinderProps {
  lists: IntruderList[];
}

export const IntruderFinderQuestion: React.FC<IntruderFinderProps> = ({ lists }) => {
  const [selectedMap, setSelectedMap] = useState<Record<string, number>>({});
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});

  const handleSelect = (listId: string, itemIndex: number) => {
    setSelectedMap((prev) => ({ ...prev, [listId]: itemIndex }));
    setRevealedMap((prev) => ({ ...prev, [listId]: true }));
  };

  return (
    <div className="intruder-container">
      {lists.map((list) => {
        const selectedIndex = selectedMap[list.id];
        const isRevealed = revealedMap[list.id];
        const selectedItem = selectedIndex !== undefined ? list.items[selectedIndex] : null;

        return (
          <div key={list.id} className="interactive-card" style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontWeight: 800, marginBottom: '0.75rem', color: 'var(--color-slate-800)' }}>
              {list.label}
            </h4>

            <div className="intruder-grid">
              {list.items.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                let btnClass = 'intruder-card-btn';
                if (isRevealed) {
                  if (item.isIntruder) {
                    btnClass += ' correct-intruder';
                  } else if (isSelected) {
                    btnClass += ' selected-intruder';
                  }
                }

                return (
                  <button
                    key={idx}
                    className={btnClass}
                    onClick={() => handleSelect(list.id, idx)}
                  >
                    <Math math={item.fraction} />
                  </button>
                );
              })}
            </div>

            {isRevealed && selectedItem && (
              <div className={`feedback-box ${selectedItem.isIntruder ? 'success' : 'info'}`}>
                {selectedItem.isIntruder ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <div>
                  <strong>{selectedItem.isIntruder ? 'أحسنت! هذا هو الكسر الدخيل.' : 'ملاحظة تعليمية:'}</strong>
                  <div style={{ marginTop: '0.4rem' }}>
                    <MathText text={list.explanation} />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default IntruderFinderQuestion;
