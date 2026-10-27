import React from 'react';
import { BadgeCheck, ListChecks } from 'lucide-react';
import { Math as Formula } from '../math/Math';
import { MathText } from '../math/MathText';
import { MbndParallelogramFigure } from './IndependentTestFigures';
import type {
  IndependentSolution,
  IndependentSolutionMap,
  IndependentTest,
  IndependentTestItem,
} from '../../data/independent-tests/types';

/**
 * ورقة الحلول لاختبار مستقل، بنفس ترتيب ورقة الأسئلة ومعرّفات بنودها.
 *
 * كل حل مربوط بمعرّف البند الذي يجيبه؛ فإن غاب حل بند ظهر تنبيه صريح بدل
 * ربطه بحل بند آخر. والبنود التي تُرقَّم بنودها الفرعية في المصدر تُعرض
 * كسياق (نص المعطيات والرسم) ثم تُحلّ بنودها الفرعية واحدًا واحدًا.
 */

const SolutionBody: React.FC<{ solution: IndependentSolution }> = ({ solution }) => (
  <>
    <ol className="itest-solution-steps">
      {solution.steps.map((step, index) => (
        <li key={index} className="itest-solution-step">
          <span className="itest-solution-step-index" aria-hidden="true">
            {(index + 1).toLocaleString('ar')}
          </span>
          <span className="itest-solution-step-text"><MathText text={step} /></span>
        </li>
      ))}
    </ol>
    {solution.figure && <MbndParallelogramFigure variant={solution.figure} />}
    <p className="itest-solution-final">
      <BadgeCheck size={17} aria-hidden="true" />
      <span><MathText text={solution.finalAnswer} /></span>
    </p>
  </>
);

const StatementContext: React.FC<{ item: IndependentTestItem }> = ({ item }) => (
  <li className="itest-solution-context">
    {item.prompt && <p className="itest-solution-prompt"><MathText text={item.prompt} /></p>}
    {item.math && <div className="itest-item-math"><Formula math={item.math} display /></div>}
    {item.figure && <MbndParallelogramFigure variant={item.figure} />}
    {item.partsLabel && <p className="itest-solution-context-label">{item.partsLabel}</p>}
  </li>
);

const SolutionCard: React.FC<{
  number?: string;
  prompt?: string;
  math?: string;
  solution?: IndependentSolution;
}> = ({ number, prompt, math, solution }) => (
  <li className="itest-solution-card">
    {(number || prompt || math) && (
      <div className="itest-solution-head">
        {number && <span className="itest-item-number" aria-hidden="true">{number}</span>}
        <div className="itest-solution-head-body">
          {prompt && <p className="itest-solution-prompt"><MathText text={prompt} /></p>}
          {math && <div className="itest-item-math"><Formula math={math} display /></div>}
        </div>
      </div>
    )}
    {solution ? (
      <SolutionBody solution={solution} />
    ) : (
      <p className="itest-solution-missing" role="note">لا يوجد حل مسجّل لهذا البند بعد.</p>
    )}
  </li>
);

interface IndependentTestSolutionsProps {
  test: IndependentTest;
  solutions: IndependentSolutionMap | null;
}

export const IndependentTestSolutions: React.FC<IndependentTestSolutionsProps> = ({
  test,
  solutions,
}) => {
  if (!solutions) {
    return (
      <p className="itest-solutions-loading" role="status">
        <ListChecks size={18} aria-hidden="true" /> جارٍ تحميل الحلول…
      </p>
    );
  }

  return (
    <article className="itest-solutions" aria-labelledby={`${test.id}-solutions-title`}>
      <header className="itest-paper-header">
        <p className="itest-paper-eyebrow">
          <ListChecks size={16} aria-hidden="true" /> حلول تفصيلية
        </p>
        <h2 id={`${test.id}-solutions-title`}>{test.title}</h2>
        <p className="itest-paper-subtitle">{test.subtitle}</p>
      </header>

      {test.sections.map((section) => (
        <section key={section.id} className="itest-section">
          <header className="itest-section-header">
            <h3 className="itest-section-title">
              <span className="itest-section-heading">{section.heading}</span>
              <span className="itest-section-subtitle">{section.title}</span>
            </h3>
          </header>

          {section.blocks.map((block) => (
            <div key={block.id} className="itest-block">
              <h4 className="itest-block-heading">{block.heading}</h4>
              <ol className="itest-solution-list">
                {block.items.map((item) => {
                  const parentSolution = solutions[item.id];
                  return (
                    <React.Fragment key={item.id}>
                      {item.parts && !parentSolution ? (
                        <StatementContext item={item} />
                      ) : (
                        <SolutionCard
                          number={item.number}
                          prompt={item.prompt}
                          math={item.math}
                          solution={parentSolution}
                        />
                      )}
                      {item.parts?.map((part) => (
                        <SolutionCard
                          key={part.id}
                          number={part.number}
                          prompt={part.prompt}
                          solution={solutions[part.id]}
                        />
                      ))}
                    </React.Fragment>
                  );
                })}
              </ol>
            </div>
          ))}
        </section>
      ))}
    </article>
  );
};

export default IndependentTestSolutions;
