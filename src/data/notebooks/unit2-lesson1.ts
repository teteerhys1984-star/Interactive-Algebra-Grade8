import type { StudentNotebookData } from './types';

/**
 * دفتر الطالب — الدرس 1 (قوى العدد 10)، الوحدة الثانية.
 *
 * محتوى مؤلف ومراجع مقابل كتل الدرس `u2-lesson-1` (الصفحات 26–28):
 *  - التعريفات والقواعد والأمثلة النموذجية منقولة من «تعريف 1» و«تعريف 2»
 *    و«الصيغة المعيارية لعدد عشري» و«اكتساب معارف» ص26–27.
 *  - خطوات الحل والتنبيهات إعادة صياغة منهجية انطلاقًا من الصفحات نفسها (adapted).
 *  - قسم «تمارين مطلوبة للتدوين» ينقل نصوص تمارين ص28 فقط (بلا حلول)؛
 *    حلولها تبقى في أنشطة الدرس التفاعلية للتحقق الذاتي.
 *  - وُثّق موضعان مصدريان بشفافية: شكل تعريف 2 (عدد الأصفار قبل الرقم 1)،
 *    والبند «566 3.3» في تحقّق من فهمك ③، كما هما في بيانات الدرس.
 */
export const unit2Lesson1Notebook: StudentNotebookData = {
  unitId: 'unit-2',
  lessonId: 'u2-lesson-1',
  title: 'دفتر الطالب — قوى العدد 10',
  review: {
    date: '2026-11-23',
    note:
      'راجعت المنصة كل تعريف وقاعدة وصيغة ومثال وتمرين في هذا الدفتر مقابل صفحات الكتاب $26$–$28$: ' +
      'تعريف القوة الموجبة والقيم الخاصة ص26، وتعريف القوة السالبة ومثاليه ص26–27، ' +
      'والصيغة المعيارية وأمثلتها و«اكتساب معارف» ص27، ونصوص تمارين ص28 (دون حلولها). ' +
      'وحُفظ توثيق موضعَي الشكل المصدر غير المحسومين في بيانات الدرس.',
  },
  sections: [
    {
      id: 'definitions',
      kind: 'definitions',
      title: 'التعريفات والمصطلحات',
      entries: [
        {
          id: 'def-positive-power',
          title: 'القوة الموجبة للعدد 10',
          text: String.raw`في حالة $n\ge2$، يرمز $10^{n}$ إلى جداء العدد $10$ بنفسه $n$ مرة، ويُقرأ «10 أس n» أو «10 مرفوعًا للأس n».`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 26, section: 'تعريف 1' }],
            },
          ],
        },
        {
          id: 'def-zero-and-one-power',
          title: 'القيم الخاصة: القوة الصفرية والقوة الأولى',
          text: String.raw`من الكتاب: $10^{0}=1$ و$10^{1}=10$؛ فالقوة الصفرية للعدد 10 تساوي واحدًا، والقوة الأولى تساوي 10.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 26, section: 'تعريف 1 (القيم الخاصة)' }],
            },
          ],
        },
        {
          id: 'def-negative-power',
          title: 'القوة السالبة للعدد 10',
          text: String.raw`في حالة $n\ge1$، يرمز $10^{-n}$ إلى مقلوب $10^{n}$، أي $10^{-n}=\frac{1}{10^{n}}$؛ والناتج عدد موجب أصغر من 1.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 26, section: 'تعريف 2' }],
            },
          ],
        },
        {
          id: 'def-standard-form',
          title: 'الصيغة المعيارية لعدد عشري',
          text: String.raw`الصيغة المعيارية لعدد عشري هي $a\times10^{n}$، حيث $a$ عدد عشري قسمه الصحيح ذو خانة واحدة مغاير للصفر، و$n$ عدد صحيح؛ ويُترجم هذا القيد إلى $1\le|a|<10$.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 27, section: 'الصيغة المعيارية لعدد عشري' }],
            },
          ],
        },
        {
          id: 'def-milliard',
          title: 'المليار',
          text: String.raw`المليار هو $1\,000\,000\,000$، أي $10^{9}$، ويُستعمل في كتابة الأعداد الكبيرة مثل عدد كرّيات الدم في لتر الدم.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 28, section: 'تدرّب', item: '4' }],
              note: 'تعريف توضيحي مستخلص من مسألة كرّيات الدم ص28؛ الكتاب يستعمل لفظ «مليار» في المسألة، والقيمة $10^{9}$ هي التعريف الشائع في العربية الحديثة كما ورد في شرح الدرس.',
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
          id: 'rule-zeros-equal-exponent',
          title: 'عدد الأصفار يساوي الأس الموجب',
          text: String.raw`العدد $10^{n}$ هو الواحد متبوعًا بـ $n$ صفرًا؛ فمثلًا $10^{4}=10\,000$ أربعة أصفار بعد الواحد.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 26, section: 'تعريف 1 (الشكل التوضيحي)' }],
            },
          ],
        },
        {
          id: 'rule-negative-means-reciprocal',
          title: 'الأس السالب يعني المقلوب',
          text: String.raw`القوة $10^{-n}$ تساوي $\frac{1}{10^{n}}$؛ فالرقم 1 يقع في الخانة $n$ بعد الفاصلة، وقبله $n-1$ صفرًا.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 26, section: 'تعريف 2' }],
              note: 'صياغة القاعدة بدقة رياضية انطلاقًا من تعريف 2 ص26؛ الشكل المطبوع يضع «n صفرًا» تحت الجزء العشري، والصواب أن الأصفار قبل الرقم 1 هي $n-1$، كما يوضّح شرح الدرس.',
            },
          ],
        },
        {
          id: 'rule-standard-form-one-digit',
          title: 'شرط الصيغة المعيارية: خانة واحدة غير صفرية',
          text: String.raw`في $a\times10^{n}$ يجب أن يقع $a$ في المجال $1\le|a|<10$؛ فـ$25.698\times10^{2}$ صيغة صحيحة القيمة لكنها ليست معيارية، والصيغة المعيارية للعدد نفسه هي $2.569\,8\times10^{3}$.`,
          sources: [
            {
              origin: 'adapted',
              refs: [
                { page: 27, section: 'الصيغة المعيارية لعدد عشري' },
                { page: 27, section: 'مثال: 2 569.8' },
              ],
              note: 'قاعدة شرطية مستخلصة من تعريف الصيغة المعيارية ومثال العدد 2 569.8 ص27.',
            },
          ],
        },
        {
          id: 'rule-decimal-movement',
          title: 'نقل الفاصلة يغيّر الأس في الاتجاه المعاكس',
          text: String.raw`إذا نقلنا الفاصلة $k$ خانة إلى اليسار داخل $a$ زدنا الأس $k$، وإذا نقلناها $k$ خانة إلى اليمين نقصنا الأس $k$، وتبقى قيمة العدد ثابتة.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 27, section: 'اكتساب معارف' }],
              note: 'قاعدة عملية مركّبة للدفتر انطلاقًا من «اكتساب معارف» ص27 وأمثلة تحويل الصيغ في الصفحة نفسها.',
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
          id: 'formula-positive-power',
          title: 'صيغة القوة الموجبة',
          math: String.raw`10^{n}=1\underbrace{0\cdots0}_{n\ \text{أصفار}}\qquad(n\ge2)`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 26, section: 'تعريف 1 (الشكل التوضيحي)' }],
            },
          ],
        },
        {
          id: 'formula-negative-power',
          title: 'صيغة القوة السالبة',
          math: String.raw`10^{-n}=\frac{1}{10^{n}}\qquad(n\ge1)`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 26, section: 'تعريف 2' }],
            },
          ],
        },
        {
          id: 'formula-standard-form',
          title: 'صيغة العدد بالصيغة المعيارية',
          math: String.raw`a\times10^{n}\qquad n\in\mathbb{Z}\qquad 1\le|a|<10`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 27, section: 'الصيغة المعيارية لعدد عشري' }],
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
          id: 'proc-power-to-decimal',
          title: 'كيف نحوّل قوة موجبة أو سالبة للعدد 10 إلى الشكل العشري؟',
          steps: [
            String.raw`انظر إلى إشارة الأس أولًا: الأس الموجب يكبّر العدد، والأس السالب يصغّره.`,
            String.raw`إذا كان $n$ موجبًا: اكتب الواحد متبوعًا بـ $n$ صفرًا؛ فـ$10^{5}=100\,000$.`,
            String.raw`إذا كان $n$ سالبًا: ضع الرقم 1 في الخانة $|n|$ بعد الفاصلة، أي بعد $|n|-1$ صفرًا؛ فـ$10^{-5}=0.000\,01$.`,
            String.raw`تحقّق بالاتجاه المعاكس: اضرب الناتج في $10^{|n|}$ ويجب أن تحصل على 1.`,
          ],
          sources: [
            {
              origin: 'adapted',
              refs: [
                { page: 26, section: 'تعريف 2' },
                { page: 27, section: 'اكتساب معارف' },
              ],
              note: 'خطة خطوات صيغت للدفتر انطلاقًا من تعريف 2 ص26 و«اكتساب معارف» ص27.',
            },
          ],
        },
        {
          id: 'proc-write-standard-form',
          title: 'كيف نكتب عددًا بالصيغة المعيارية؟',
          steps: [
            String.raw`حرّك الفاصلة حتى يصبح أمامها رقم واحد غير صفري.`,
            String.raw`إن حرّكت الفاصلة $k$ خانة إلى اليسار فالأس $+k$، وإن حرّكتها $k$ خانة إلى اليمين فالأس $-k$.`,
            String.raw`اكتب العدد على الصورة $a\times10^{n}$ مع $1\le|a|<10$.`,
            String.raw`تحقّق: اضرب $a$ في $10^{n}$ ويجب أن تعود إلى العدد الأصلي.`,
          ],
          sources: [
            {
              origin: 'adapted',
              refs: [
                { page: 27, section: 'مثال: 2 569.8' },
                { page: 28, section: 'تحقّق من فهمك', item: '③' },
              ],
              note: 'خطة خطوات مستخلصة من مثال العدد 2 569.8 ص27 وطريقة حل تحقّق من فهمك ③ ص28.',
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
          id: 'example-10-minus-3',
          title: 'مثال 1: قوة سالبة للعدد 10 بالصيغة العشرية',
          text: String.raw`نكتب $10^{-3}$ مقلوب $10^{3}$، ثم نحسب القوة الموجبة:`,
          math: String.raw`10^{-3}=\frac{1}{10^{3}}=\frac{1}{1\,000}=0.001`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 26, section: 'مثال' }],
            },
          ],
        },
        {
          id: 'example-10-6',
          title: 'مثال 2: قوة موجبة للعدد 10 بالصيغة العشرية',
          text: String.raw`ستة عوامل من 10، والناتج واحد متبوع بستة أصفار:`,
          math: String.raw`10^{6}=10\times10\times10\times10\times10\times10=1\,000\,000`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 26, section: 'مثال' }],
            },
          ],
        },
        {
          id: 'example-2569-8',
          title: 'مثال 3: العدد 2 569.8 بصيغ مختلفة',
          text: String.raw`العدد نفسه يكتب بعدة صيغ، لكن واحدة فقط منها معيارية:`,
          math: String.raw`2\,569.8=25\,698\times10^{-1}=25.698\times10^{2}=2.569\,8\times10^{3}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 27, section: 'مثال: 2 569.8' }],
            },
          ],
        },
        {
          id: 'example-negative-2569-8',
          title: 'مثال 4: الصيغة المعيارية لعدد سالب',
          text: String.raw`الإشارة السالبة تخص $a$ ولا تدخل في الأس:`,
          math: String.raw`-2\,569.8=-2.569\,8\times10^{3}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 27, section: 'مثال' }],
            },
          ],
        },
        {
          id: 'example-2715',
          title: 'مثال 5: تغيير الأس مع الحفاظ على القيمة',
          text: String.raw`نكتب $10^{9}$ بدلالة $10^{14}$، فنضرب $2\,715$ في $10^{-5}$:`,
          math: String.raw`2\,715\times10^{9}=2\,715\times10^{-5}\times10^{14}=0.027\,15\times10^{14}`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 27, section: 'مثال', item: '2715' }],
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
          id: 'caution-negative-power-positive',
          title: 'الأس السالب لا يجعل العدد سالبًا',
          text: String.raw`$10^{-7}=0.000\,000\,1$ وليس $-10\,000\,000$؛ فالإشارة السالبة في الأس تعني المقلوب، والناتج يبقى موجبًا.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 26, section: 'تعريف 2' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من تعريف 2 ص26.',
            },
          ],
        },
        {
          id: 'caution-power-not-product',
          title: 'القوة ليست ضربًا في الأساس',
          text: String.raw`$10^{3}=10\times10\times10=1\,000$ وليس $10\times3=30$؛ فالقوة تكرار للضرب لا ضرب في الأساس.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 26, section: 'تعريف 1' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من تعريف 1 ص26.',
            },
          ],
        },
        {
          id: 'caution-one-digit',
          title: 'خانتان قبل الفاصلة ليست صيغة معيارية',
          text: String.raw`$25.698\times10^{2}$ صحيحة القيمة لكنها ليست معيارية لأن $25.698$ ليس بين 1 و10؛ الصيغة المعيارية هي $2.569\,8\times10^{3}$.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 27, section: 'الصيغة المعيارية لعدد عشري' }],
              note: 'تنبيه صيغ للدفتر انطلاقًا من شرط الصيغة المعيارية ص27.',
            },
          ],
        },
        {
          id: 'caution-count-places',
          title: 'عدّ الخانات لا الأصفار فقط',
          text: String.raw`في $10^{-5}=0.000\,01$ يقع الرقم 1 في الخانة الخامسة بعد الفاصلة، وقبله أربعة أصفار؛ فالأس هو $-5$ لا $-4$.`,
          sources: [
            {
              origin: 'adapted',
              refs: [
                { page: 26, section: 'تعريف 2' },
                { page: 28, section: 'تحقّق من فهمك', item: '①' },
              ],
              note: 'تنبيه صيغ للدفتر انطلاقًا من تعريف 2 ص26 وطريقة العدّ في تحقّق من فهمك ص28؛ الشكل المطبوع يذكر «n صفرًا» والصواب الرياضي $n-1$ صفرًا قبل الرقم 1.',
            },
          ],
        },
        {
          id: 'caution-verify-inverse',
          title: 'تحقّق من إجابتك بالاتجاه المعاكس',
          text: String.raw`بعد أي تحويل، اضرب $a$ في $10^{n}$ ويجب أن تعود إلى العدد الأصلي؛ فمثلًا $8.536\times10^{2}=853.6$ لأن نقل الفاصلة خانتين إلى اليمين يعيد العدد.`,
          sources: [
            {
              origin: 'adapted',
              refs: [{ page: 27, section: 'الصيغة المعيارية لعدد عشري' }],
              note: 'طريقة تحقق عملية صيغت للدفتر انطلاقًا من أمثلة الصيغة المعيارية ص27.',
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
          text: String.raw`انسخ نصوص التمارين الآتية من الصفحة $28$ من الكتاب («تحقّق من فهمك» و«تدرّب») وحلّها في دفترك. تُعرض هنا نصوص التمارين فقط، وتبقى الحلول في أنشطة الدرس التفاعلية لتقارن بها حلك.`,
          sources: [
            {
              origin: 'platform',
              note: 'تعليمات تنظيمية من المنصة؛ نصوص التمارين التالية منقولة من الكتاب ص28.',
            },
          ],
        },
        {
          id: 'hw-check-1',
          title: 'تحقّق من فهمك ① — اكتب بالشكل العشري',
          steps: [
            String.raw`$10^{7}$`,
            String.raw`$10^{9}$`,
            String.raw`$10^{-6}$`,
            String.raw`$10^{-8}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 28, section: 'تحقّق من فهمك', item: '①' }],
            },
          ],
        },
        {
          id: 'hw-check-2',
          title: 'تحقّق من فهمك ② — اكتب العدد بشكل قوة للعدد 10',
          steps: [
            String.raw`$100\,000\,000$`,
            String.raw`$0.000\,01$`,
            String.raw`$0.01$`,
            String.raw`مليون`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 28, section: 'تحقّق من فهمك', item: '②' }],
            },
          ],
        },
        {
          id: 'hw-check-3',
          title: 'تحقّق من فهمك ③ — اكتب بالصيغة المعيارية',
          steps: [
            String.raw`$3.7$`,
            String.raw`$853.6$`,
            String.raw`$2\,365$`,
            String.raw`$566\;3.3$`,
            String.raw`$0.9$`,
            String.raw`$0.000\,005\,1$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 28, section: 'تحقّق من فهمك', item: '③' }],
              note: 'تنبيه توثيق: البند ④ يُطبع «566 3.3» والقراءة المعتمدة 5 663.3 كما في بيانات الدرس؛ أُبقي النص كما في الكتاب.',
            },
          ],
        },
        {
          id: 'hw-practice-1',
          title: 'تدرّب 1 — اكتب بالشكل العشري',
          steps: [
            String.raw`$10^{7}$`,
            String.raw`$10^{4}$`,
            String.raw`$10^{0}$`,
            String.raw`$10^{2}$`,
            String.raw`$10^{5}$`,
            String.raw`$10^{-4}$`,
            String.raw`$10^{-3}$`,
            String.raw`$10^{-1}$`,
            String.raw`$10^{9}$`,
            String.raw`$10^{-2}$`,
            String.raw`$10^{8}$`,
            String.raw`$10^{-6}$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 28, section: 'تدرّب', item: '1' }],
            },
          ],
        },
        {
          id: 'hw-practice-2',
          title: 'تدرّب 2 — اكتب بدلالة قوة للعدد 10',
          steps: [
            String.raw`$100\,000$`,
            String.raw`$10\,000\,000$`,
            String.raw`$10$`,
            String.raw`$0.000\,1$`,
            String.raw`$0.000\,001$`,
            String.raw`$0.1$`,
            String.raw`$100\times1\,000$`,
            String.raw`$\frac{1}{10\,000}$`,
            String.raw`$1$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 28, section: 'تدرّب', item: '2' }],
            },
          ],
        },
        {
          id: 'hw-practice-3',
          title: 'تدرّب 3 — اكتب بالصيغة المعيارية',
          steps: [
            String.raw`$75$`,
            String.raw`$0.0123$`,
            String.raw`$84\,677$`,
            String.raw`$0.98$`,
            String.raw`$0.002$`,
            String.raw`$0.000\,025$`,
          ],
          sources: [
            {
              origin: 'book',
              refs: [{ page: 28, section: 'تدرّب', item: '3' }],
            },
          ],
        },
        {
          id: 'hw-practice-4',
          title: 'تدرّب 4 — كرّيات الدم الحمراء',
          text: String.raw`في كل لتر من دم الإنسان يوجد بحدود 4500 مليار كرية حمراء. أجب عن الأسئلة الثلاثة: (1) اكتب الصيغة العشرية لهذا العدد. (2) أكمل: $45\times10^{\dots}$ و $0.45\times10^{\dots}$. (3) اكتب كلاً من هذين العددين بالصيغة المعيارية.`,
          sources: [
            {
              origin: 'book',
              refs: [{ page: 28, section: 'تدرّب', item: '4' }],
            },
          ],
        },
      ],
    },
  ],
};
