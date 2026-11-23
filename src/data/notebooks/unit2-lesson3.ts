import type { StudentNotebookData } from './types';

/**
 * دفتر الطالب — الدرس 3 (قوى صحيحة لعدد نسبي)، الوحدة الثانية.
 *
 * محتوى مؤلف ومراجع مقابل كتل الدرس `u2-lesson-3` (الصفحات 32–34):
 *  - التعريف والقواعد الأربع منقولة من «تعلّم» و«قواعد حساب القوى» ص32–33.
 *  - أمثلة الكتاب المطبوعة ص32–33 (الأساس السالب، الأس السالب، A وB وC).
 *  - خطوات الحل والتنبيهات إعادة صياغة منهجية انطلاقًا من الصفحات نفسها (adapted).
 *  - قسم «تمارين مطلوبة للتدوين» ينقل نصوص تمارين ص34 فقط (بلا حلول).
 *  - وُثّق موضعان مصدريان: شرط $0^n=0$ في ص32، والأس الضمني 1 في تدرّب ③.
 */
export const unit2Lesson3Notebook: StudentNotebookData = {
  unitId: 'unit-2',
  lessonId: 'u2-lesson-3',
  title: 'دفتر الطالب — قوى صحيحة لعدد نسبي',
  review: {
    date: '2026-11-23',
    note:
      'راجعت المنصة كل تعريف وقاعدة ومثال وتمرين في هذا الدفتر مقابل صفحات الكتاب $32$–$34$: ' +
      'تعريف القوة والقيم الخاصة ص32، والقواعد الأربع ص32–33، وأولويات العمليات والأمثلة A وB وC ص33، ' +
      'ونصوص تمارين ص34 (دون حلولها). وأُعيد حساب الأمثلة تحققًا مستقلًا.',
  },
  sections: [
    {
      id: 'definitions',
      kind: 'definitions',
      title: 'التعريفات والمصطلحات',
      entries: [
        {
          id: 'def-rational-number',
          title: 'العدد النسبي',
          text: String.raw`العدد النسبي هو عدد يمكن كتابته كسرًا بسطه عدد صحيح ومقامه عدد صحيح غير صفر؛ مثل $-2$ و$\frac{3}{2}$ و$-0.4=-\frac{2}{5}$.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 32, section: 'شرح المنصة' }],
              note: 'تعريف توضيحي مستخلص من مدخل الدرس ص32، وقدّمته المنصة لتوسيع القوى من العدد 10 إلى أي عدد نسبي.',
            },
          ],
        },
        {
          id: 'def-integer-power',
          title: 'القوة ذات الأس الطبيعي',
          text: String.raw`في حالة $n\ge2$، يرمز $a^{n}$ إلى جداء ضرب العدد $a$ بنفسه $n$ مرة؛ فالأساس $a$ هو العامل المكرّر، والأس $n$ عدد مرات تكراره.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 32, section: 'تعلّم', item: 'تعريف' }],
            },
          ],
        },
        {
          id: 'def-zero-and-one-exponent',
          title: 'الأس 1 والأس 0',
          text: String.raw`$a^{1}=a$، وفي حالة $a\ne0$ نصطلح على أن $a^{0}=1$؛ فالقوة الأولى تعطي العدد نفسه، والقوة الصفرية تعطي 1 بشرط ألا يكون الأساس صفرًا.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 32, section: 'تعلّم', item: 'الأس 1 والأس 0' }],
            },
          ],
        },
        {
          id: 'def-negative-exponent',
          title: 'القوة ذات الأس السالب',
          text: String.raw`في حالة $a\ne0$، $a^{-n}=\frac{1}{a^{n}}$، وبشكل خاص $a^{-1}=\frac{1}{a}$؛ فالأس السالب يعني مقلوب القوة الموجبة.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 32, section: 'تعلّم', item: 'التعريف الثاني' }],
            },
          ],
        },
        {
          id: 'def-base-and-exponent',
          title: 'الأساس والأس',
          text: String.raw`في $a^{n}$ يسمّى $a$ الأساس و$n$ الأس؛ والتمييز بينهما ضروري لأن القواعد تختلف باختلاف ما يتساوى: الأساس أم الأس.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 32, section: 'تعلّم' }],
              note: 'تعريف توضيحي مستخلص من صيغة $a^{n}$ في تعريف القوة ص32.',
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
          id: 'rule-product-same-base',
          title: 'جداء قوتين ذات أساس واحد',
          text: String.raw`$a^{n}\times a^{m}=a^{n+m}$؛ فمثلًا $5^{3}\times5^{2}=5^{5}$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 32, section: 'قواعد حساب القوى', item: '(1)' }],
            },
          ],
        },
        {
          id: 'rule-power-of-product',
          title: 'قوة الجداء',
          text: String.raw`$(a\times b)^{n}=a^{n}\times b^{n}$؛ فمثلًا $(2\times y)^{3}=2^{3}\times y^{3}=8y^{3}$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 32, section: 'قواعد حساب القوى', item: '(2)' }],
            },
          ],
        },
        {
          id: 'rule-quotient-same-base',
          title: 'خارج قوتين ذات أساس واحد',
          text: String.raw`$\frac{a^{n}}{a^{m}}=a^{n-m}$ (مع $a\ne0$)؛ فمثلًا $\frac{7^{3}}{7^{2}}=7^{3-2}=7^{1}$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 33, section: 'قواعد حساب القوى', item: '(3)' }],
            },
          ],
        },
        {
          id: 'rule-power-of-quotient',
          title: 'قوة الخارج',
          text: String.raw`$\left(\frac{a}{b}\right)^{n}=\frac{a^{n}}{b^{n}}$ (مع $b\ne0$)؛ فمثلًا $\left(\frac{3}{2}\right)^{3}=\frac{27}{8}$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 33, section: 'قواعد حساب القوى', item: '(4)' }],
            },
          ],
        },
        {
          id: 'rule-sign-negative-base',
          title: 'إشارة قوة الأساس السالب',
          text: String.raw`إذا كان الأساس سالبًا، كان الناتج موجبًا مع الأس الزوجي وسالبًا مع الأس الفردي؛ وهذا يصحّ للأسس السالبة أيضًا لأن المقلوب يحفظ الإشارة.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 32, section: 'مثال' }],
              note: 'قاعدة الإشارة صيغت للدفتر انطلاقًا من مثال $(-7)^{3}$ ص32 وشرح الأقواس في الصفحة نفسها.',
            },
          ],
        },
        {
          id: 'rule-order-of-operations',
          title: 'أولويات العمليات',
          text: String.raw`في غياب أقواس ضامة، يكون الحساب: 1. القوى. 2. عمليات الضرب والقسمة. 3. عمليات الجمع والطرح.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 33, section: 'اكتساب معارف', item: 'كيف نتعامل مع أولويات العمليات؟' }],
            },
          ],
        },
        {
          id: 'rule-zero-domain',
          title: 'حدود قاعدة الصفر',
          text: String.raw`$0^{n}=0$ عندما يكون $n$ عددًا صحيحًا موجبًا فقط؛ أما $0^{0}$ و$0^{-n}$ فغير معرّفتين في هذا الدرس لأنهما تتطلبان القسمة على صفر.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 32, section: 'تعلّم', item: 'تعريف' }],
              note: 'توثيق تربوي يوضّح حدود النص المطبوع؛ الشرح المضبوط موجود في الدرس ص32، والنص المطبوع ذكر $0^{n}=0$ بشرط $n\ne0$.',
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
          id: 'formula-four-rules',
          title: 'القواعد الأربع في صيغة واحدة',
          math: String.raw`a^{n}\times a^{m}=a^{n+m}\qquad (a\times b)^{n}=a^{n}\times b^{n}\qquad \frac{a^{n}}{a^{m}}=a^{n-m}\qquad \left(\frac{a}{b}\right)^{n}=\frac{a^{n}}{b^{n}}`,
          sources: [
            {
              origin: 'book',
              refs: [
                { page: 32, section: 'قواعد حساب القوى', item: '(1)–(2)' },
                { page: 33, section: 'قواعد حساب القوى', item: '(3)–(4)' },
              ],
            },
          ],
        },
        {
          id: 'formula-zero-and-negative',
          title: 'صيغتا الأس صفر والأس السالب',
          math: String.raw`a^{0}=1\ (a\ne0)\qquad a^{-n}=\frac{1}{a^{n}}\ (a\ne0)`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 32, section: 'تعلّم', item: 'الأس 1 والأس 0' }],
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
          id: 'proc-sign-of-power',
          title: 'كيف نحدّد إشارة قوة لأساس سالب؟',
          steps: [
            String.raw`انظر هل الإشارة السالبة داخل القوس أم خارجه؛ فـ$(-3)^{2}$ أساسه $-3$، أما $-3^{2}$ فأساسها 3 والإشارة خارج القوة.`,
            String.raw`حدّد زوجية الأس: الأس الزوجي يجعل الناتج موجبًا، والأس الفردي يجعله سالبًا.`,
            String.raw`احسب القوة الموجبة أولًا، ثم خذ المقلوب إذا كان الأس سالبًا.`,
            String.raw`تحقّق بعدد العوامل السالبة: كل زوجين منها يعطيان موجبًا.`,
          ],
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 32, section: 'مثال' }],
              note: 'خطة خطوات صيغت للدفتر انطلاقًا من مثال الأساس السالب ص32 وشرح الأقواس.',
            },
          ],
        },
        {
          id: 'proc-simplify-power-expression',
          title: 'كيف نبسّط عبارة إلى قوة واحدة؟',
          steps: [
            String.raw`اقرأ العملية بين القوى: ضرب، قسمة، أم قوة قوة؟`,
            String.raw`تحقّق من تساوي الأساس أو الأس، بما في ذلك الأقواس والإشارات.`,
            String.raw`اكتب عملية الأسين وحدها قبل حسابها: جمع في الضرب، وطرح أس المقام في القسمة.`,
            String.raw`لا تحوّل القوة إلى عدد ضخم إذا كان المطلوب قوة واحدة.`,
          ],
          sources: [
            {
              origin: 'adapted',
              refs: [
                { page: 34, section: 'تحقّق من فهمك', item: '③' },
                { page: 34, section: 'تدرّب', item: '③' },
              ],
              note: 'خطة خطوات مستخلصة من تحقّق من فهمك ③ وتدرّب ③ ص34.',
            },
          ],
        },
        {
          id: 'proc-substitute-negative',
          title: 'كيف نعوّض بقيمة سالبة في عبارة؟',
          steps: [
            String.raw`ضع القيمة السالبة كاملة بين قوسين في كل ظهور للمتغير، حفاظًا على إشارتها.`,
            String.raw`احسب القوى أولًا: $(-4)^{3}$ و$(-4)^{2}$ منفصلتين.`,
            String.raw`أنجز الضرب، ثم الجمع والطرح من اليسار إلى اليمين.`,
            String.raw`راجع كل حد منفصلًا: الإشارة، العامل، والعدد الثابت.`,
          ],
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 33, section: 'مثال', item: '③' }],
              note: 'خطة خطوات مستخلصة من مثال C ص33.',
            },
          ],
        },
        {
          id: 'proc-cube-volume',
          title: 'كيف نحسب حجم مكعب ونحوّل الوحدة؟',
          steps: [
            String.raw`حوّل طول الحرف إلى الوحدة المطلوبة أولًا: $1\ \text{dm}=10\ \text{cm}$.`,
            String.raw`احسب الحجم بتكعيب طول الحرف: $V=s^{3}$، لأن الأبعاد الثلاثة متساوية.`,
            String.raw`أو احسب الحجم بالوحدة الأصلية ثم حوّل بمعامل التحويل مكعّبًا: $1\ \text{dm}^{3}=1000\ \text{cm}^{3}$.`,
            String.raw`قارن الناتجين للتحقق؛ يجب أن يتساويا.`,
          ],
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 34, section: 'تدرّب', item: '④' }],
              note: 'خطة خطوات مستخلصة من مسألة حجم المكعب ص34؛ الحل المفصّل في الدرس من إعداد المنصة.',
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
          id: 'example-product-same-base',
          title: 'مثال 1: جداء قوتين ذات أساس واحد',
          text: String.raw`الأساس واحد، فنجمع الأسين:`,
          math: String.raw`2^{4}\times2^{3}=2^{4+3}=2^{7}=128`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 32, section: 'قواعد حساب القوى', item: '(1)' }],
              note: 'مثال أصلي يوضّح قاعدة الجداء ص32، اختير بعيدًا عن بنود نشاط الكتاب وتمارينه حتى لا يُحلّ تمرين الطالب عنه.',
            },
          ],
        },
        {
          id: 'example-quotient-same-base',
          title: 'مثال 2: خارج قوتين ذات أساس واحد',
          text: String.raw`الأساس واحد، فنطرح أس المقام من أس البسط:`,
          math: String.raw`\frac{9^{5}}{9^{2}}=9^{5-2}=9^{3}=729`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 33, section: 'قواعد حساب القوى', item: '(3)' }],
              note: 'مثال أصلي يوضّح قاعدة خارج القوتين ص33، بعيدًا عن بنود نشاط الكتاب وتمارينه.',
            },
          ],
        },
        {
          id: 'example-power-of-product',
          title: 'مثال 3: جداء قوتين ذات أس واحد',
          text: String.raw`الأس واحد، فنضرب الأساسين ونحتفظ بالأس:`,
          math: String.raw`2^{3}\times5^{3}=(2\times5)^{3}=10^{3}=1\,000`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 32, section: 'قواعد حساب القوى', item: '(2)' }],
              note: 'مثال أصلي يوضّح قوة الجداء ص32، بعيدًا عن بنود نشاط الكتاب وتمارينه.',
            },
          ],
        },
        {
          id: 'example-negative-base',
          title: 'مثال 4: قوة أساس سالب بأس فردي',
          text: String.raw`الأساس هو $-7$ كاملًا، والأس فردي:`,
          math: String.raw`(-7)^{3}=(-7)\times(-7)\times(-7)=-343`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 32, section: 'مثال', item: 'بعد التعريف الأول' }],
            },
          ],
        },
        {
          id: 'example-negative-power',
          title: 'مثال 5: قوة ذات أس سالب',
          text: String.raw`الأس السالب يعني مقلوب القوة الموجبة:`,
          math: String.raw`3^{-2}=\frac{1}{3^{2}}=\frac{1}{9}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 32, section: 'مثال', item: 'بعد التعريف الثاني' }],
            },
          ],
        },
        {
          id: 'example-A-B',
          title: 'مثال 6: الأقواس تحدّد الأساس',
          text: String.raw`في $A$ الأساس هو الجداء كله، وفي $B$ الأساس هو 4 وحده:`,
          math: String.raw`A=(5\times4)^{3}=20^{3}=8\,000\qquad B=5\times4^{3}=5\times64=320`,
          sources: [
            {
              origin: 'book',
              refs: [
                { page: 33, section: 'مثال', item: '①' },
                { page: 33, section: 'مثال', item: '②' },
              ],
            },
          ],
        },
        {
          id: 'example-C',
          title: 'مثال 7: التعويض بقيمة سالبة في عبارة',
          text: String.raw`نعوّض بالقيمة السالبة بين قوسين، ثم نحسب القوى فالضرب فالجمع والطرح:`,
          math: String.raw`\begin{aligned}C&=5(-4)^{3}+6(-4)^{2}-10\\ &=5\times(-64)+6\times16-10\\ &=-320+96-10\\ &=-234\end{aligned}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 33, section: 'مثال', item: '③' }],
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
          id: 'caution-parentheses',
          title: 'الأقواس تحدّد مدى الأس',
          text: String.raw`$(-3)^{2}=9$ لأن الإشارة داخل القوس، أما $-3^{2}=-(3^{2})=-9$ لأن القوة تخصّ 3 وحدها؛ وعند الأس الفردي تتساوى القيمتان مصادفة، فاختبر الفرق بأس زوجي.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 32, section: 'مثال' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من مثال الأساس السالب وشرح الأقواس ص32.',
            },
          ],
        },
        {
          id: 'caution-negative-exponent-sign',
          title: 'الأس السالب لا يغيّر إشارة الناتج',
          text: String.raw`$(-2)^{-3}=-\frac{1}{8}$ لأن الأساس سالب والأس فردي، و$(-3)^{-2}=\frac{1}{9}$ لأن الأس زوجي؛ والأس السالب يعني المقلوب لا الإشارة السالبة.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 32, section: 'مثال', item: 'بعد التعريف الثاني' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من تعريف الأس السالب ص32.',
            },
          ],
        },
        {
          id: 'caution-distribute-over-addition',
          title: 'القوة لا تتوزّع على الجمع',
          text: String.raw`$(2+3)^{2}=25$ بينما $2^{2}+3^{2}=13$؛ فقوة الجداء تتوزّع على العوامل، أما الجمع فلا.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 32, section: 'قواعد حساب القوى', item: '(2)' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من قاعدة قوة الجداء ص32 وحدود استعمالها.',
            },
          ],
        },
        {
          id: 'caution-subtract-order',
          title: 'اتجاه الطرح في القسمة',
          text: String.raw`في $\frac{a^{2}}{a^{-3}}$ نطرح أس المقام: $2-(-3)=5$، فالناتج $a^{5}$ لا $a^{-1}$؛ ضع الأس السالب بين قوسين.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 33, section: 'قواعد حساب القوى', item: '(3)' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من قاعدة خارج القوتين ص33.',
            },
          ],
        },
        {
          id: 'caution-zero-domain',
          title: 'حدود قاعدة الصفر',
          text: String.raw`$0^{4}=0$ لأن الأس موجب، أما $0^{0}$ و$0^{-1}$ فغير معرّفتين في هذا الدرس؛ فلا تعمّم $0^{n}=0$ على كل أس صحيح.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 32, section: 'تعلّم', item: 'تعريف' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من النص المطبوع وشرحه في الدرس ص32.',
            },
          ],
        },
        {
          id: 'caution-volume-conversion',
          title: 'معامل تحويل الحجم ليس معامل الطول',
          text: String.raw`$1\ \text{dm}^{3}=1000\ \text{cm}^{3}$ وليس $10\ \text{cm}^{3}$؛ لأن الأبعاد الثلاثة تتحول، فمعامل التحويل يُكعّب.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 34, section: 'تدرّب', item: '④' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من مسألة حجم المكعب ص34.',
            },
          ],
        },
        {
          id: 'caution-no-rule-for-sum',
          title: 'لا توجد قاعدة تجمع الأسين في الجمع',
          text: String.raw`$a^{n}+a^{m}$ ليس $a^{n+m}$؛ فقاعدة جمع الأسين تخصّ الجداء $a^{n}\times a^{m}$ لا الجمع.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 32, section: 'قواعد حساب القوى', item: '(1)' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من قاعدة الجداء ص32.',
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
          text: String.raw`انسخ نصوص التمارين الآتية من الصفحة $34$ من الكتاب («تحقّق من فهمك» و«تدرّب») وحلّها في دفترك. تُعرض هنا نصوص التمارين فقط، وتبقى الحلول في أنشطة الدرس التفاعلية لتقارن بها حلك.`,
          sources: [
            {
              origin: 'platform',
              note: 'تعليمات تنظيمية من المنصة؛ نصوص التمارين التالية منقولة من الكتاب ص34.',
            },
          ],
        },
        {
          id: 'hw-check-1',
          title: 'تحقّق من فهمك ① — اكتب العدد بصيغة قوة',
          steps: [
            String.raw`$3\times3\times3\times3\times3\times3\times3$`,
            String.raw`$1.3\times1.3\times1.3\times1.3\times1.3$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 34, section: 'تحقّق من فهمك', item: '①' }],
            },
          ],
        },
        {
          id: 'hw-check-2',
          title: 'تحقّق من فهمك ② — احسب الناتج الصحيح',
          steps: [
            String.raw`$5^{2}$`,
            String.raw`$5^{-2}$`,
            String.raw`$(-9)^{2}$`,
            String.raw`$\left(\frac{2}{5}\right)^{2}$`,
            String.raw`$\left(-\frac{1}{4}\right)^{3}$`,
            String.raw`$(-2)^{-5}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 34, section: 'تحقّق من فهمك', item: '②' }],
            },
          ],
        },
        {
          id: 'hw-check-3',
          title: 'تحقّق من فهمك ③ — استخدم خواص القوى',
          steps: [
            String.raw`$5^{3}\times5^{2}$`,
            String.raw`$(-4)^{3}\times(-4)^{5}$`,
            String.raw`$8^{2}\times8^{3}\times8^{5}$`,
            String.raw`$3^{4}\times3^{-2}$`,
            String.raw`$\frac{7^{3}}{7^{2}}$`,
            String.raw`$\left(\frac{2}{3}\right)^{3}\times\left(\frac{2}{3}\right)^{2}\times\left(\frac{2}{3}\right)^{7}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 34, section: 'تحقّق من فهمك', item: '③' }],
            },
          ],
        },
        {
          id: 'hw-practice-1',
          title: 'تدرّب ① — اكتب العدد بصيغة قوة',
          steps: [
            String.raw`$(-2)\times(-2)\times(-2)$`,
            String.raw`$25$`,
            String.raw`$-32$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 34, section: 'تدرّب', item: '①' }],
            },
          ],
        },
        {
          id: 'hw-practice-2',
          title: 'تدرّب ② — احسب الناتج',
          steps: [
            String.raw`$1^{9}$`,
            String.raw`$3^{-3}$`,
            String.raw`$(-0.4)^{2}$`,
            String.raw`$\left(\frac{-3}{-4}\right)^{3}$`,
            String.raw`$\left(-\frac{2}{3}\right)^{2}$`,
            String.raw`$(-0.4)^{-3}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 34, section: 'تدرّب', item: '②' }],
            },
          ],
        },
        {
          id: 'hw-practice-3',
          title: 'تدرّب ③ — استعمل خواص القوى',
          steps: [
            String.raw`$2^{-3}\times2^{-4}$`,
            String.raw`$6^{4}\times6^{-7}$`,
            String.raw`$(-7)^{-4}\times(-7)^{2}\times(-7)^{-3}$`,
            String.raw`$\frac{2^{5}}{2^{3}}$`,
            String.raw`$\frac{-10}{(-10)^{4}}$`,
            String.raw`$\left(-\frac{5}{7}\right)^{2}\times\left(-\frac{5}{7}\right)^{3}\times\left(-\frac{5}{7}\right)$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 34, section: 'تدرّب', item: '③' }],
            },
          ],
        },
        {
          id: 'hw-practice-4',
          title: 'تدرّب ④ — حجم مكعب',
          text: String.raw`مكعب طول حرفه $\frac{3}{2}\ \text{dm}$، احسب حجمه بالسنتيمترات المكعبة.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 34, section: 'تدرّب', item: '④' }],
            },
          ],
        },
      ],
    },
  ],
};
