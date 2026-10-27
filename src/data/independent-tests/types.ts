/**
 * بنية بيانات الاختبارات المستقلة (اختبارات الجبر والاختبارات المشتركة جبر + هندسة).
 *
 * الاختبارات المستقلة تُنقل من أوراق الاختبار المطبوعة، فهي أوراق قراءة
 * (سؤال ← حل) وليست اختبارات تُصحَّح آليًا مثل `data/tests`. لذلك بُنيت هذه
 * البنية على تقسيمات الورقة نفسها: قسم ← سؤال/تمرين/مسألة ← بند، مع الحفاظ
 * على ترقيم المصدر ودرجاته.
 */

/** مفاتيح الرسوم التي أُعيد إنشاؤها بـ SVG داخل المنصة. */
export type IndependentFigureKey = 'mbnd-parallelogram' | 'mbnd-congruence' | 'mbnd-symmetry';

export type IndependentItemKind = 'choice' | 'true-false' | 'free';

export interface IndependentTestChoice {
  /** حرف الخيار كما في المصدر: a / b / c. */
  id: string;
  /** نص الخيار أو صيغته الرياضية المضمّنة بين `$…$`. */
  label: string;
}

/** بند فرعي مُرقَّم داخل تمرين أو مسألة (مثل: «أثبت أن …»). */
export interface IndependentTestPart {
  id: string;
  number: string;
  prompt: string;
}

export interface IndependentTestItem {
  id: string;
  /** رقم البند كما في المصدر بالخط العربي: ١ / ٢ / ٣ … ويُحذف إن لم يُرقَّم المصدر البند. */
  number?: string;
  kind: IndependentItemKind;
  /** نص التمهيد قبل الرياضيات، ويجوز أن يحتوي `$…$`. */
  prompt?: string;
  /** تعبير رياضي كامل معروض في سطر مستقل (TeX خام بلا محددات). */
  math?: string;
  /** نص يلي التعبير الرياضي (مثل: «المطلوب: …»). */
  note?: string;
  /** رسم لازم لفهم البند، يُعاد إنشاؤه داخل المنصة. */
  figure?: IndependentFigureKey;
  choices?: IndependentTestChoice[];
  /** تمهيد البنود الفرعية، مثل «والمطلوب:». */
  partsLabel?: string;
  parts?: IndependentTestPart[];
}

/** سؤال أو تمرين أو مسألة داخل قسم. */
export interface IndependentTestBlock {
  id: string;
  heading: string;
  instruction?: string;
  items: IndependentTestItem[];
}

/** قسم رئيسي من الورقة: أولاً / ثانياً / ثالثاً. */
export interface IndependentTestSection {
  id: string;
  heading: string;
  title: string;
  pointsLabel?: string;
  blocks: IndependentTestBlock[];
}

export interface IndependentTest {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  sections: IndependentTestSection[];
}

/** حل بند واحد؛ يُربط بالبند عبر معرّفه نفسه. */
export interface IndependentSolution {
  steps: string[];
  finalAnswer: string;
  /** رسم توضيحي للحل عند الحاجة، يُعاد إنشاؤه داخل المنصة. */
  figure?: IndependentFigureKey;
}

/** خريطة الحلول: معرّف البند أو البند الفرعي ← حلّه. */
export type IndependentSolutionMap = Record<string, IndependentSolution>;
