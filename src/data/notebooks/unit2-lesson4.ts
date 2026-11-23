import type { StudentNotebookData } from './types';

/**
 * دفتر الطالب — الدرس 4 (الجذور التربيعية)، الوحدة الثانية.
 *
 * محتوى مؤلف ومراجع مقابل كتل الدرس `u2-lesson-4` (الصفحات 35–37):
 *  - التعريف والنتيجتان وخواص الجذور الأربع منقولة من «تعلم» و«نتائج»
 *    و«خواص الجذور التربيعية» ص35–36.
 *  - أمثلة الكتاب المطبوعة ص35–37 (الجذور، الجداء والنسبة، قوة الجذر، تبسيط الجذور، الآلة الحاسبة).
 *  - خطوات الحل والتنبيهات إعادة صياغة منهجية انطلاقًا من الصفحات نفسها (adapted).
 *  - قسم «تمارين مطلوبة للتدوين» ينقل نصوص تمارين ص37 فقط (بلا حلول).
 *  - وُثّق موضع المثال العشري $\sqrt{0.0256}$: الفاصلة في صورة الكتاب نقطة وسطية،
 *    والقيمة المعتمدة 0.16 كما في بيانات الدرس.
 *  - وُثّق (verifyNote) موضع كلمة غير مقروءة في صورة ص36 قبل عبارة «ونلاحظ أن
 *    8 = √2⁶ = √64 = 8»؛ نُقلت المعادلات دون الكلمة.
 */
export const unit2Lesson4Notebook: StudentNotebookData = {
  unitId: 'unit-2',
  lessonId: 'u2-lesson-4',
  title: 'دفتر الطالب — الجذور التربيعية',
  review: {
    date: '2026-11-23',
    note:
      'راجعت المنصة كل تعريف وقاعدة ومثال وتمرين في هذا الدفتر مقابل صفحات الكتاب $35$–$37$: ' +
      'تعريف الجذر والنتيجتان ص35، وخواص الجذور الأربع وأمثلتها ص36، وتبسيط الجذور والآلة الحاسبة ص37، ' +
      'ونصوص تمارين ص37 (دون حلولها). وأُعيد حساب الجذور والتبسيطات تحققًا مستقلًا.',
  },
  sections: [
    {
      id: 'definitions',
      kind: 'definitions',
      title: 'التعريفات والمصطلحات',
      entries: [
        {
          id: 'def-square-root',
          title: 'الجذر التربيعي للعدد الموجب',
          text: String.raw`الجذر التربيعي للعدد الموجب $a$ هو العدد الموجب $b$ الذي مربعه يساوي $a$، ونرمزه $\sqrt{a}$، ويُقرأ «الجذر التربيعي للعدد $a$».`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 35, section: 'تعلم', item: 'تعريف' }],
            },
          ],
        },
        {
          id: 'def-positive-root',
          title: 'لماذا نقول «الجذر الموجب»؟',
          text: String.raw`الجذر التربيعي للعدد الموجب عدد موجب فقط، لأن التعريف يشترط $b\ge0$؛ لذلك $\sqrt{25}=5$ وليس $-5$، مع أن $(-5)^{2}=25$ أيضًا.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 35, section: 'تعلم', item: 'تعريف' }],
              note: 'توضيح صيغ للدفتر انطلاقًا من تعريف الجذر الموجب ص35.',
            },
          ],
        },
        {
          id: 'def-square-number',
          title: 'العدد المربع الكامل',
          text: String.raw`العدد المربع الكامل هو عدد يساوي مربع عدد صحيح، مثل $1$ و$4$ و$9$ و$16$ و$25$؛ ويُستخرج جذره التربيعي عددًا صحيحًا.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 35, section: 'نشاط' }],
              note: 'تعريف توضيحي مستخلص من جداول المربعات في النشاط ص35.',
            },
          ],
        },
        {
          id: 'def-root-approximation',
          title: 'الجذر التقريبي والآلة الحاسبة',
          text: String.raw`الرمز $\sqrt{\ }$ في آلة حاسبة يعمل على إيجاد العدد الموجب الذي عُلِم مربعه، أو قيمة تقريبية له؛ فالآلة تعطي تقريبًا لا الصيغة الدقيقة.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 37, section: 'الآلة الحاسبة' }],
            },
          ],
        },
      ],
    },
    {
      id: 'rules',
      kind: 'rules',
      title: 'القواعد والخواص',
      entries: [
        {
          id: 'rule-negative-no-root',
          title: 'العدد السالب ليس له جذر تربيعي',
          text: String.raw`ليس للعدد السالب جذر تربيعي؛ لأنه لا يوجد عدد مربعه يساوي عددًا سالبًا، فمربع أي عدد غير سالب.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 35, section: 'نتائج', item: '1)' }],
            },
          ],
        },
        {
          id: 'rule-zero-root',
          title: 'الجذر التربيعي للصفر',
          text: String.raw`الجذر التربيعي للعدد صفر هو صفر: $\sqrt{0}=0$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 35, section: 'نتائج', item: '2)' }],
            },
          ],
        },
        {
          id: 'rule-product',
          title: 'الجذر التربيعي لجداء عددين موجبين',
          text: String.raw`إذا كان $a\ge0$ و$b\ge0$ فإن $\sqrt{a\times b}=\sqrt{a}\times\sqrt{b}$، وتعمّم القاعدة على أكثر من عددين.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '1' }],
            },
          ],
        },
        {
          id: 'rule-quotient',
          title: 'الجذر التربيعي لنسبة عددين موجبين',
          text: String.raw`إذا كان $a\ge0$ و$b>0$ فإن $\sqrt{\frac{a}{b}}=\frac{\sqrt{a}}{\sqrt{b}}$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '2' }],
            },
          ],
        },
        {
          id: 'rule-power-of-root',
          title: 'قوة جذر تربيعي لعدد موجب',
          text: String.raw`إذا كان $b\ge0$، وحيث $n$ عدد طبيعي، فإن $\left(\sqrt{b}\right)^{n}=\sqrt{b^{n}}$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '3' }],
            },
          ],
        },
        {
          id: 'rule-even-power-root',
          title: 'الجذر التربيعي لقوة أسها زوجي',
          text: String.raw`إذا كان $b>0$، وحيث $n$ عدد طبيعي زوجي، فإن $\sqrt{b^{n}}=b^{\frac{n}{2}}$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '4' }],
            },
          ],
        },
      ],
    },
    {
      id: 'formulas',
      kind: 'formulas',
      title: 'الصيغ والعلاقات',
      entries: [
        {
          id: 'formula-product-quotient',
          title: 'صيغتا الجداء والنسبة',
          math: String.raw`\sqrt{a\times b}=\sqrt{a}\times\sqrt{b}\qquad \sqrt{\frac{a}{b}}=\frac{\sqrt{a}}{\sqrt{b}}`,
          sources: [
            {
              origin: 'book',
              refs: [
                { page: 36, section: 'خواص الجذور التربيعية', item: '1' },
                { page: 36, section: 'خواص الجذور التربيعية', item: '2' },
              ],
            },
          ],
        },
        {
          id: 'formula-power-rules',
          title: 'صيغتا قوة الجذر والجذر ذي الأس الزوجي',
          math: String.raw`\left(\sqrt{b}\right)^{n}=\sqrt{b^{n}}\qquad \sqrt{b^{n}}=b^{\frac{n}{2}}`,
          sources: [
            {
              origin: 'book',
              refs: [
                { page: 36, section: 'خواص الجذور التربيعية', item: '3' },
                { page: 36, section: 'خواص الجذور التربيعية', item: '4' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'procedures',
      kind: 'procedures',
      title: 'خطوات الحل المنهجية',
      entries: [
        {
          id: 'proc-simplify-radical',
          title: 'كيف نبسّط جذرًا تربيعيًا؟',
          steps: [
            String.raw`ابحث عن أكبر عدد مربع كامل يقسم العدد المكتوب تحت الجذر، مثل 4 أو 9 أو 16 أو 25.`,
            String.raw`اكتب العدد جداء المربع الكامل في عامل آخر: مثلًا $50=25\times2$.`,
            String.raw`استعمل خاصية الجداء: $\sqrt{a\times b}=\sqrt{a}\times\sqrt{b}$، فأخرج جذر المربع الكامل.`,
            String.raw`تحقّق بتربيع الناتج: يجب أن يعيد العدد الأصلي.`,
          ],
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 37, section: 'مثال' }],
              note: 'خطة خطوات مستخلصة من مثال تبسيط الجذور ص37 وشرح اختيار العامل المربع.',
            },
          ],
        },
        {
          id: 'proc-root-from-area',
          title: 'كيف نستخرج طول ضلع مربع من مساحته؟',
          steps: [
            String.raw`رمّز إلى طول الضلع بالرمز $x$، فالمساحة $x^{2}$ تساوي المساحة المعطاة.`,
            String.raw`اكتب المعادلة $x^{2}=S$، ثم خذ الجذر التربيعي الموجب: $x=\sqrt{S}$.`,
            String.raw`إذا لم تكن المساحة مربعًا كاملًا، اكتب الطول بصيغة $\sqrt{S}$ أو قرّبه بالآلة الحاسبة.`,
            String.raw`أضف وحدة الطول المناسبة؛ فالمساحة بوحدة مربعة والطول بوحدة خطية.`,
          ],
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 37, section: 'مثال' }],
              note: 'خطة خطوات مستخلصة من مثال مربع مساحته 8 ص37.',
            },
          ],
        },
        {
          id: 'proc-estimate-root',
          title: 'كيف نقدّر جذرًا ليس مربعًا كاملًا؟',
          steps: [
            String.raw`حدّد المربعين الكاملين المتتاليين الذين يقع العدد بينهما.`,
            String.raw`اكتب المتباينة: مثلًا $16<20<25$، فـ$4<\sqrt{20}<5$.`,
            String.raw`استعمل الآلة الحاسبة للحصول على تقريب أدق، مثلًا $\sqrt{20}\approx4.47$.`,
            String.raw`تحقّق بتربيع التقريب: يجب أن يكون قريبًا من العدد الأصلي.`,
          ],
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 37, section: 'تدرّب', item: '③' }],
              note: 'خطة خطوات مستخلصة من تدرّب ③ ص37؛ الحل المفصّل في الدرس من إعداد المنصة.',
            },
          ],
        },
      ],
    },
    {
      id: 'worked-examples',
      kind: 'worked-examples',
      title: 'أمثلة نموذجية محلولة',
      entries: [
        {
          id: 'example-sqrt-144',
          title: 'مثال 1: جذر تربيعي لمربع كامل',
          text: String.raw`نتحقّق من أن $12^{2}=144$:`,
          math: String.raw`\sqrt{144}=12\qquad(12)^{2}=144`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 35, section: 'تعلم', item: 'مثال' }],
            },
          ],
        },
        {
          id: 'example-sqrt-361',
          title: 'مثال 2: جذر تربيعي لمربع كامل',
          text: String.raw`نتحقّق من أن $19^{2}=361$:`,
          math: String.raw`\sqrt{361}=19\qquad(19)^{2}=361`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 35, section: 'تعلم', item: 'مثال' }],
            },
          ],
        },
        {
          id: 'example-product-36-16',
          title: 'مثال 3: جذر تربيعي لجداء',
          text: String.raw`نطبّق خاصية الجداء:`,
          math: String.raw`\sqrt{36\times16}=\sqrt{36}\times\sqrt{16}=6\times4=24`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '1' }],
            },
          ],
        },
        {
          id: 'example-product-2-8',
          title: 'مثال 4: جداء جذرين تربيعيين',
          text: String.raw`نستعمل القاعدة بالعكس، فنجمع الجذرين في جذر واحد:`,
          math: String.raw`\sqrt{2}\times\sqrt{8}=\sqrt{2\times8}=\sqrt{16}=4`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '1' }],
            },
          ],
        },
        {
          id: 'example-quotient-decimal',
          title: 'مثال 5: جذر تربيعي لعدد عشري',
          text: String.raw`نكتب البسط والمقام جذرين لعددين صحيحين:`,
          math: String.raw`\sqrt{0.0256}=\frac{\sqrt{256}}{\sqrt{10000}}=\frac{16}{100}=0.16`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '2' }],
              note: 'تنبيه توثيق: يطبع الكتاب الفاصلة العشرية نقطة وسطية (0·0256 و0·16)، والقيمة المعتمدة 0.16 كما في بيانات الدرس.',
            },
          ],
        },
        {
          id: 'example-quotient-6-22',
          title: 'مثال 6: خارج جذرين تربيعيين',
          text: String.raw`نجمع الجذرين في جذر واحد للنسبة، ثم نبسّط الكسر داخل الجذر:`,
          math: String.raw`\frac{\sqrt{6}}{\sqrt{22}}=\sqrt{\frac{6}{22}}=\sqrt{\frac{3}{11}}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '2' }],
            },
          ],
        },
        {
          id: 'example-power-2-6',
          title: 'مثال 7: قوة جذر تربيعي',
          text: String.raw`نطبّق قاعدة قوة الجذر:`,
          math: String.raw`\left(\sqrt{2}\right)^{6}=\sqrt{2^{6}}=\sqrt{64}=8`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '3' }],
              note: 'تنبيه توثيق (verifyNote): في صورة ص36 كلمة غير مقروءة قبل عبارة «ونلاحظ أن 8 = √2⁶ = √64 = 8»، فلم تُنقل؛ المعادلات الرقمية كاملة وصحيحة كما في بيانات الدرس.',
            },
          ],
        },
        {
          id: 'example-power-3-4',
          title: 'مثال 8: قوة جذر تربيعي',
          text: String.raw`نطبّق قاعدة قوة الجذر:`,
          math: String.raw`\left(\sqrt{3}\right)^{4}=\sqrt{3^{4}}=\sqrt{81}=9`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '3' }],
            },
          ],
        },
        {
          id: 'example-even-power',
          title: 'مثال 9: قوة جذر تربيعي بقاعدة الأس الزوجي',
          text: String.raw`نكتب الأس $\frac{4}{2}=2$:`,
          math: String.raw`\left(\sqrt{3}\right)^{4}=3^{\frac{4}{2}}=3^{2}=9`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '4' }],
            },
          ],
        },
        {
          id: 'example-simplify-8-50-27',
          title: 'مثال 10: تبسيط جذور تربيعية بإخراج مربع كامل',
          text: String.raw`نُخرج من كل جذر عاملًا مربعًا كاملًا:`,
          math: String.raw`\sqrt{8}=\sqrt{4\times2}=2\sqrt{2}\qquad \sqrt{50}=\sqrt{25\times2}=5\sqrt{2}\qquad \sqrt{27}=\sqrt{9\times3}=3\sqrt{3}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 37, section: 'مثال' }],
            },
          ],
        },
        {
          id: 'example-area-8',
          title: 'مثال 11: طول ضلع مربع من مساحته',
          text: String.raw`نرمّز إلى طول الضلع بـ$x$، فالمعادلة $x^{2}=8$، والآلة الحاسبة تعطي تقريبًا:`,
          math: String.raw`x=\sqrt{8}\approx2.828427125\qquad x\approx2.8\ \text{cm}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 37, section: 'مثال' }],
            },
          ],
        },
      ],
    },
    {
      id: 'cautions',
      kind: 'cautions',
      title: 'تنبيهات وأخطاء شائعة',
      entries: [
        {
          id: 'caution-plus-minus',
          title: 'الجذر التربيعي ليس موجبًا وسالبًا معًا',
          text: String.raw`$\sqrt{25}=5$ وليس $\pm5$؛ فالجذر التربيعي للعدد الموجب هو العدد الموجب الذي مربعه يساوي العدد.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 35, section: 'تعلم', item: 'تعريف' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من تعريف الجذر الموجب ص35.',
            },
          ],
        },
        {
          id: 'caution-distribute-sum',
          title: 'الجذر لا يتوزّع على الجمع',
          text: String.raw`$\sqrt{9+16}=\sqrt{25}=5$ وليس $\sqrt{9}+\sqrt{16}=3+4=7$؛ فالقاعدة تخصّ الجداء والنسبة لا الجمع.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '1' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من خاصية الجداء ص36.',
            },
          ],
        },
        {
          id: 'caution-quotient-numerator-only',
          title: 'لا تأخذ جذر البسط وحده',
          text: String.raw`$\sqrt{\frac{9}{25}}=\frac{\sqrt{9}}{\sqrt{25}}=\frac{3}{5}$ وليس $\frac{9}{5}$؛ فالجذر يشمل البسط والمقام.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '2' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من خاصية النسبة ص36.',
            },
          ],
        },
        {
          id: 'caution-sqrt-x-squared',
          title: 'جذر المربع هو القيمة المطلقة',
          text: String.raw`$\sqrt{x^{2}}=|x|$ وليس $x$؛ فمثلًا $\sqrt{(-3)^{2}}=\sqrt{9}=3$ وليس $-3$، لأن الجذر التربيعي دائمًا موجب أو صفر.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 36, section: 'خواص الجذور التربيعية', item: '4' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من خاصية الجذر ذي الأس الزوجي ص36.',
            },
          ],
        },
        {
          id: 'caution-square-factor-choice',
          title: 'أخرج أكبر مربع كامل',
          text: String.raw`$\sqrt{50}=\sqrt{25\times2}=5\sqrt{2}$ وليس $2\sqrt{25}=10$؛ فالعامل المربع الذي يُخرج هو 25 لا 2.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 37, section: 'مثال' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من مثال تبسيط الجذور ص37.',
            },
          ],
        },
        {
          id: 'caution-approximation',
          title: 'الآلة تعطي تقريبًا لا الصيغة الدقيقة',
          text: String.raw`$\sqrt{8}\approx2.8$ تقريب، أما الصيغة الدقيقة فهي $\sqrt{8}$؛ ولا تكتب التقريب على أنه مساوٍ تامًّا.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 37, section: 'الآلة الحاسبة' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من مثال الآلة الحاسبة ص37.',
            },
          ],
        },
        {
          id: 'caution-units',
          title: 'وحدة الطول ليست وحدة المساحة',
          text: String.raw`إذا كانت المساحة بوحدة $\text{cm}^{2}$ فطول الضلع بوحدة $\text{cm}$؛ فالجذر التربيعي للمساحة يعطي طولًا.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 37, section: 'مثال' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من مسألة مربع مساحته 8 ص37.',
            },
          ],
        },
      ],
    },
    {
      id: 'exercises-to-copy',
      kind: 'exercises-to-copy',
      title: 'تمارين مطلوبة للتدوين',
      entries: [
        {
          id: 'hw-intro',
          title: 'ما يجب تدوينه في الدفتر',
          text: String.raw`انسخ نصوص التمارين الآتية من الصفحة $37$ من الكتاب («تحقّق من فهمك» و«تدرّب») وحلّها في دفترك. تُعرض هنا نصوص التمارين فقط، وتبقى الحلول في أنشطة الدرس التفاعلية لتقارن بها حلك.`,
          sources: [
            {
              origin: 'platform',
              note: 'تعليمات تنظيمية من المنصة؛ نصوص التمارين التالية منقولة من الكتاب ص37.',
            },
          ],
        },
        {
          id: 'hw-check-1',
          title: 'تحقّق من فهمك ① — اكتب الجذور التربيعية',
          steps: [
            String.raw`$\sqrt{196}$`,
            String.raw`$\sqrt{64}$`,
            String.raw`$\sqrt{1}$`,
            String.raw`$\sqrt{0}$`,
            String.raw`$\sqrt{5}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 37, section: 'تحقّق من فهمك', item: '①' }],
            },
          ],
        },
        {
          id: 'hw-check-2',
          title: 'تحقّق من فهمك ② — أرض مربعة الشكل',
          text: String.raw`أرض مربعة الشكل مساحتها 225، احسب طول ضلعها.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 37, section: 'تحقّق من فهمك', item: '②' }],
            },
          ],
        },
        {
          id: 'hw-check-3',
          title: 'تحقّق من فهمك ③ — احسب ناتج كل عدد',
          steps: [
            String.raw`$\frac{\sqrt{72}}{\sqrt{32}}$`,
            String.raw`$\left(\sqrt{5}\right)^{6}$`,
            String.raw`$\sqrt{\left(3\right)^{6}\times\left(5\right)^{4}}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 37, section: 'تحقّق من فهمك', item: '③' }],
            },
          ],
        },
        {
          id: 'hw-practice-1',
          title: 'تدرّب ① — احسب طول ضلع المربع',
          steps: [
            String.raw`مساحته $1\ \text{cm}^{2}$`,
            String.raw`مساحته $4\ \text{cm}^{2}$`,
            String.raw`مساحته $36\ \text{cm}^{2}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 37, section: 'تدرّب', item: '①' }],
            },
          ],
        },
        {
          id: 'hw-practice-2',
          title: 'تدرّب ② — بسّط الجذور الآتية',
          steps: [
            String.raw`$\sqrt{75}$`,
            String.raw`$\sqrt{32}$`,
            String.raw`$\sqrt{108}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 37, section: 'تدرّب', item: '②' }],
            },
          ],
        },
        {
          id: 'hw-practice-3',
          title: 'تدرّب ③ — طول ضلع مربع مساحته 30 سم مربع',
          text: String.raw`مساحة مربع تساوي $30\ \text{cm}^{2}$، ويرمز $S$ إلى طول ضلعه مقاسًا بالسنتيمترات. أجب: (1) هل $S$ عدد صحيح؟ (2) احصر $S$ بين عددين صحيحين متتاليين. (3) استخدم آلتك الحاسبة لحساب $S$ مقرّبًا لأقرب جزء من مئة.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 37, section: 'تدرّب', item: '③' }],
            },
          ],
        },
      ],
    },
  ],
};
