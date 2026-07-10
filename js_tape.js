// три svg элемента ([0] лицевая сторона с сеткой и буквами, [1] оборотная только с буквами и [2] проста сетка)
let SVG_ARRAY = [0,1,2].map(i => document.getElementById("id_svg_" + i));
// NameSpace = пространство имён для SVG
const SVG_NS = "http://www.w3.org/2000/svg";

const CONST_FONT_FAMILY = "Ubuntu, sans-serif";

const CONST_FONT_WEIGHT_LETTERS = 900;
const CONST_FONT_WEIGHT_INFO = 500;

const COLOR_FILL_TEXT_LETTERS = "#666";
const COLOR_FILL_TEXT_INFO = "#000";

const COLOR_STROKE_RECT = "#999";

// ширина страницы
const PAGE_WIDTH = 210;
// высота страницы
const PAGE_HEIGHT = 297;
// центр страницы
const PAGE_CXY = ({x: PAGE_WIDTH / 2, y: PAGE_HEIGHT / 2});

// сколько полосок (по короткой стороне) - полоски идут вниз вдоль длинной стороны - под 90 градусов
const MATRIX_ROWS = 6;
// ширина полоски (при том, что MATRIX_ROWS укладывается по короткой стороне листа)
const CELL_WIDTH = 33;

// количество букв в каждой полоски
const MATRIX_ROW_LEN = 14;
const SPACES = " ".repeat(MATRIX_ROW_LEN);
// размер клетки (при том, что число букв MATRIX_ROW_LEN укладывается по длинной стороне листа)
const CELL_HEIGHT = 20;
// сколько срезать с ячейки (если смотреть на буквы, развёрнутую в положение для чтения)
const GAP_RL_U_D = [0.5, 0.5, 7, 1];
// сколько срезать для получения текстовой строки (длинной с информацией)
const GAP_TEXT_INFO_RL_U_D = [2, 2, 0.5, 33 - 7];

const TEXT_PRE = "Сгибая лишь сгибы, сложите без горок имя ";
const ARR_TEXT_INFO_ROWS = [
TEXT_PRE + '«МИХАИЛ».',
TEXT_PRE + '«СЕРГЕЙ».',
TEXT_PRE + '«МАКСИМ».',
TEXT_PRE + '«ВАЛЯ».',
'Сгибая лишь сгибы, сложите без горок слово «КВАНТИК». Сайт журнала:  kvantik.com',
'',
];

const ARR_TEXT_6_PAIRS = [
'ИЛИАМИЛХМАЛХАИ',
'ЛИМХААХЛИИАХМИ',

'ЕСЕРЙЕСГЙГСГРЕ',
'СЕЙГРРГСЕЕРГЙЕ',

'МСМСИКИИМААМСК',
'ИКСКАССККМАМАА',

'АВВАВЛЯВЯАВЛАЯ',
'АЯАВВЛЛЯАВАЛАЯ',

'ВККВААННТКИКИТ',
'КИКТНАТНИАКИВК',
 
SPACES,
SPACES,
];

// 1. Поворот вокруг центра
const f_m_rotate = (COS, SIN, cx, cy) => [COS, SIN, -SIN, COS, cx - COS * cx + SIN * cy, cy - SIN * cx - COS * cy];
// 2. Масштабирование вокруг центра
const f_m_scale = (nx, ny, cx, cy) => [nx, 0, 0, ny, cx * (1 - nx), cy * (1 - ny)];
// 3. Сдвиг
const f_m_translate = (x_translate, y_translate) => [1, 0, 0, 1, x_translate, y_translate];
// 4. Перемножение матриц (сначала A, затем B).
// Но сначала выполняется трансформация B, потом A (о в оьратном порядке).
const f_m_multiply = (A, B) => [
    A[0] * B[0] + A[2] * B[1],
    A[1] * B[0] + A[3] * B[1],
    A[0] * B[2] + A[2] * B[3],
    A[1] * B[2] + A[3] * B[3],
    A[0] * B[4] + A[2] * B[5] + A[4],
    A[1] * B[4] + A[3] * B[5] + A[5]
];

// Нарисуй прямоугольник по координатам угла, ширине и высоте
function f_add_rect(SVG_EL, x, y, width, height) {
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    // заливка "fill" и обводка "stroke"
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", COLOR_STROKE_RECT);

    rect.setAttribute("stroke-width", "0.4");
    SVG_EL.appendChild(rect);
};

// Получи матрицу трансформации, которая переводит старую область прямоугольника в новую (угол кратен 90)
function f_matrix_to_new_rect(old, neu, angle_0_90_180_270) {
    // Центр BounddBox - ограничивающего контейнера
    const f_bb_center = bb => ({x: bb.x + bb.width * 0.5, y: bb.y + bb.height * 0.5});
    // В старой области такой старый центр (обе координаты)
    const OLD_X = f_bb_center(old).x, OLD_Y = f_bb_center(old).y;
    // Синус и косинус угла поворота - так как кратен 90, то итог -1,0,+1 (целый)
    const COS = Math.round(Math.cos(angle_0_90_180_270 * Math.PI / 180));
    const SIN = Math.round(Math.sin(angle_0_90_180_270 * Math.PI / 180));
    // Матрица угла поворота (первая трансформация)
    const m_rot = f_m_rotate(COS, SIN, OLD_X, OLD_Y);

    // старые размеры после полворота (если 90 или 270, то ширина и высота меняются между собой)
    const old_wh = ((angle_0_90_180_270 % 180) === 0) ? [old.width, old.height] : [old.height, old.width];
    // Матрица масштабирования относительно старого центра
    const m_scale = f_m_scale(neu.width / old_wh[0], neu.height / old_wh[1], OLD_X, OLD_Y);

    // в конце - совмести центры - примени последнюю матрицу трасформации
    const m_translate = f_m_translate(f_bb_center(neu).x - OLD_X, f_bb_center(neu).y - OLD_Y);
    // трансформации в обратном порядка в отличии от умножения - применяй так: поворот, масштаб, сдвиг
    return f_m_multiply(m_translate, f_m_multiply(m_scale, m_rot));
  };

// добвавь svg-элемент "текст", который должен быть в рамке и повёрнут на нужный угол
function f_add_text(SVG_EL, x, y, width, height, my_text, angle_0_90_180_270, COLOR_FILL_TEXT, CONST_FONT_WEIGHT) {
    // если текст пустая строка, или не строка, или пробел, то ничего не делай
    if ((!my_text) || (my_text === " ")) {return; };

    let text = document.createElementNS(SVG_NS, "text");
    text.setAttribute("x", 0);
    text.setAttribute("y", 0);
    // разме шрифта - любой ненулевой (потом всё равно повернут, растянут и сдвинут)
    text.setAttribute("font-size","42");

    text.setAttribute("font-family", CONST_FONT_FAMILY);

    text.setAttribute("font-weight", CONST_FONT_WEIGHT);
    text.setAttribute("fill", COLOR_FILL_TEXT);

    text.textContent = my_text;
    SVG_EL.appendChild(text);

    // трансформируй так, чтобы оказался в нужном прямоугольнике (и повёрнутым)
    let old = text.getBBox();
    // новый обраничивающий контейнер
    let neu = ({x:x, y:y, width:width, height:height});
    // матрица трансформации, совмещающая два контрейнера - с нужным поворотом, кратным 90
    let m = f_matrix_to_new_rect(old, neu, angle_0_90_180_270);
    text.setAttribute("transform",`matrix(${m[0]} ${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]})`);
};

// добавь сетку с текстом под углом со строками информации
// заранее известны: GAP_RL_U_D, GAP_TEXT_INFO_RL_U_D, MATRIX_ROWS, MATRIX_ROW_LEN, CELL_WIDTH, CELL_HEIGHT, PAGE_CXY
function f_add_grid(SVG_EL, flag_rect, TEXT_MATRIX, angle_0_90_180_270, TEXT_INFO_ROWS) {
    // левый верхний угол таблицы (начальная клетка - её угол)
    const ZERO_X = PAGE_CXY.x - CELL_WIDTH * MATRIX_ROWS * 0.5;
    const ZERO_Y = PAGE_CXY.y - CELL_HEIGHT * MATRIX_ROW_LEN * 0.5;
    // левый верхний угол ячейки с данными индексами в таблице
    let f_xy = (ix=0, iy=0) => ({x: ZERO_X + CELL_WIDTH * ix, y: ZERO_Y + CELL_HEIGHT * iy});

    // GAP_RL_U_D - верх или низ надо срезать (при повороте на 90 - срезай Down, иначе срезай Up)
    const FRAG_90 = (angle_0_90_180_270 === 90)
    const n_top_low = FRAG_90 ? 3 : 2;

    // рисуй все ячеки таблицы
    for (let iy = 0; iy < MATRIX_ROW_LEN; iy++)
        for (let ix = 0; ix < MATRIX_ROWS; ix++) {
            // координаты текущего ограничивающего контейнера (либо срезаннного для текста) (либо всей полоски с информацией)
            let f_i_xy_wh = (g4 = GAP_RL_U_D, is_info_long_strip = false) => [
                f_xy(ix,iy).x + g4[n_top_low],
                f_xy(ix, (is_info_long_strip ? 0 : iy)).y + g4[0],
                CELL_WIDTH - g4[2] - g4[3],
                CELL_HEIGHT * (is_info_long_strip ? MATRIX_ROW_LEN : 1) - g4[0] - g4[1]
            ];
           
            // срезай по нулям со всех сторон - это прямоугольник (они вплотную друг к другу)
            if (flag_rect) {f_add_rect(SVG_EL, ...f_i_xy_wh([0,0,0,0])); };

            // добавь текст с полями - проверь, что символ не null
            f_add_text(SVG_EL, ...f_i_xy_wh(), TEXT_MATRIX[ix][iy], angle_0_90_180_270, COLOR_FILL_TEXT_LETTERS, CONST_FONT_WEIGHT_LETTERS);

            // строку с информацией пиши в конце;
            if ((TEXT_INFO_ROWS) && (iy === (MATRIX_ROW_LEN-1))) {
                // f_i_xy_wh вычисляет область (длинный прямоцугольник) для текстовой строки по всей полоски
                let i_xy_wh = f_i_xy_wh(GAP_TEXT_INFO_RL_U_D, true);
                f_add_text(SVG_EL, ...i_xy_wh, TEXT_INFO_ROWS[ix], angle_0_90_180_270, COLOR_FILL_TEXT_INFO, CONST_FONT_WEIGHT_INFO);
            };
        };
};

// рисуй три таблицы в svg
function f_add_matrixes() {
    // текст - как пустая таблица, вся из отдельных пробелов (двумерный массив)
    let TEXT_I_J = [...Array(MATRIX_ROWS)].map(() => [...Array(MATRIX_ROW_LEN)].map(() => " "));

    let f_char = (i, j, m = ARR_TEXT_6_PAIRS) => m[i][j];
    // функции, заполняющие одну ячеку в таблице - для вложенного цикла 
    function f0_text_i_j(i,j) {TEXT_I_J[i][j] = f_char(i*2, j);};
    function f1_text_i_j(i,j) {TEXT_I_J[MATRIX_ROWS - 1 - i][j] = f_char(i*2 + 1, j);};
    function f2_text_i_j(i,j) {TEXT_I_J[i][j] = " ";};

    // заполни все клетки таблицы, а потом - отрисуй таблицу с текстом и прямоугольниками
    function f_set_svg(INDEX_SVG, flag_rect, deg_rotate, f_set_text, TEXT_INFO_ROWS) {
        for (let i = 0; i < MATRIX_ROWS; i++)
            for (let j = 0; j < MATRIX_ROW_LEN; j++)
                f_set_text(i, j);
        // в svg элемент с данным номером добавь: ячейки (если есть флаг прямоугольников) + текст с поворотом 90 или 270
        f_add_grid(SVG_ARRAY[INDEX_SVG], flag_rect, TEXT_I_J, deg_rotate, TEXT_INFO_ROWS);
    }

    f_set_svg(0, true, 90, f0_text_i_j, null);
    f_set_svg(1, true, 270, f1_text_i_j, ARR_TEXT_INFO_ROWS.reverse());
    f_set_svg(2, true, 0, f2_text_i_j, null);
};

// отрисуй все три страницы
f_add_matrixes();