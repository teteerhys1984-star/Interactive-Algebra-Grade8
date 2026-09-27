import { LessonData } from './lesson01';

export const warmupData: LessonData = {
  id: 'warmup',
  number: 0,
  unitId: 'unit-1',
  unitTitle: 'الوحدة الأولى: الأعداد العادية والعمليات عليها',
  title: 'انطلاقة نشطة',
  description: 'تشخيص واسترجاع المعارف الأساسية في الكسور، التبسيط، المقارنة، والضرب التقاطعي.',
  sourcePages: [3, 4],
  steps: [
    {
      id: 'step-1',
      title: 'الأسئلة متعددة الخيارات (1 — 4)',
      subtitle: 'اختبار المعارف في التناسب، التبسيط، المقارنة والضرب',
      sourcePages: [3],
      blocks: [
        {
          id: 'p3-q1-header',
          type: 'mcq',
          title: '1. في كلّ مما يلي، واحدة فقط من الإجابات الثلاث ① و ② و ③ المقترحة صحيحة، أشر إليها',
          sourceRef: { page: 3, section: 'انطلاقة نشطة', item: '1' },
          content: 'اختر الإجابة الصحيحة لكل سؤال من الأسئلة الأربعة الآتية:',
        },
        {
          id: 'p3-q1-1',
          type: 'mcq',
          title: '1.1 مسألة الصيد (عامر وباسل)',
          sourceRef: { page: 3, section: 'انطلاقة نشطة', item: '1.1' },
          content: 'اصطاد عامر $48$ سمكة، واصطاد باسل $16$ سمكة. **حصة باسل مما اصطادا معاً هي:**',
          interactiveType: 'mcq',
          interactiveData: {
            options: [
              { id: '1', label: '①', text: '\\frac{1}{4}', isCorrect: true, explanation: 'مجموع ما اصطاداه هو $48 + 16 = 64$ سمكة. حصة باسل هي $\\frac{16}{64} = \\frac{1}{4}$.' },
              { id: '2', label: '②', text: '\\frac{6}{8}', isCorrect: false, explanation: 'غير صحيحة؛ الكسر $\\frac{6}{8} = \\frac{3}{4}$ وهو يمثل حصة عامر.' },
              { id: '3', label: '③', text: '\\frac{1}{3}', isCorrect: false, explanation: 'غير صحيحة؛ النسبة بين باسل وعامر هي $\\frac{16}{48} = \\frac{1}{3}$ وليست حصته من المجموع الكلي.' },
            ],
          },
        },
        {
          id: 'p3-q1-2',
          type: 'mcq',
          title: '1.2 تبسيط كسر بأعداد عشرية',
          sourceRef: { page: 3, section: 'انطلاقة نشطة', item: '1.2' },
          content: '$\\frac{0.6}{4.2}$ **يساوي:**',
          interactiveType: 'mcq',
          interactiveData: {
            options: [
              { id: '1', label: '①', text: '\\frac{60}{42}', isCorrect: false, explanation: 'غير صحيحة؛ عند ضرب البسط والمقام بـ $10$ نحصل على $\\frac{6}{42}$ وليس $\\frac{60}{42}$.' },
              { id: '2', label: '②', text: '\\frac{1}{7}', isCorrect: true, explanation: 'صحيحة؛ $\\frac{0.6}{4.2} = \\frac{6}{42} = \\frac{6 \\div 6}{42 \\div 6} = \\frac{1}{7}$.' },
              { id: '3', label: '③', text: '0.142857', isCorrect: false, explanation: 'قيمة تقريبية عشرية غير تامة وليست صيغة الكسر العادي المضبوط.' },
            ],
          },
        },
        {
          id: 'p3-q1-3',
          type: 'mcq',
          title: '1.3 مقارنة كسرين',
          sourceRef: { page: 3, section: 'انطلاقة نشطة', item: '1.3' },
          content: 'يمكن التأكد من المقارنة بين $\\frac{3}{5}$ و $\\frac{5}{8}$ من:',
          interactiveType: 'mcq',
          interactiveData: {
            options: [
              { id: '1', label: '①', text: '\\frac{3}{5} < \\frac{5}{8}', isCorrect: true, explanation: 'صحيحة؛ بتوحيد المقامات إلى $40$: $\\frac{3}{5} = \\frac{24}{40}$ و $\\frac{5}{8} = \\frac{25}{40}$. وبما أن $24 < 25$ فإن $\\frac{3}{5} < \\frac{5}{8}$.' },
              { id: '2', label: '②', text: '\\frac{3}{5} > \\frac{5}{8}', isCorrect: false, explanation: 'غير صحيحة لأن $\\frac{24}{40} < \\frac{25}{40}$.' },
              { id: '3', label: '③', text: '\\frac{3}{5} = \\frac{5}{8}', isCorrect: false, explanation: 'غير صحيحة فالكسران غير متكافئين.' },
            ],
          },
        },
        {
          id: 'p3-q1-4',
          type: 'mcq',
          title: '1.4 ضرب الكسور العادية',
          sourceRef: { page: 3, section: 'انطلاقة نشطة', item: '1.4' },
          content: 'يمكن التأكد من أنّ $\\frac{4}{7} \\times \\frac{5}{8}$ **يساوي:**',
          interactiveType: 'mcq',
          interactiveData: {
            options: [
              { id: '1', label: '①', text: '\\frac{5}{14}', isCorrect: true, explanation: 'صحيحة؛ $\\frac{4 \\times 5}{7 \\times 8} = \\frac{20}{56} = \\frac{20 \\div 4}{56 \\div 4} = \\frac{5}{14}$ (أو بالاختصار المباشر لـ $4$ مع $8$).' },
              { id: '2', label: '②', text: '\\frac{45}{78}', isCorrect: false, explanation: 'غير صحيحة.' },
              { id: '3', label: '③', text: '\\frac{9}{15}', isCorrect: false, explanation: 'غير صحيحة؛ جمع البسوط والمقامات خطأ شائع في الضرب.' },
            ],
          },
        },
      ],
    },
    {
      id: 'step-2',
      title: 'النسب المئوية وتوحيد المقامات (2 — 4)',
      subtitle: 'التحويل بين الكسور والنسب المئوية وإيجاد مقام مشترك',
      sourcePages: [3],
      blocks: [
        {
          id: 'p3-ex2',
          type: 'practice',
          title: '2. اكتب كلاً من النسب المئوية الآتية بصيغة كسر عادي',
          sourceRef: { page: 3, section: 'انطلاقة نشطة', item: '2' },
          content: 'اكتب كلاً من النسب المئوية الآتية بصيغة كسر عادي واختصر إلى أبسط صورة:',
          subItems: [
            { label: '①', text: 'تحويل $5\\%$:', math: '5\\% = \\frac{5}{100} = \\frac{1}{20}', explanation: 'قسمنا البسط والمقام على $5$.' },
            { label: '②', text: 'تحويل $12\\%$:', math: '12\\% = \\frac{12}{100} = \\frac{3}{25}', explanation: 'قسمنا البسط والمقام على $4$.' },
            { label: '③', text: 'تحويل $40\\%$:', math: '40\\% = \\frac{40}{100} = \\frac{2}{5}', explanation: 'قسمنا البسط والمقام على $20$.' },
            { label: '④', text: 'تحويل $75\\%$:', math: '75\\% = \\frac{75}{100} = \\frac{3}{4}', explanation: 'قسمنا البسط والمقام على $25$.' },
          ],
        },
        {
          id: 'p3-ex3',
          type: 'practice',
          title: '3. اكتب كلاً من الكسور الآتية بصيغة نسبة مئوية',
          sourceRef: { page: 3, section: 'انطلاقة نشطة', item: '3' },
          content: 'اكتب كلاً من الكسور الآتية بصيغة نسبة مئوية (بجعل المقام $100$):',
          subItems: [
            { label: '①', text: 'الكسر $\\frac{9}{50}$:', math: '\\frac{9}{50} = \\frac{9 \\times 2}{50 \\times 2} = \\frac{18}{100} = 18\\%' },
            { label: '②', text: 'الكسر $\\frac{2}{5}$:', math: '\\frac{2}{5} = \\frac{2 \\times 20}{5 \\times 20} = \\frac{40}{100} = 40\\%' },
            { label: '③', text: 'الكسر $\\frac{3}{10}$:', math: '\\frac{3}{10} = \\frac{3 \\times 10}{10 \\times 10} = \\frac{30}{100} = 30\\%' },
            { label: '④', text: 'الكسر $\\frac{7}{25}$:', math: '\\frac{7}{25} = \\frac{7 \\times 4}{25 \\times 4} = \\frac{28}{100} = 28\\%' },
          ],
        },
        {
          id: 'p3-ex4',
          type: 'practice',
          title: '4. إيجاد كسرين بمقامين متساويين',
          sourceRef: { page: 3, section: 'انطلاقة نشطة', item: '4' },
          content: 'أوجد كسرين عاديين مقامهما متساويان، يساوي أحدهما الكسر $X$ ويساوي الآخر الكسر $Y$:',
          subItems: [
            {
              label: '①',
              text: '$X = -\\frac{1}{2}$ و $Y = \\frac{3}{4}$',
              math: 'X = -\\frac{2}{4} \\quad , \\quad Y = \\frac{3}{4}',
              explanation: 'المقام المشترك هو $4$.',
            },
            {
              label: '②',
              text: '$X = \\frac{4}{3}$ و $Y = -\\frac{5}{7}$',
              math: 'X = \\frac{4 \\times 7}{3 \\times 7} = \\frac{28}{21} \\quad , \\quad Y = -\\frac{5 \\times 3}{7 \\times 3} = -\\frac{15}{21}',
              explanation: 'المقام المشترك هو $3 \\times 7 = 21$.',
            },
            {
              label: '③',
              text: '$X = \\frac{5}{8}$ و $Y = -\\frac{13}{12}$',
              math: 'X = \\frac{5 \\times 3}{8 \\times 3} = \\frac{15}{24} \\quad , \\quad Y = -\\frac{13 \\times 2}{12 \\times 2} = -\\frac{26}{24}',
              explanation: 'أصغر مضاعف مشترك لـ $8$ و $12$ هو $24$.',
            },
          ],
        },
        {
          id: 'p3-tip-1',
          type: 'tip',
          title: 'إضاءة: تكافؤ الكسور',
          sourceRef: { page: 3, section: 'إضاءة', item: 'خاصية الضرب والقسمة' },
          content: 'لا تتغير قيمة الكسر إذا ضُرب كل من بسطه ومقامه بعدد مغاير للصفر:\n$$\\frac{a}{b} = \\frac{a \\times c}{b \\times c} \\quad , \\quad \\frac{a}{b} = \\frac{a \\div c}{b \\div c}$$',
        },
      ],
    },
    {
      id: 'step-3',
      title: 'الكسور الدخيلة وصيغ الكسور (5 — 7)',
      subtitle: 'اكتشاف الكسر الدخيل وتبسيط الكسور بعد تحديد الإشارة وخاصية التناسب',
      sourcePages: [3, 4],
      blocks: [
        {
          id: 'p3-ex5',
          type: 'interactive-exercise',
          title: '5. اكتشاف الكسر الدخيل',
          sourceRef: { page: 3, section: 'انطلاقة نشطة', item: '5' },
          content: 'في كلّ من القائمتين الآتيتين كسرٌ مغاير لبقية الكسور (دخيل عليها)، أشر إليه مع التعليل:',
          interactiveType: 'intruder-finder',
          interactiveData: {
            lists: [
              {
                id: 'list-1',
                label: 'القائمة الأولى:',
                items: [
                  { fraction: '\\frac{-4.5}{-2}', value: 2.25, isIntruder: false },
                  { fraction: '\\frac{45}{20}', value: 2.25, isIntruder: false },
                  { fraction: '\\frac{19}{14}', value: 1.357, isIntruder: true },
                  { fraction: '\\frac{-22.5}{-10}', value: 2.25, isIntruder: false },
                  { fraction: '\\frac{27}{12}', value: 2.25, isIntruder: false },
                  { fraction: '\\frac{-9}{-4}', value: 2.25, isIntruder: false },
                ],
                explanation: 'الكسر الدخيل هو $\\frac{19}{14}$ لأن جميع الكسور الأخرى تساوي $\\frac{9}{4} = 2.25$.',
              },
              {
                id: 'list-2',
                label: 'القائمة الثانية:',
                items: [
                  { fraction: '\\frac{48}{-9}', value: -5.333, isIntruder: false },
                  { fraction: '\\frac{0.16}{-0.03}', value: -5.333, isIntruder: false },
                  { fraction: '\\frac{-80}{15}', value: -5.333, isIntruder: false },
                  { fraction: '\\frac{-160}{0.3}', value: -533.333, isIntruder: true },
                  { fraction: '\\frac{32}{-6}', value: -5.333, isIntruder: false },
                  { fraction: '\\frac{-16}{3}', value: -5.333, isIntruder: false },
                ],
                explanation: 'الكسر الدخيل هو $\\frac{-160}{0.3}$ لأن قيمته $-533.33\\dots$ بينما جميع الكسور الأخرى تساوي $-\\frac{16}{3} = -5.33\\dots$.',
              },
            ],
          },
        },
        {
          id: 'p3-tip-2',
          type: 'tip',
          title: 'إضاءة: كتابة الكسر بصيغة قياسية',
          sourceRef: { page: 3, section: 'إضاءة', item: 'صيغة الكسر' },
          content: 'في الرياضيات، لتسهيل التعامل مع الكسور، نكتب الكسر غالباً بالصيغة $\\frac{a}{b}$ أو $-\\frac{a}{b}$ (على أن يكون $a$ موجباً و $b$ عدداً طبيعياً موجباً تماماً).',
        },
        {
          id: 'p4-ex6',
          type: 'practice',
          title: '6. بسّط كلاً من الكسور الآتية بعد تحديد إشارته',
          sourceRef: { page: 4, section: 'انطلاقة نشطة', item: '6' },
          content: 'بسّط كلاً من الكسور الآتية بعد تحديد إشارته:',
          subItems: [
            { label: '①', text: 'الكسر $\\frac{14}{-8}$:', math: '\\frac{14}{-8} = -\\frac{14 \\div 2}{8 \\div 2} = -\\frac{7}{4}', explanation: 'الإشارة سالبة، والاختصار بالقسمة على $2$.' },
            { label: '②', text: 'الكسر $\\frac{-30}{150}$:', math: '\\frac{-30}{150} = -\\frac{30 \\div 30}{150 \\div 30} = -\\frac{1}{5}', explanation: 'الإشارة سالبة، والاختصار بالقسمة على $30$.' },
            { label: '③', text: 'الكسر $\\frac{15}{-2.1}$:', math: '\\frac{15}{-2.1} = -\\frac{150}{21} = -\\frac{150 \\div 3}{21 \\div 3} = -\\frac{50}{7}', explanation: 'الإشارة سالبة، نضرب بـ $10$ ثم نقسم على $3$.' },
            { label: '④', text: 'الكسر $\\frac{-90}{-75}$:', math: '\\frac{-90}{-75} = \\frac{90 \\div 15}{75 \\div 15} = \\frac{6}{5}', explanation: 'الإشارة موجبة (سالب على سالب = موجب)، والاختصار بالقسمة على $15$.' },
            { label: '⑤', text: 'الكسر $\\frac{42}{-210}$:', math: '\\frac{42}{-210} = -\\frac{42 \\div 42}{210 \\div 42} = -\\frac{1}{5}', explanation: 'الإشارة سالبة، والاختصار بالقسمة على $42$.' },
            { label: '⑥', text: 'الكسر $\\frac{0.84}{3.6}$:', math: '\\frac{0.84}{3.6} = \\frac{84}{360} = \\frac{84 \\div 12}{360 \\div 12} = \\frac{7}{30}', explanation: 'الإشارة موجبة، نضرب بـ $100$ ثم نقسم على $12$.' },
          ],
        },
        {
          id: 'p4-ex7',
          type: 'practice',
          title: '7. الجداء التقاطعي',
          sourceRef: { page: 4, section: 'انطلاقة نشطة', item: '7' },
          content: 'اكتب خمسة كسور $\\frac{a}{b}$ يساوي كلّ منها $\\frac{5}{6}$. واحسب الجداء $6 \\times a$ و $b \\times 5$. ماذا تستنتج؟',
          subItems: [
            {
              label: 'أمثلة على الكسور',
              text: 'خمسة كسور مكافئة لـ $\\frac{5}{6}$:',
              math: '\\frac{10}{12} , \\frac{15}{18} , \\frac{20}{24} , \\frac{25}{30} , \\frac{50}{60}',
            },
            {
              label: 'حساب الجداءين والمقارنة',
              text: 'في كل كسر من الكسور السابقة نجد أن $6 \\times a = 5 \\times b$ دائماً (مثلاً $6 \\times 10 = 12 \\times 5 = 60$).',
            },
            {
              label: 'الاستنتاج',
              text: '**نستنتج أنّ الجداءين التقاطعيين متساويان دائماً في أي كسرين متساويين**.',
            },
          ],
        },
        {
          id: 'p4-tip-cross',
          type: 'tip',
          title: 'إضاءة: جداء تقاطعي',
          sourceRef: { page: 4, section: 'إضاءة', item: 'خاصية الضرب التقاطعي' },
          content: '• إذا كان $\\frac{a}{b} = \\frac{c}{d}$ ، كان $a \\times d = b \\times c$ مع $b \\neq 0$ و $d \\neq 0$.\n\n• إذا كان $a \\times d = b \\times c$ ، كان $\\frac{a}{b} = \\frac{c}{d}$ مع $b \\neq 0$ و $d \\neq 0$.',
        },
      ],
    },
    {
      id: 'step-4',
      title: 'الضرب التقاطعي والمسائل (8 — 12)',
      subtitle: 'حساب المجاهيل، التحقق من التساوي، قابلية الاختصار، ومسألة أرخميدس',
      sourcePages: [4],
      blocks: [
        {
          id: 'p4-ex8',
          type: 'practice',
          title: '8. استعمل قاعدة الضرب التقاطعي لحساب العدد المجهول في كلّ حالة',
          sourceRef: { page: 4, section: 'انطلاقة نشطة', item: '8' },
          content: 'استعمل قاعدة الضرب التقاطعي لحساب المجهول $x$:',
          subItems: [
            { label: '①', text: '$\\frac{5}{4} = \\frac{8}{x}$:', math: '5 \\times x = 4 \\times 8 \\implies 5x = 32 \\implies x = \\frac{32}{5} = 6.4' },
            { label: '②', text: '$\\frac{17}{x} = \\frac{25}{2}$:', math: '25 \\times x = 17 \\times 2 \\implies 25x = 34 \\implies x = \\frac{34}{25} = 1.36' },
            { label: '③', text: '$\\frac{4}{7.2} = -\\frac{35}{x}$:', math: '4 \\times x = -35 \\times 7.2 \\implies 4x = -252 \\implies x = \\frac{-252}{4} = -63' },
          ],
        },
        {
          id: 'p4-ex9',
          type: 'practice',
          title: '9. التحقق من تساوي الكسرين باستعمال الضرب التقاطعي',
          sourceRef: { page: 4, section: 'انطلاقة نشطة', item: '9' },
          content: 'استعمل قاعدة الضرب التقاطعي للتحقق من تساوي أو عدم تساوي الكسرين:',
          subItems: [
            { label: '①', text: '$\\frac{9.2}{16}$ و $\\frac{13.8}{24}$:', math: '9.2 \\times 24 = 220.8 \\quad , \\quad 16 \\times 13.8 = 220.8', explanation: 'الجداءان متساويان إذن الكسران متساويان.' },
            { label: '②', text: '$\\frac{1534}{8821}$ و $\\frac{15}{62}$:', math: '1534 \\times 62 = 95108 \\quad , \\quad 8821 \\times 15 = 132315', explanation: '$95108 \\neq 132315$ إذن الكسران غير متساويين.' },
            { label: '③', text: '$\\frac{24}{99.2}$ و $\\frac{93.4}{537}$:', math: '24 \\times 537 = 12888 \\quad , \\quad 99.2 \\times 93.4 = 9265.28', explanation: '$12888 \\neq 9265.28$ إذن الكسران غير متساويين.' },
          ],
        },
        {
          id: 'p4-ex10',
          type: 'interactive-exercise',
          title: '10. عبارات صحيحة وخاطئة مع التعليل',
          sourceRef: { page: 4, section: 'انطلاقة نشطة', item: '10' },
          content: 'فيما يلي أربع عبارات، أشر إلى الصحيحة منها وإلى الخاطئة، معلّلاً إجابتك:',
          subItems: [
            {
              label: '① قال زياد: « أستطيع اختصار الكسر $\\frac{60}{18}$ على 2 »',
              text: 'صحيحة ✅ — لأن كلاً من $60$ و $18$ عدد زوجي يقبل القسمة على $2$، ويصبح $\\frac{30}{9}$.',
            },
            {
              label: '② قالت إيلين: « أستطيع اختصار الكسر $\\frac{-60}{35}$ على 5 »',
              text: 'صحيحة ✅ — لأن آحاد $60$ هو $0$ وآحاد $35$ هو $5$، فكلاهما يقبل القسمة على $5$، ويصبح $-\\frac{12}{7}$.',
            },
            {
              label: '③ قالت إيناس: « أستطيع اختصار الكسر $\\frac{132}{104}$ على 3 »',
              text: 'خاطئة ❌ — لأن مجموع أرقام $132$ هو $1+3+2=6$ يقبل على $3$، بينما مجموع أرقام $104$ هو $1+0+4=5$ ولا يقبل على $3$.',
            },
            {
              label: '④ قال طارق: « أستطيع اختصار الكسر $\\frac{774}{-144}$ على 9 »',
              text: 'صحيحة ✅ — لأن مجموع أرقام $774$ هو $7+7+4=18$ يقبل على $9$، ومجموع أرقام $144$ هو $1+4+4=9$ يقبل على $9$، ويصبح $-\\frac{86}{16} = -\\frac{43}{8}$.',
            },
          ],
        },
        {
          id: 'p4-ex11',
          type: 'practice',
          title: '11. احسب العدد المجهول في كلّ حالة',
          sourceRef: { page: 4, section: 'انطلاقة نشطة', item: '11' },
          content: 'احسب المجهول $x$ في كل حالة:',
          subItems: [
            { label: '①', text: '$\\frac{13}{4} = \\frac{39}{x}$:', math: 'x = \\frac{4 \\times 39}{13} = 4 \\times 3 = 12' },
            { label: '②', text: '$\\frac{72}{27} = \\frac{17}{x}$:', math: '\\frac{8}{3} = \\frac{17}{x} \\implies 8x = 51 \\implies x = \\frac{51}{8} = 6.375' },
            { label: '③', text: '$\\frac{15}{45} = \\frac{x}{18}$:', math: '\\frac{1}{3} = \\frac{x}{18} \\implies x = \\frac{18}{3} = 6' },
          ],
        },
        {
          id: 'p4-ex12',
          type: 'word-problem',
          title: '12. مسألة أرخميدس في التاريخ والرياضيات',
          sourceRef: { page: 4, section: 'انطلاقة نشطة', item: '12' },
          content: 'ولد أرخميدس في سيراكوزة الإيطالية في العام $-287$، وقُتل بيد جندي روماني وعمره $75$ سنة.\n\n**تُرى في أيّ عام قُتل؟**',
          subItems: [
            {
              label: 'الحساب والتعليل',
              text: 'بما أنه ولد عام $-287$ (أي $287$ قبل الميلاد) وعاش $75$ عاماً، فإن عام وفاته يُحسب بإضافة عمره إلى سنة ميلاده:',
              math: '-287 + 75 = -212',
              explanation: 'قُتل أرخميدس في العام $-212$، أي في العام **212 قبل الميلاد**.',
            },
          ],
        },
      ],
    },
  ],
};
