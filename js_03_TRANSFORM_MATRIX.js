//работа с матрицами трансформации для SVG
//матрица записывается как массив 6 чисел 

// 1. Поворот вокруг центра
window.POLOZKOV.M.f_rotate = (COS, SIN, cx, cy) => [COS, SIN, -SIN, COS, cx - COS * cx + SIN * cy, cy - SIN * cx - COS * cy];

// 2. Масштабирование вокруг центра
window.POLOZKOV.M.f_scale = (nx, ny, cx, cy) => [nx, 0, 0, ny, cx * (1 - nx), cy * (1 - ny)];

// 3. Сдвиг
window.POLOZKOV.M.f_translate = (x_translate, y_translate) => [1, 0, 0, 1, x_translate, y_translate];

// 4. Перемножение матриц (сначала A, затем B).
// Но сначала выполняется трансформация B, потом A (о в обратном порядке).
window.POLOZKOV.M.f_multiply = (A, B) => [
    A[0] * B[0] + A[2] * B[1],
    A[1] * B[0] + A[3] * B[1],
    A[0] * B[2] + A[2] * B[3],
    A[1] * B[2] + A[3] * B[3],
    A[0] * B[4] + A[2] * B[5] + A[4],
    A[1] * B[4] + A[3] * B[5] + A[5]
];

// Получи матрицу трансформации, которая переводит старую область прямоугольника в новую (угол кратен 90)
window.POLOZKOV.M.f_matrix_to_new_rect = function(old, neu, angle_0_90_180_270) {
    // Центр BounddBox - ограничивающего контейнера
    const f_bb_center = bb => ({ x: bb.x + bb.width * 0.5, y: bb.y + bb.height * 0.5 });
    // В старой области такой старый центр (обе координаты)
    const OLD_X = f_bb_center(old).x, OLD_Y = f_bb_center(old).y;
    // Синус и косинус угла поворота - так как кратен 90, то итог -1,0,+1 (целый)
    const COS = Math.round(Math.cos(angle_0_90_180_270 * Math.PI / 180));
    const SIN = Math.round(Math.sin(angle_0_90_180_270 * Math.PI / 180));
    // Матрица угла поворота (первая трансформация)
    const m_rot = window.POLOZKOV.M.f_rotate(COS, SIN, OLD_X, OLD_Y);

    // старые размеры после полворота (если 90 или 270, то ширина и высота меняются между собой)
    const old_wh = ((angle_0_90_180_270 % 180) === 0) ? [old.width, old.height] : [old.height, old.width];
    // Матрица масштабирования относительно старого центра
    const m_scale = window.POLOZKOV.M.f_scale(neu.width / old_wh[0], neu.height / old_wh[1], OLD_X, OLD_Y);

    // в конце - совмести центры - примени последнюю матрицу трасформации
    const m_translate = window.POLOZKOV.M.f_translate(f_bb_center(neu).x - OLD_X, f_bb_center(neu).y - OLD_Y);
    // трансформации в обратном порядка в отличии от умножения - применяй так: поворот, масштаб, сдвиг
    return window.POLOZKOV.M.f_multiply(m_translate, window.POLOZKOV.M.f_multiply(m_scale, m_rot));
};