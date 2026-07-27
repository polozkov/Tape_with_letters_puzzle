window.POLOZKOV = {
    // три svg элемента ([0] лицевая сторона с сеткой и буквами, [1] оборотная только с буквами и [2] проста сетка)
    SVG_ARRAY: [0, 1].map(i => document.getElementById("id_svg_" + i)),
    // NameSpace = пространство имён для SVG
    SVG_NS: "http://www.w3.org/2000/svg",

    // элементы страницы за исключением SVG (кнопки и инпуты)
    EL: {},
    
    // настройки внешнего вида: шрифт, цвет, размеры листа
    VIEW_STYLES: {},
    // в какую клетку какую букву писать
    TEXT_INFO: {},

    // генерация текста - на будущее (TODO перебор всех 3**13 сгибов)
    TEXT_GEN: {},
    // матрицы трансформации для SVG
    M: {},
    // рисование SVG элементов
    DRAW: {},
};

window.POLOZKOV.VIEW_STYLES = {
    FONT_FAMILY: "Ubuntu, sans-serif",
    FONT_WEIGHT_LETTERS: 900,
    FONT_WEIGHT_INFO: 500,
    
    FILL_TEXT_LETTERS: "#666",
    FILL_TEXT_INFO: "#000",
    STROKE_RECT: "#999",
    STROKE_WIDTH_RECT: 0.4,

    PAGE_WIDTH: 210,
    PAGE_HEIGHT: 297,
    PAGE_CXY: ({ x: 210 / 2, y: 297 / 2 }),

    // сколько полосок (по короткой стороне) - полоски идут вниз вдоль длинной стороны - под 90 градусов
    MATRIX_ROWS: 6,
    MATRIX_ROW_LEN: 14,
    SPACES: " ".repeat(14),
    // ширина полоски (при том, что MATRIX_ROWS укладывается по короткой стороне листа)
    CELL_WIDTH: 33,
    CELL_HEIGHT: 20,
    // сколько срезать с ячейки (если смотреть на буквы, развёрнутую в положение для чтения)
    GAP_RL_U_D: [0.5, 0.5, 7, 1],
    // сколько срезать для получения текстовой строки (развёрнутую в положение для чтения с длинной с информацией)
    GAP_TEXT_INFO_RL_U_D: [2, 2, 0.5, 33 - 7],
};
