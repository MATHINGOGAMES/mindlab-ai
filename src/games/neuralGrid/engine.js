/**
 * توليد شبكة منطقية تعتمد على متتاليات حسابية متطورة.
 * @param {number} level - المستوى الحالي للعبة.
 * @param {number} [size=3] - حجم الشبكة (اختياري).
 */
export function generateGrid(level = 1, size = 3) {
  // 1. حساب الإعدادات (Logic Configuration)
  // جعل القفزة (step) والبداية (base) أكثر ديناميكية
  const base = Math.floor(Math.random() * (level * 2)) + level;
  const step = level < 5 ? 1 : Math.floor(Math.random() * (level / 2)) + 1;

  // 2. إنشاء المصفوفة باستخدام التخطيط (Mapping) بدلاً من الحلقات المتداخلة التقليدية
  // هذا الأسلوب أكثر تعبيراً (Declarative) ويقلل احتمالية أخطاء الـ Index
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

  // 4. الحفاظ على البيانات الأصلية (Immutability)
  // بدلاً من تعديل المصفوفة الأصلية، ننشئ نسخة "للعرض فقط"
  const displayGrid = grid.map((row, rIdx) =>
    row.map((cell, cIdx) =>
      rIdx === hiddenRow && cIdx === hiddenCol ? "?" : cell
    )
  );

  return {
    displayGrid, // المصفوفة التي ستظهر للمستخدم
    actualGrid: grid, // المصفوفة كاملة للتحقق (اختياري)
    answer,
    metadata: { level, step, base, size }, // معلومات مفيدة للتطوير
  };
}
