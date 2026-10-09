import { LessonData } from '../unit1/lesson01';

/**
 * انطلاقة نشطة للوحدة الثانية (الصفحة 25 من الكتاب).
 * نص الأسئلة والخيارات كما في الكتاب؛ الشرح والتصحيح من المنصة وموسومان بذلك.
 */
export const unit2WarmupData: LessonData = {
  id: 'warmup',
  number: 0,
  unitId: 'unit-2',
  unitTitle: 'الوحدة الثانية: قوى الأعداد العادية',
  title: 'انطلاقة نشطة',
  description: 'تشخيص معارف الضرب في 10 و1000 والقسمة عليها، وترميز المربع والمكعب، والتقريب العشري.',
  sourcePages: [25],
  steps: [
    {
      id: 'step-1',
      title: 'الأسئلة 1 — 4: الضرب في قوى العدد 10',
      subtitle: 'في كلّ مما يأتي، واحدة فقط من الإجابات ① و ② و ③ صحيحة، أشر إليها.',
      sourcePages: [25],
      blocks: [
        {
          id: 'p25-instruction',
          type: 'mcq',
          title: 'في كلّ مما يأتي، واحدة فقط من الإجابات ① و ② و ③ صحيحة، أشر إليها.',
          sourceRef: { page: 25, section: 'انطلاقة نشطة', item: 'تعليمة' },
          content: 'اختر الإجابة الصحيحة في كل بند. سيظهر تصحيح كل خيار بعد اختياره.',
        },
        {
          id: 'p25-item-1',
          type: 'mcq',
          title: '1. $13.8\\times1\\,000$ يساوي',
          sourceRef: { page: 25, section: 'انطلاقة نشطة', item: '1' },
          content: '$13.8\\times1\\,000$ يساوي',
          interactiveType: 'mcq',
          interactiveData: {
            options: [
              { id: '1', label: '①', text: '138', isCorrect: false, explanation: 'غير صحيحة: ضرب العدد في 1000 ينقل الفاصلة ثلاث خانات إلى اليمين، فلا يصبح 138.' },
              { id: '2', label: '②', text: '1380', isCorrect: false, explanation: 'غير صحيحة: بعد نقل الفاصلة ثلاث خانات نحصل على 13800 وليس 1380.' },
              { id: '3', label: '③', text: '13800', isCorrect: true, explanation: 'صحيحة: $13.8\\times1\\,000=13\\,800$ لأن الفاصلة تنتقل ثلاث خانات إلى اليمين.' },
            ],
          },
        },
        {
          id: 'p25-item-2',
          type: 'mcq',
          title: '2. $0.0037\\times1\\,000$ يساوي',
          sourceRef: { page: 25, section: 'انطلاقة نشطة', item: '2' },
          content: '$0.0037\\times1\\,000$ يساوي',
          interactiveType: 'mcq',
          interactiveData: {
            options: [
              { id: '1', label: '①', text: '0.37', isCorrect: false, explanation: 'غير صحيحة: نقلنا الفاصلة خانة واحدة فقط، والمطلوب ثلاث خانات.' },
              { id: '2', label: '②', text: '3.7', isCorrect: true, explanation: 'صحيحة: $0.0037\\times1\\,000=3.7$ لأن الفاصلة تنتقل ثلاث خانات إلى اليمين.' },
              { id: '3', label: '③', text: '37', isCorrect: false, explanation: 'غير صحيحة: نقلنا الفاصلة أكثر من ثلاث خانات.' },
            ],
          },
        },
        {
          id: 'p25-item-3',
          type: 'mcq',
          title: '3. $135.2\\times0.01$ يساوي',
          sourceRef: { page: 25, section: 'انطلاقة نشطة', item: '3' },
          content: '$135.2\\times0.01$ يساوي',
          interactiveType: 'mcq',
          interactiveData: {
            options: [
              { id: '1', label: '①', text: '0.1352', isCorrect: false, explanation: 'غير صحيحة: الضرب في 0.01 يُنقل الفاصلة خانتين فقط، فلا تصبح الفاصلة بعد الصفر الأول.' },
              { id: '2', label: '②', text: '1.352', isCorrect: true, explanation: 'صحيحة: $135.2\\times0.01=1.352$ لأن الفاصلة تنتقل خانتين إلى اليسار.' },
              { id: '3', label: '③', text: '13.52', isCorrect: false, explanation: 'غير صحيحة: الضرب في 0.01 يقلّل العدد، ولا يكبّره.' },
            ],
          },
        },
        {
          id: 'p25-item-4',
          type: 'mcq',
          title: '4. $6.19\\times0.001$ يساوي',
          sourceRef: { page: 25, section: 'انطلاقة نشطة', item: '4' },
          content: '$6.19\\times0.001$ يساوي',
          interactiveType: 'mcq',
          interactiveData: {
            options: [
              { id: '1', label: '①', text: '0.00619', isCorrect: true, explanation: 'صحيحة: $6.19\\times0.001=0.00619$ لأن الفاصلة تنتقل ثلاث خانات إلى اليسار.' },
              { id: '2', label: '②', text: '0.0619', isCorrect: false, explanation: 'غير صحيحة: نقلنا الفاصلة خانتين فقط.' },
              { id: '3', label: '③', text: '0.619', isCorrect: false, explanation: 'غير صحيحة: نقلنا الفاصلة خانة واحدة فقط.' },
            ],
          },
        },
      ],
    },
    {
      id: 'step-2',
      title: 'الأسئلة 5 — 6: المربع والمكعب',
      subtitle: 'ترميز مساحة الدائرة وحجم المكعب',
      sourcePages: [25],
      blocks: [
        {
          id: 'p25-item-5',
          type: 'mcq',
          title: '5. ترمز $\\mathcal{A}$ إلى مساحة دائرة نصف قطرها $R$، تُعطى بالصيغة $\\mathcal{A}=\\pi R^2$. الرمز $R^2$ يدل على',
          sourceRef: { page: 25, section: 'انطلاقة نشطة', item: '5' },
          content: 'الرمز $R^2$ يدل على',
          interactiveType: 'mcq',
          interactiveData: {
            options: [
              { id: '1', label: '①', text: 'R+R', isCorrect: false, explanation: 'غير صحيحة: $R+R=2R$ وليس $R^2$.' },
              { id: '2', label: '②', text: 'R\\times R', isCorrect: true, explanation: 'صحيحة: $R^2$ تعني $R$ مضروباً في نفسه مرة، أي $R\\times R$.' },
              { id: '3', label: '③', text: '2R', isCorrect: false, explanation: 'غير صحيحة: $2R$ هو مجموع $R+R$.' },
            ],
          },
        },
        {
          id: 'p25-item-6',
          type: 'mcq',
          title: '6. ترمز $V$ إلى حجم مكعب طول حرفه $a$، يُعطى $V$ بالصيغة $V=a^3$. الرمز $a^3$ يدل على',
          sourceRef: { page: 25, section: 'انطلاقة نشطة', item: '6' },
          content: 'الرمز $a^3$ يدل على',
          interactiveType: 'mcq',
          interactiveData: {
            options: [
              { id: '1', label: '①', text: 'a+a^2', isCorrect: false, explanation: 'غير صحيحة: الجمع لا يمثل الأس.' },
              { id: '2', label: '②', text: 'a\\times a\\times a', isCorrect: true, explanation: 'صحيحة: $a^3$ تعني $a\\times a\\times a$.' },
              { id: '3', label: '③', text: '3a', isCorrect: false, explanation: 'غير صحيحة: $3a=a+a+a$.' },
            ],
          },
        },
      ],
    },
    {
      id: 'step-3',
      title: 'الأسئلة 7 — 8: التقريب',
      subtitle: 'تقريب ناتج الآلة الحاسبة 3.538441805',
      sourcePages: [25],
      blocks: [
        {
          id: 'p25-item-7',
          type: 'mcq',
          title: '7. هي ذي النتيجة التي حصلنا عليها من عملية حسابية باستعمال آلة حاسبة: 3.538441805. إذا قرّبنا هذه النتيجة إلى أقرب جزء من عشرة حصلنا على',
          sourceRef: { page: 25, section: 'انطلاقة نشطة', item: '7' },
          content: 'التقريب إلى أقرب جزء من عشرة (رقم واحد بعد الفاصلة).',
          interactiveType: 'mcq',
          interactiveData: {
            options: [
              { id: '1', label: '①', text: '3.6', isCorrect: false, explanation: 'غير صحيحة: الرقم بعد الفاصلة الأولى هو 5 والرقم التالي 3، فلا نرفع الخانة إلى 6.' },
              { id: '2', label: '②', text: '3.53', isCorrect: false, explanation: 'غير صحيحة: هذا تقريب إلى جزأين من مئة، وليس إلى جزء من عشرة.' },
              { id: '3', label: '③', text: '3.5', isCorrect: true, explanation: 'صحيحة: $3.538441805\\approx3.5$ لأن الرقم التالي للخانة الأولى بعد الفاصلة هو 3 (أصغر من 5).' },
            ],
          },
        },
        {
          id: 'p25-item-8',
          type: 'mcq',
          title: '8. إذا قرّبنا $3.538441805$ إلى أقرب جزء من مئة حصلنا على',
          sourceRef: { page: 25, section: 'انطلاقة نشطة', item: '8' },
          content: 'التقريب إلى أقرب جزء من مئة (رقمين بعد الفاصلة).',
          interactiveType: 'mcq',
          interactiveData: {
            options: [
              { id: '1', label: '①', text: '3.54', isCorrect: true, explanation: 'صحيحة: $3.538441805\\approx3.54$ لأن الرقم التالي للخانة الثانية بعد الفاصلة هو 8 (أكبر من 5 أو يساويه).' },
              { id: '2', label: '②', text: '3.538', isCorrect: false, explanation: 'غير صحيحة: هذا تقريب إلى ثلاثة أجزاء من ألف.' },
              { id: '3', label: '③', text: '3.53', isCorrect: false, explanation: 'غير صحيحة: الرقم التالي للخانة الثانية هو 8، فنرفع الخانة إلى 4.' },
            ],
          },
        },
      ],
    },
  ],
};
