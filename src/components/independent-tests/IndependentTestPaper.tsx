import React from 'react';
import { GraduationCap, Layers } from 'lucide-react';
import { Math as Formula } from '../math/Math';
import { MathText } from '../math/MathText';
import { MbndParallelogramFigure } from './IndependentTestFigures';
import type { IndependentTest, IndependentTestItem } from '../../data/independent-tests/types';

/**
 * ورقة الأسئلة لاختبار مستقل واحد.
 *
 * تُعرض الورقة كما وردت في المصدر: أقسام مرقّمة (أولاً/ثانياً/ثالثاً) ثم
 * سؤال/تمرين/مسألة ثم بنود مرقّمة، مع الخيارات والرسم الهندسي. لا تُعرض أي
 * حلول هنا؛ الحلول في `IndependentTestSolutions` خلف بوابة كلمة السر.
 */

const ItemNumber: React.FC<{ value: string }> = ({ value }) => (
  <span className="itest-item-number" aria-hidden="true">{value}</span>
);

const ChoiceList: React.FC<{ item: IndependentTestItem }> = ({ item }) => (
  <ul className="itest-choices" aria-label="الخيارات المقترحة">
    {item.choices?.map((choice) => (
      <li key={choice.id} className="itest-choice">
        <span className="itest-choice-letter" aria-hidden="true">{choice.id.toUpperCase()}</span>
        <span className="itest-choice-label"><MathText text={choice.label} /></span>
      </li>
    ))}
  </ul>
);

const TrueFalsePlaceholder: React.FC = () => (
  <p className="itest-true-false" aria-hidden="true">
    <span className="itest-true-false-slot">صح</span>
    <span className="itest-true-false-sep">/</span>
    <span className="itest-true-false-slot">خطأ</span>
  </p>
);

const Figure: React.FC<{ item: IndependentTestItem }> = ({ item }) =>
  item.figure ? <MbndParallelogramFigure variant={item.figure} /> : null;

const Item: React.FC<{ item: IndependentTestItem }> = ({ item }) => (
  <li className="itest-item">
    <div className="itest-item-head">
      {item.number && <ItemNumber value={item.number} />}
      {item.prompt && (
        <p className="itest-item-prompt">
          <MathText text={item.prompt} />
        </p>
      )}
    </div>

    {item.math && (
      <div className="itest-item-math">
        <Formula math={item.math} display />
      </div>
    )}

    {item.note && (
      <p className="itest-item-note">
        <MathText text={item.note} />
      </p>
    )}

    <Figure item={item} />

    {item.choices && <ChoiceList item={item} />}
    {item.kind === 'true-false' && <TrueFalsePlaceholder />}

    {item.parts && (
      <div className="itest-parts">
        {item.partsLabel && <p className="itest-parts-label">{item.partsLabel}</p>}
        <ol className="itest-parts-list">
          {item.parts.map((part) => (
            <li key={part.id} className="itest-part">
              <span className="itest-item-number" aria-hidden="true">{part.number}</span>
              <p className="itest-part-prompt"><MathText text={part.prompt} /></p>
            </li>
          ))}
        </ol>
      </div>
    )}
  </li>
);

interface IndependentTestPaperProps {
  test: IndependentTest;
}

export const IndependentTestPaper: React.FC<IndependentTestPaperProps> = ({ test }) => (
  <article className="itest-paper" aria-labelledby={`${test.id}-title`}>
    <header className="itest-paper-header">
      <p className="itest-paper-eyebrow">
        <GraduationCap size={16} aria-hidden="true" /> ورقة اختبار
      </p>
      <h2 id={`${test.id}-title`}>{test.title}</h2>
      <p className="itest-paper-subtitle">{test.subtitle}</p>
      <p className="itest-paper-description">{test.description}</p>
    </header>

    {test.sections.map((section) => (
      <section key={section.id} className="itest-section" aria-labelledby={`${section.id}-heading`}>
        <header className="itest-section-header">
          <h3 id={`${section.id}-heading`} className="itest-section-title">
            <span className="itest-section-heading">{section.heading}</span>
            <span className="itest-section-subtitle">{section.title}</span>
          </h3>
          {section.pointsLabel && (
            <span className="itest-section-points">
              <Layers size={14} aria-hidden="true" /> {section.pointsLabel}
            </span>
          )}
        </header>

        {section.blocks.map((block) => (
          <div key={block.id} className="itest-block">
            <h4 className="itest-block-heading">{block.heading}</h4>
            {block.instruction && (
              <p className="itest-block-instruction"><MathText text={block.instruction} /></p>
            )}
            <ol className="itest-items">
              {block.items.map((item) => (
                <Item key={item.id} item={item} />
              ))}
            </ol>
          </div>
        ))}
      </section>
    ))}
  </article>
);

export default IndependentTestPaper;
