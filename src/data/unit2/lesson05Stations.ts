/**
 * محطات تصفح درس تمارين الوحدة الثانية.
 *
 * التقسيم تنظيمي فقط: يحافظ على ترتيب الأسئلة 1–39 كما في المصدر، ويُستعمل
 * عنوانًا للمجموعة في واجهة الطالب وفي مساحة المعلّم. لا يغيّر أي نص أو ترقيم.
 *
 * ملف مستقل صغير لتفادي الاستيراد الدائري بين بيانات الدرس وحلول المعلّم.
 */

export interface ExerciseStation {
  id: string;
  title: string;
  from: number;
  to: number;
}

export const unit2Lesson5Stations: ExerciseStation[] = [
  { id: 'u2-l5-station-1', title: 'المحطة 1: الأسئلة 1–5 — اختيار من متعدد، تصحيح تأكيدات، وقراءة الأعداد', from: 1, to: 5 },
  { id: 'u2-l5-station-2', title: 'المحطة 2: الأسئلة 6–10 — كتابة الأعداد الصغيرة، عمر الكون، وأولويات القوى', from: 6, to: 10 },
  { id: 'u2-l5-station-3', title: 'المحطة 3: الأسئلة 11–15 — إكمال المساويات والتعويض', from: 11, to: 15 },
  { id: 'u2-l5-station-4', title: 'المحطة 4: الأسئلة 16–20 — الصيغة المعيارية والعمليات المركبة', from: 16, to: 20 },
  { id: 'u2-l5-station-5', title: 'المحطة 5: الأسئلة 21–25 — ترتيب العمليات وقوى العدد 10', from: 21, to: 25 },
  { id: 'u2-l5-station-6', title: 'المحطة 6: الأسئلة 26–30 — تغيير الكتابة والتحويلات بين الوحدات', from: 26, to: 30 },
  { id: 'u2-l5-station-7', title: 'المحطة 7: الأسئلة 31–35 — الكتابة الحرفية والمساحات والأحجام', from: 31, to: 35 },
  { id: 'u2-l5-station-8', title: 'المحطة 8: الأسئلة 36–39 — تطبيقات دقيقة ومراجعة شاملة', from: 36, to: 39 },
];

export const stationOf = (n: number): ExerciseStation =>
  unit2Lesson5Stations.find((station) => n >= station.from && n <= station.to) ?? unit2Lesson5Stations[0];
