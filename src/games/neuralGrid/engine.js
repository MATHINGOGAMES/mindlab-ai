/**
 * engine.js
 * المحرك المنطقي للعبة Neural Grid.
 * يقوم بتوليد متتاليات حسابية ديناميكية وإنشاء شبكة العرض.
 */

/**
 * توليد شبكة منطقية تعتمد على متتاليات حسابية متطورة.
 * @param {number} level - المستوى الحالي للعبة.
 * @param {number} [size=3] - حجم الشبكة (اختياري).
 */
export function generateGrid(level = 1, size = 3) {
  // 1. حساب الإعدادات (Logic Configuration)
  // جعل نقطة البداية (base) والقفزة (step) تزيد صعوبتها مع الليفل
  const base = Math.floor(Math.random() * (level * 5)) + level + 2;

  // القفزة تزيد صعوبة تدريجياً، مع ضمان عدم وجود قفزة صفرية
  const step = Math.max(1, Math.floor(Math.random() * (level + 1)) + 1);

  // 2. إنشاء المصفوفة الأساسية (البيانات الحقيقية)
  const grid = Array.from({ length: size }, (_, rowIndex) =>
    Array.from({ length: size }, (_, colIndex) => {
      // المعادلة: القيمة = البداية + (الترتيب الكلي للخانة * القفزة)
      const index = rowIndex * size + colIndex;
      return base + index * step;
    })
  );

  // 3. اختيار الخلية المخفية بعشوائية
  const hiddenRow = Math.floor(Math.random() * size);
  const hiddenCol = Math.floor(Math.random() * size);
  const answer = grid[hiddenRow][hiddenCol];

  // 4. إنشاء مصفوفة العرض (تبديل الإجابة بـ "?" للحفاظ على عدم التعديل Immutability)
  const displayGrid = grid.map((row, rIdx) =>
    row.map((cell, cIdx) =>
      rIdx === hiddenRow && cIdx === hiddenCol ? "?" : cell
    )
  );

  // 5. إرجاع البيانات بتنسيق موحد
  return {
    displayGrid, // المصفوفة التي تظهر للمستخدم
    answer, // الإجابة الصحيحة للتحقق
    metadata: { level, step, base, size }, // معلومات مفيدة للتطوير
  };
}
