import type { StudentNotebookData } from './types';

/**
 * دفتر الطالب — الدرس 2 (قواعد قوى العدد 10)، الوحدة الثانية.
 *
 * محتوى مؤلف ومراجع مقابل كتل الدرس `u2-lesson-2` (الصفحات 29–31):
 *  - القواعد الأربع منقولة من بطاقة «تعلّم» ص29، وأمثلتها الكتابية الأربعة.
 *  - الحساب بالصيغة $a\times10^{n}$ وحصر العدد بين قوتين من «اكتساب معارف»
 *    وأمثلة A وB والحصر ص30.
 *  - خطوات الحل والتنبيهات إعادة صياغة منهجية انطلاقًا من الصفحات نفسها (adapted).
 *  - قسم «تمارين مطلوبة للتدوين» ينقل نصوص تمارين ص31 فقط (بلا حلول).
 */
export const unit2Lesson2Notebook: StudentNotebookData = {
  unitId: 'unit-2',
  lessonId: 'u2-lesson-2',
  title: 'دفتر الطالب — قواعد قوى العدد 10',
  review: {
    date: '2026-11-23',
    note:
      'راجعت المنصة كل قاعدة وصيغة ومثال وتمرين في هذا الدفتر مقابل صفحات الكتاب $29$–$31$: ' +
      'القواعد الأربع وأمثلتها ص29، والحساب بالصيغة المعيارية وأمثلة A وB والحصر ص30، ' +
      'ونصوص تمارين ص31 (دون حلولها). وأُعيد حساب A وB والحدّين تحققًا مستقلًا.',
  },
  sections: [
    {
      id: 'definitions',
      kind: 'definitions',
      title: 'التعريفات والمصطلحات',
      entries: [
        {
          id: 'def-same-base',
          title: 'قوى ذات أساس واحد',
          text: String.raw`القوتان $10^{n}$ و$10^{m}$ ذات أساس واحد لأن الأساس فيهما هو العدد 10 نفسه، والأسان $n$ و$m$ قد يكونان موجبين أو سالبين أو صفرًا.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 29, section: 'تعلم' }],
              note: 'تعريف توضيحي مستخلص من بطاقة «تعلم» ص29 التي تقدّم القواعد الأربع على الأساس 10.',
            },
          ],
        },
        {
          id: 'def-power-of-power',
          title: 'قوة القوة',
          text: String.raw`قوة القوة هي قوة مرفوعة إلى قوة، مثل $(10^{n})^{m}$؛ والأس الخارجي $m$ يكرّر المجموعة كلها لا العامل 10 منفردًا.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 29, section: 'تعلم' }],
              note: 'تعريف توضيحي مستخلص من قاعدة «قوة قوة» في «تعلم» ص29.',
            },
          ],
        },
        {
          id: 'def-reciprocal-power',
          title: 'مقلوب القوة',
          text: String.raw`مقلوب القوة $10^{n}$ هو $\frac{1}{10^{n}}$، ويساوي $10^{-n}$؛ فالمقلوب يغيّر إشارة الأس.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 29, section: 'تعلم', item: 'المقلوب' }],
            },
          ],
        },
        {
          id: 'def-scientific-calculation',
          title: 'الحساب بالصيغة المعيارية',
          text: String.raw`لإنجاز جداء ضرب أو خارج قسمة أعداد مكتوبة بالصيغة $a\times10^{n}$، نجمع قوى العدد 10 على حدتها، ونجمع الأعداد الأخرى على حدتها.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 29, section: 'اكتساب معارف', item: 'الضرب والقسمة' }],
            },
          ],
        },
        {
          id: 'def-bounding',
          title: 'حصر عدد بين قوتين متتاليتين',
          text: String.raw`لحصر عدد موجب بين قوتين متتاليتين للعدد 10، نكتبه بالصيغة المعيارية $a\times10^{n}$ حيث $1\le a<10$، فيكون $10^{n}\le a\times10^{n}<10^{n+1}$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 30, section: 'حصر عدد بين قوتين متتاليتين' }],
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
          id: 'rule-product-add-exponents',
          title: 'الضرب: نجمع الأسين',
          text: String.raw`إذا اتحد الأساس، فإن $10^{n}\times10^{m}=10^{n+m}$؛ فمثلًا $10^{6}\times10^{-4}=10^{6-4}=10^{2}$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 29, section: 'تعلم', item: 'الضرب' }],
            },
          ],
        },
        {
          id: 'rule-reciprocal',
          title: 'المقلوب: نغيّر إشارة الأس',
          text: String.raw`$\frac{1}{10^{n}}=10^{-n}$؛ فمثلًا $\frac{1}{10^{-6}}=10^{-(-6)}=10^{6}$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 29, section: 'تعلم', item: 'المقلوب' }],
            },
          ],
        },
        {
          id: 'rule-quotient-subtract',
          title: 'القسمة: نطرح أس المقام من أس البسط',
          text: String.raw`$\frac{10^{n}}{10^{m}}=10^{n-m}$؛ فمثلًا $\frac{10^{2}}{10^{-3}}=10^{2-(-3)}=10^{5}$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 29, section: 'تعلم', item: 'القسمة' }],
            },
          ],
        },
        {
          id: 'rule-power-multiply',
          title: 'قوة القوة: نضرب الأسين',
          text: String.raw`$(10^{n})^{m}=10^{n\times m}$؛ فمثلًا $(10^{-3})^{2}=10^{-3\times2}=10^{-6}$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 29, section: 'تعلم', item: 'قوة قوة' }],
            },
          ],
        },
        {
          id: 'rule-add-sub-unify-power',
          title: 'الجمع والطرح: نوحّد القوة أولًا',
          text: String.raw`لإنجاز مجموع أو طرح أعداد مكتوبة بالصيغة $a\times10^{n}$، نكتب الحدود بصيغ تتضمن القوة ذاتها للعدد 10، ثم نجمع المعاملات.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 29, section: 'اكتساب معارف', item: 'الجمع والطرح' }],
            },
          ],
        },
        {
          id: 'rule-bounding',
          title: 'من الصيغة المعيارية إلى الحصر',
          text: String.raw`إذا كان $N=a\times10^{n}$ و$1\le a<10$، فإن $10^{n}\le N<10^{n+1}$؛ الحد الأدنى مساواة عندما $a=1$، والحد الأعلى صارم دائمًا.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 30, section: 'حصر عدد بين قوتين متتاليتين' }],
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
          math: String.raw`10^{n}\times10^{m}=10^{n+m}\qquad \frac{10^{n}}{10^{m}}=10^{n-m}\qquad (10^{n})^{m}=10^{n\times m}\qquad \frac{1}{10^{n}}=10^{-n}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 29, section: 'تعلم' }],
            },
          ],
        },
        {
          id: 'formula-multiply-divide',
          title: 'الضرب والقسمة بالصيغة المعيارية',
          math: String.raw`(a\times10^{n})(b\times10^{m})=(ab)\times10^{n+m}\qquad \frac{a\times10^{n}}{b\times10^{m}}=\frac{a}{b}\times10^{n-m}`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 29, section: 'اكتساب معارف', item: 'الضرب والقسمة' }],
              note: 'صياغة رمزية للدفتر انطلاقًا من قاعدة «اكتساب معارف» ص29 وأمثلة A ص30.',
            },
          ],
        },
        {
          id: 'formula-add-subtract',
          title: 'الجمع والطرح بالصيغة المعيارية',
          math: String.raw`a\times10^{n}+b\times10^{n}=(a+b)\times10^{n}`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 29, section: 'اكتساب معارف', item: 'الجمع والطرح' }],
              note: 'صياغة رمزية للدفتر انطلاقًا من قاعدة «اكتساب معارف» ص29 ومثال B ص30.',
            },
          ],
        },
        {
          id: 'formula-bounding',
          title: 'صيغة الحصر',
          math: String.raw`1\le a<10\quad\Longrightarrow\quad 10^{n}\le a\times10^{n}<10^{n+1}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 30, section: 'حصر عدد بين قوتين متتاليتين' }],
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
          id: 'proc-identify-operation',
          title: 'حدّد شكل العملية قبل لمس الأسس',
          steps: [
            String.raw`ضع دائرة حول العملية الخارجية: ضرب، قسمة، مقلوب، أم قوة قوة؟`,
            String.raw`تحقّق من تساوي الأساس أو الأس بحسب القاعدة: الأساس الواحد للجمع والطرح، والأس الواحد لقوة الجداء.`,
            String.raw`اكتب عملية الأسين مع الأقواس حول الأعداد السالبة.`,
            String.raw`احسب الأس الناتج، وتحقّق من كونه موجبًا أم سالبًا.`,
          ],
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 31, section: 'تحقّق من فهمك' }],
              note: 'خطة عمل صيغت للدفتر انطلاقًا من استراتيجية «حدّد شكل العملية أولًا» في تحقّق من فهمك ص31.',
            },
          ],
        },
        {
          id: 'proc-scientific-multiply-divide',
          title: 'كيف نضرب أو نقسم أعدادًا بالصيغة المعيارية؟',
          steps: [
            String.raw`افصل المعاملات في مسار، وقوى العدد 10 في مسار آخر.`,
            String.raw`احسب المعاملات معًا، واحسب الأسس بالقاعدة المناسبة (جمع في الضرب، طرح في القسمة).`,
            String.raw`أعد كتابة الناتج بالصيغة المعيارية: حرّك الفاصلة حتى يصبح المعامل بين 1 و10، وعوّض ذلك بتغيير الأس.`,
          ],
          sources: [
            {
              origin: 'adapted',
              refs: [
                { page: 29, section: 'اكتساب معارف', item: 'الضرب والقسمة' },
                { page: 30, section: 'مثال', item: '① A' },
              ],
              note: 'خطة خطوات مستخلصة من قاعدة الحساب ص29 ومثال A ص30.',
            },
          ],
        },
        {
          id: 'proc-scientific-add-subtract',
          title: 'كيف نجمع أو نطرح أعدادًا بالصيغة المعيارية؟',
          steps: [
            String.raw`اختار أسًا مشتركًا للحدّين، وحوّل الحد الآخر إليه بنقل الفاصلة وتعديل الأس.`,
            String.raw`بعد توحيد القوة، اجمع المعاملات فقط.`,
            String.raw`أعد كتابة الناتج بالصيغة المعيارية إن لزم.`,
          ],
          sources: [
            {
              origin: 'adapted',
              refs: [
                { page: 29, section: 'اكتساب معارف', item: 'الجمع والطرح' },
                { page: 30, section: 'مثال', item: '② B' },
              ],
              note: 'خطة خطوات مستخلصة من قاعدة الجمع والطرح ص29 ومثال B ص30.',
            },
          ],
        },
        {
          id: 'proc-bounding',
          title: 'كيف نحصر عددًا بين قوتين متتاليتين؟',
          steps: [
            String.raw`اكتب العدد بالصيغة المعيارية $a\times10^{n}$ مع $1\le a<10$.`,
            String.raw`اضرب المتباينة $1\le a<10$ في $10^{n}$ الموجب، فتحصل على $10^{n}\le N<10^{n+1}$.`,
            String.raw`افحص المعامل: إذا كان $a=1$ فالحد الأدنى مساواة، وإلا فالحدّان صارمان.`,
          ],
          sources: [
            {
              origin: 'adapted',
              refs: [
                { page: 30, section: 'حصر عدد بين قوتين متتاليتين' },
                { page: 30, section: 'مثال', item: 'A وB' },
              ],
              note: 'خطة خطوات مستخلصة من قاعدة الحصر ومثالَي A وB ص30.',
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
          id: 'example-A',
          title: 'مثال 1: حساب A بالصيغة المعيارية',
          text: String.raw`نفصل المعاملات عن قوى العدد 10، ثم نطبّع الناتج:`,
          math: String.raw`\begin{aligned}A&=\frac{0.75\times10^{12}\times4\times10^{-5}}{5\times10^{-7}}\\ &=\frac{0.75\times4}{5}\times\frac{10^{12}\times10^{-5}}{10^{-7}}\\ &=0.6\times10^{14}\\ &=6\times10^{13}\end{aligned}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 30, section: 'مثال', item: '① A' }],
            },
          ],
        },
        {
          id: 'example-B',
          title: 'مثال 2: حساب B بالصيغة المعيارية',
          text: String.raw`نحوّل الحد الثاني إلى القوة نفسها ثم نجمع المعاملين:`,
          math: String.raw`\begin{aligned}B&=7.9\times10^{-9}+1\,400\times10^{-12}\\ &=7.9\times10^{-9}+1.4\times10^{-9}\\ &=(7.9+1.4)\times10^{-9}=9.3\times10^{-9}\end{aligned}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 30, section: 'مثال', item: '② B' }],
            },
          ],
        },
        {
          id: 'example-bounding-A',
          title: 'مثال 3: حصر العدد A بين قوتين',
          text: String.raw`ننقل الفاصلة ست خانات إلى اليسار، فالمعامل 2.105395 بين 1 و10:`,
          math: String.raw`A=2.105\,395\times10^{6}\quad\Longrightarrow\quad 10^{6}<A<10^{7}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 30, section: 'مثال', item: 'A' }],
            },
          ],
        },
        {
          id: 'example-bounding-B',
          title: 'مثال 4: حصر العدد B بين قوتين',
          text: String.raw`ننقل الفاصلة خانتين إلى اليمين، فالمعامل 5.94 بين 1 و10:`,
          math: String.raw`B=5.94\times10^{-2}\quad\Longrightarrow\quad 10^{-2}<B<10^{-1}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 30, section: 'مثال', item: 'B' }],
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
          id: 'caution-product-multiply-exponents',
          title: 'لا تضرب الأسين في قاعدة الضرب',
          text: String.raw`$10^{3}\times10^{2}=10^{5}$ وليس $10^{6}$؛ فالضرب يضمّ العوامل، لذلك نجمع الأسين. ولا نضرب الأسين إلا في قوة القوة.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 29, section: 'تعلم', item: 'الضرب' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من قاعدة الضرب ص29.',
            },
          ],
        },
        {
          id: 'caution-subtract-order',
          title: 'اتجاه الطرح وأقواس الأس السالب',
          text: String.raw`في القسمة نكتب «أس البسط ناقص أس المقام»، ونضع الأس السالب بين قوسين: $10^{-15}\div10^{-4}=10^{-15-(-4)}=10^{-11}$ لا $10^{-19}$.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 29, section: 'تعلم', item: 'القسمة' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من قاعدة القسمة ص29.',
            },
          ],
        },
        {
          id: 'caution-power-of-power',
          title: 'قوة القوة تضرب لا تجمع',
          text: String.raw`$(10^{3})^{2}=10^{3\times2}=10^{6}$ وليس $10^{5}$؛ فالأس الخارجي يكرّر المجموعة كلها.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 29, section: 'تعلم', item: 'قوة قوة' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من قاعدة قوة القوة ص29.',
            },
          ],
        },
        {
          id: 'caution-negative-exponent-positive',
          title: 'الأس السالب لا يعطي عددًا سالبًا',
          text: String.raw`$10^{-n}=\frac{1}{10^{n}}>0$؛ فالأس السالب يعني المقلوب، والناتج يبقى موجبًا.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 29, section: 'تعلم', item: 'المقلوب' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من قاعدة المقلوب ص29.',
            },
          ],
        },
        {
          id: 'caution-add-exponents',
          title: 'الجمع لا يجمع الأسس',
          text: String.raw`$7.9\times10^{-9}+1\,400\times10^{-12}$ لا تساوي $1\,407.9\times10^{-21}$؛ يجب توحيد القوة أولًا ثم جمع المعاملات فقط.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 30, section: 'مثال', item: '② B' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من مثال B ص30.',
            },
          ],
        },
        {
          id: 'caution-bounding-strict',
          title: 'حدّا الحصر ليسا متماثلين',
          text: String.raw`إذا كان $1\le a<10$ فالصحيح $10^{n}\le N<10^{n+1}$؛ فالحد الأدنى مساواة فقط عندما $a=1$، والحد الأعلى صارم دائمًا.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 30, section: 'حصر عدد بين قوتين متتاليتين' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من قاعدة الحصر ص30.',
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
          text: String.raw`انسخ نصوص التمارين الآتية من الصفحة $31$ من الكتاب («تحقّق من فهمك» و«تدرّب») وحلّها في دفترك. تُعرض هنا نصوص التمارين فقط، وتبقى الحلول في أنشطة الدرس التفاعلية لتقارن بها حلك.`,
          sources: [
            {
              origin: 'platform',
              note: 'تعليمات تنظيمية من المنصة؛ نصوص التمارين التالية منقولة من الكتاب ص31.',
            },
          ],
        },
        {
          id: 'hw-check-1',
          title: 'تحقّق من فهمك ① — اكتب كل جداء على شكل قوة واحدة',
          steps: [
            String.raw`$10^{5}\times10^{7}$`,
            String.raw`$10^{10}\times10^{-5}$`,
            String.raw`$10^{-8}\times10^{4}$`,
            String.raw`$10^{-9}\times10^{-3}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 31, section: 'تحقّق من فهمك', item: '① الجداء' }],
            },
          ],
        },
        {
          id: 'hw-check-2',
          title: 'تحقّق من فهمك ② — اكتب مقلوب كل مما يأتي',
          steps: [
            String.raw`$\frac{1}{10^{3}}$`,
            String.raw`$\frac{1}{10^{-8}}$`,
            String.raw`$\frac{1}{10^{-4}}\times10^{4}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 31, section: 'تحقّق من فهمك', item: '② المقلوب' }],
            },
          ],
        },
        {
          id: 'hw-check-3',
          title: 'تحقّق من فهمك ③ — اكتب كل خارج قسمة',
          steps: [
            String.raw`$\frac{10^{11}}{10^{6}}$`,
            String.raw`$\frac{10^{5}}{10^{-8}}$`,
            String.raw`$\frac{10^{-30}}{10^{-10}}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 31, section: 'تحقّق من فهمك', item: '③ القسمة' }],
            },
          ],
        },
        {
          id: 'hw-check-4',
          title: 'تحقّق من فهمك ④ — اكتب كل قوة',
          steps: [
            String.raw`$(10^{3})^{5}$`,
            String.raw`$(10^{4})^{-3}$`,
            String.raw`$(10^{-1})^{-9}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 31, section: 'تحقّق من فهمك', item: '④ القوة' }],
            },
          ],
        },
        {
          id: 'hw-practice-1',
          title: 'تدرّب ① — اكتب كل ناتج بالصيغة قوة واحدة',
          steps: [
            String.raw`$\frac{10^{2}}{10^{-4}}$`,
            String.raw`$(10^{-2})^{4}$`,
            String.raw`$\frac{1}{10^{1}}\times10^{-7}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 31, section: 'تدرّب', item: '①' }],
            },
          ],
        },
        {
          id: 'hw-practice-2',
          title: 'تدرّب ② — اكتب كل ناتج بصيغة قوة واحدة',
          steps: [
            String.raw`$(10^{2})^{3}\times10^{4}$`,
            String.raw`$10^{-1}\times(10^{-2})^{4}$`,
            String.raw`$\frac{(10^{5})^{2}}{10^{7}}$`,
            String.raw`$\frac{10^{4}\times10^{9}}{(10^{5})^{3}}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 31, section: 'تدرّب', item: '②' }],
            },
          ],
        },
        {
          id: 'hw-practice-3',
          title: 'تدرّب ③ — قطر ذرة الهيدروجين',
          text: String.raw`قطر ذرة الهيدروجين هو بحدود $0.000\,000\,1\ \text{mm}$. (1) اكتب هذا العدد بصيغة قوة للعدد 10. (2) احسب الطول الذي نحصل عليه إذا جاورنا على مستقيم واحد عشر ملايين ذرة هيدروجين.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 31, section: 'تدرّب', item: '③' }],
            },
          ],
        },
      ],
    },
  ],
};
