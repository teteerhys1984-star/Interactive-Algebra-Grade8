import type { UnitTeacherSolution } from './teacherSolutions';
import { stationOf } from './lesson05Stations';
import { unit2Lesson5Questions } from './lesson05Questions';

/**
 * حلول المعلّم التفصيلية — الوحدة الثانية، الدرس الخامس (تمارين ومسائل الوحدة الثانية).
 *
 * لكل بند فرعي في الأسئلة 1–39 حل مستقل مربوط بالسؤال الذي ينتمي إليه:
 *  - `blockId` = كتلة نص السؤال (`source-N`)،
 *  - `subIndex` = موضع البند داخل `subItems` (مطابق لترتيب المصدر ① ② ③ / 1. 2. 3.).
 * الاختبار src/test/unit2-lesson5-teacher-solutions.test.ts يتحقق من التغطية الكاملة
 * ومن عدم وجود حل زائد أو يتيم.
 *
 * مصدر الإجابات: بنود الكتاب ليست مرفقة بمفتاح إجابة في الصور المجموعة، لذلك كل
 * الحلول «مُشتقة من المنصة» وتُعرض بخطواتها وتحقّقها. ما ورد في المصدر صريحًا
 * (مثل $B=-\\frac{99}{80}$ في ملاحظة المصحّح داخل السؤال 29) مذكور في `sourceNote`.
 *
 * سجل الاستثناءات الموثّقة:
 *  - السؤال 9 ①: المساواة المطبوعة غير متسقة رياضيًا (ملاحظة مصدر صريحة).
 *  - السؤال 30 2.①: الكتاب يعرّف «dcg» ديكاغرام (10 g) لا ديسيغرام، فالجواب $10^{8}$.
 *  - السؤال 26 ②: الجواب $0.067$ لا $0.67$ (خطأ شائع في الحلول المتداولة).
 *  - السؤال 1 ⑩: التقريب يعطي 5.92 لا 5.91.
 */

const money = (value: string): string => value;

const inlineMath = (value?: string): string => (value ? `$${value}$` : '');

const problemOf = (n: number, index: number): string => {
  const question = unit2Lesson5Questions.find((entry) => entry.n === n)!;
  const item = question.items[index];
  const parts = [item.label, item.text ?? '', inlineMath(item.math)].filter((part) => part.trim().length > 0);
  return parts.join(' — ');
};

const buildSolutions = (): UnitTeacherSolution[] =>
  unit2Lesson5Questions.flatMap((question) =>
    question.items.map((item, index): UnitTeacherSolution => ({
      id: `u2l5-q${question.n}-${index + 1}`,
      group: stationOf(question.n).title,
      blockId: `source-${question.n}`,
      subIndex: index,
      source: `تمارين الوحدة الثانية • السؤال ${question.n} • ${item.label}`,
      problem: `السؤال ${question.n} (${item.label}): ${money(problemOf(question.n, index))}`,
      steps: item.steps,
      finalAnswer: item.answer ? `$${item.answer}$` : (item.answerText ?? ''),
      principle: item.reason,
      check: item.check,
      sourceNote: [item.note, index === 0 ? question.verifyNote : undefined].filter(Boolean).join(' ') || undefined,
      answerOrigin: 'مُشتقة من المنصة',
    })),
  );

export const unit2Lesson5TeacherSolutions: UnitTeacherSolution[] = buildSolutions();

/** عدد البنود الفرعية المستخرجة من المصدر (يُستعمل في الاختبارات والتوثيق). */
export const unit2Lesson5SubItemCount = unit2Lesson5Questions.reduce(
  (total, question) => total + question.items.length,
  0,
);
