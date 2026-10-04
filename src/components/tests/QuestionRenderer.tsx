import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Math } from '../math/Math';
import { MathText } from '../math/MathText';
import type { QuestionAnswer, TestChoice, TestQuestion } from '../../data/tests/types';

interface QuestionRendererProps {
  question: TestQuestion;
  questionNumber: number;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

const choiceId = (questionId: string, optionId: string) =>
  `test-${questionId}-${optionId}`.replace(/[^a-zA-Z0-9_-]/g, '-');

const AnswerGroup: React.FC<{
  legend: string;
  questionId: string;
  choices: TestChoice[];
  value: string | undefined;
  onChange: (value: string) => void;
}> = ({ legend, questionId, choices, value, onChange }) => (
  <fieldset className="test-answer-group">
    <legend className="test-sr-only">{legend}</legend>
    <div className="test-option-list">
      {choices.map((choice, index) => {
        const id = choiceId(questionId, `${legend}-${choice.id}`);
        return (
          <label
            key={choice.id}
            className={`test-option${value === choice.id ? ' is-selected' : ''}`}
            htmlFor={id}
          >
            <input
              id={id}
              type="radio"
              name={`answer-${questionId}-${legend}`}
              value={choice.id}
              checked={value === choice.id}
              onChange={() => onChange(choice.id)}
            />
            <span className="test-option-marker" aria-hidden="true"><bdi dir="ltr">{index + 1}</bdi></span>
            <span className="test-option-label"><MathText text={choice.label} /></span>
          </label>
        );
      })}
    </div>
  </fieldset>
);

function currentOrder(items: TestChoice[], answer: QuestionAnswer | undefined): string[] {
  const itemIds = new Set(items.map((item) => item.id));
  const saved = Array.isArray(answer) ? answer.filter((id) => itemIds.has(id)) : [];
  const uniqueSaved = saved.filter((id, index) => saved.indexOf(id) === index);
  return [...uniqueSaved, ...items.map((item) => item.id).filter((id) => !uniqueSaved.includes(id))];
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  questionNumber,
  answer,
  onChange,
}) => {
  const number = questionNumber.toLocaleString('ar');

  return (
    <div className="test-question-body" dir="rtl">
      <div className="test-question-prompt">
        <MathText text={question.prompt} />
      </div>
      {question.math && !question.prompt.includes('$') && <Math math={question.math} display />}

      {(question.type === 'single-choice' || question.type === 'error-analysis') && (
        <AnswerGroup
          legend={question.type === 'error-analysis' ? 'اختر تحليل الخطأ وتصحيحه' : 'اختر إجابة واحدة'}
          questionId={question.id}
          choices={question.options}
          value={typeof answer === 'string' ? answer : undefined}
          onChange={onChange}
        />
      )}

      {question.type === 'true-false' && (
        <AnswerGroup
          legend="حدّد إن كانت العبارة صحيحة أم خاطئة"
          questionId={question.id}
          choices={[
            { id: 'true', label: 'صحيحة' },
            { id: 'false', label: 'خاطئة' },
          ]}
          value={typeof answer === 'boolean' ? String(answer) : undefined}
          onChange={(value) => onChange(value === 'true')}
        />
      )}

      {question.type === 'multi-select' && (
        <fieldset className="test-answer-group">
          <legend className="test-group-legend">اختر جميع العبارات المناسبة</legend>
          <div className="test-option-list">
            {question.options.map((option, index) => {
              const id = choiceId(question.id, option.id);
              const selected = Array.isArray(answer) && answer.includes(option.id);
              return (
                <label
                  key={option.id}
                  className={`test-option${selected ? ' is-selected' : ''}`}
                  htmlFor={id}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={selected}
                    onChange={(event) => {
                      const current = Array.isArray(answer) ? answer : [];
                      onChange(
                        event.target.checked
                          ? [...current.filter((item) => item !== option.id), option.id]
                          : current.filter((item) => item !== option.id),
                      );
                    }}
                  />
                  <span className="test-option-marker" aria-hidden="true"><bdi dir="ltr">{index + 1}</bdi></span>
                  <span className="test-option-label"><MathText text={option.label} /></span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {question.type === 'numeric' && (
        <div className="test-numeric-answer">
          <label htmlFor={`test-numeric-${question.id}`}>
            إجابتك عن السؤال {number} ({question.answerFormat})
          </label>
          <p id={`test-numeric-help-${question.id}`} className="test-input-help">
            يمكن كتابة كسر أو عدد عشري؛ مثال الصيغة: ٣/٤ أو 0.75.
          </p>
          <input
            id={`test-numeric-${question.id}`}
            type="text"
            dir="ltr"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            aria-describedby={`test-numeric-help-${question.id}`}
            value={typeof answer === 'string' ? answer : ''}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
      )}

      {question.type === 'ordering' && (() => {
        const order = currentOrder(question.items, answer);
        const byId = new Map(question.items.map((item) => [item.id, item]));
        return (
          <div className="test-ordering" aria-label="رتّب الخطوات">
            <p className="test-input-help">استخدم أزرار التحريك لترتيب الخطوات، ثم انتقل إلى السؤال التالي.</p>
            <ol className="test-order-list">
              {order.map((id, index) => {
                const item = byId.get(id);
                if (!item) return null;
                return (
                  <li key={id} className="test-order-item">
                    <span className="test-order-index" dir="ltr">{index + 1}</span>
                    <span className="test-order-text"><MathText text={item.label} /></span>
                    <span className="test-order-controls">
                      <button
                        type="button"
                        className="test-icon-button"
                        aria-label={`نقل البند ${index + 1} إلى الأعلى`}
                        disabled={index === 0}
                        onClick={() => {
                          const next = [...order];
                          [next[index - 1], next[index]] = [next[index], next[index - 1]];
                          onChange(next);
                        }}
                      >
                        <ArrowUp size={17} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="test-icon-button"
                        aria-label={`نقل البند ${index + 1} إلى الأسفل`}
                        disabled={index === order.length - 1}
                        onClick={() => {
                          const next = [...order];
                          [next[index + 1], next[index]] = [next[index], next[index + 1]];
                          onChange(next);
                        }}
                      >
                        <ArrowDown size={17} aria-hidden="true" />
                      </button>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })()}

      {question.type === 'matching' && (
        <div className="test-matching" aria-label="صل كل عنصر بما يناسبه">
          {question.leftItems.map((left, leftIndex) => {
            const matchingAnswer =
              answer && !Array.isArray(answer) && typeof answer === 'object'
                ? answer[left.id]
                : undefined;
            return (
              <fieldset key={left.id} className="test-match-group">
                <legend>
                  <span className="test-match-prompt-number">{leftIndex + 1}</span>
                  <MathText text={left.label} />
                </legend>
                <div className="test-option-list test-match-options">
                  {question.rightItems.map((right, rightIndex) => {
                    const id = choiceId(question.id, `${left.id}-${right.id}`);
                    return (
                      <label
                        key={right.id}
                        className={`test-option${matchingAnswer === right.id ? ' is-selected' : ''}`}
                        htmlFor={id}
                      >
                        <input
                          id={id}
                          type="radio"
                          name={`matching-${question.id}-${left.id}`}
                          value={right.id}
                          checked={matchingAnswer === right.id}
                          aria-label={`مطابقة البند ${leftIndex + 1} مع الخيار ${rightIndex + 1}`}
                          onChange={() => onChange({
                            ...(answer && !Array.isArray(answer) && typeof answer === 'object' ? answer : {}),
                            [left.id]: right.id,
                          })}
                        />
                        <span className="test-option-marker" aria-hidden="true"><bdi dir="ltr">{rightIndex + 1}</bdi></span>
                        <span className="test-option-label"><MathText text={right.label} /></span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>
      )}
    </div>
  );
};
