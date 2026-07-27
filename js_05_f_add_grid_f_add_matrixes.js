// добавь сетку с текстом под углом со строками информации
// заранее известны: GAP_RL_U_D, GAP_TEXT_INFO_RL_U_D, MATRIX_ROWS, MATRIX_ROW_LEN, CELL_WIDTH, CELL_HEIGHT, PAGE_CXY
function f_add_grid(INDEX_SVG, flag_rect, TEXT_MATRIX, angle_0_90_180_270, TEXT_INFO_ROWS) {
    const S = window.POLOZKOV.VIEW_STYLES;
    // левый верхний угол таблицы (начальная клетка - её угол)
    const ZERO_X = S.PAGE_CXY.x - S.CELL_WIDTH * S.MATRIX_ROWS * 0.5;
    const ZERO_Y = S.PAGE_CXY.y - S.CELL_HEIGHT * S.MATRIX_ROW_LEN * 0.5;
    
    // левый верхний угол ячейки с данными индексами в таблице
    let f_xy = (ix=0, iy=0) => ({x: ZERO_X + S.CELL_WIDTH * ix, y: ZERO_Y + S.CELL_HEIGHT * iy});

    // GAP_RL_U_D - верх или низ надо срезать (при повороте на 90 - срезай Down, иначе срезай Up)
    const FRAG_90 = (angle_0_90_180_270 === 90)
    const n_top_low = FRAG_90 ? 3 : 2;

    // рисуй все ячеки таблицы
    for (let iy = 0; iy < S.MATRIX_ROW_LEN; iy++)
        for (let ix = 0; ix < S.MATRIX_ROWS; ix++) {
            // координаты текущего ограничивающего контейнера (либо срезаннного для текста) (либо всей полоски с информацией)
            function f_i_xy_wh(g4 = S.GAP_RL_U_D, is_info_long_strip = false, ix_row = 0) {
                // право и лево могут меняться местами, поэтому ориентация определена заранее
                let my_x = f_xy(ix, iy).x + g4[n_top_low];
                let my_y = f_xy(ix, iy).y + g4[0];
                
                let my_width = S.CELL_WIDTH - g4[2] - g4[3];
                let my_height = S.CELL_HEIGHT - g4[0] - g4[1];
                
                if (is_info_long_strip) {
                    let n_chars = TEXT_MATRIX[ix_row].join("").trim().length
                    my_height = S.CELL_HEIGHT * n_chars - g4[0] - g4[1];
                    
                    my_ny = (TEXT_MATRIX[ix_row].length - n_chars) * 0.5;
                    // правая сторона информации для чтения будет сверху, поэтому GAP_RL_U_D[0]
                    my_y = f_xy(ix, my_ny).y + g4[0];
                }
                return [my_x, my_y, my_width, my_height];
            };
           
            // срезай по нулям со всех сторон - это прямоугольник (они вплотную друг к другу)
            if (flag_rect) {window.POLOZKOV.DRAW.f_add_rect(window.POLOZKOV.SVG_ARRAY[INDEX_SVG], ...f_i_xy_wh([0,0,0,0])); };

            // добавь текст с полями - проверь, что символ не null
            let letter_id = window.POLOZKOV.DRAW.f_text_id(INDEX_SVG, ix, iy, false);
            window.POLOZKOV.DRAW.f_add_text(window.POLOZKOV.SVG_ARRAY[INDEX_SVG], ...f_i_xy_wh(), TEXT_MATRIX[ix][iy],
                                            angle_0_90_180_270, S.FILL_TEXT_LETTERS, S.FONT_WEIGHT_LETTERS, letter_id);

            // строку с информацией пиши в конце;
            if ((TEXT_INFO_ROWS) && (iy === (S.MATRIX_ROW_LEN-1))) {
                // f_i_xy_wh вычисляет область (длинный прямоцугольник) для текстовой строки по всей полоски
                let i_xy_wh = f_i_xy_wh(S.GAP_TEXT_INFO_RL_U_D, true, ix);
                let info_id = window.POLOZKOV.DRAW.f_text_id(INDEX_SVG, ix, iy, true);
                window.POLOZKOV.DRAW.f_add_text(window.POLOZKOV.SVG_ARRAY[INDEX_SVG], ...i_xy_wh, TEXT_INFO_ROWS[ix], 
                                                angle_0_90_180_270, S.FILL_TEXT_INFO, S.FONT_WEIGHT_INFO, info_id);
            };
        };
};

// рисуй три таблицы в svg
function f_add_matrixes() {
    const S = window.POLOZKOV.VIEW_STYLES;
    let f_char = (i, j, m = window.POLOZKOV.TEXT_INFO.ARR_TEXT_6_PAIRS) => m[i][j];
    // функции, заполняющие одну ячеку в таблице - для вложенного цикла 
    
    function f_m_ij(i_set_text) {
        // текст - как пустая таблица, вся из отдельных пробелов (двумерный массив)
        let TEXT_I_J = [...Array(S.MATRIX_ROWS)].map(() => [...Array(S.MATRIX_ROW_LEN)].map(() => " "));
        for (let i = 0; i < S.MATRIX_ROWS; i++)
            for (let j = 0; j < S.MATRIX_ROW_LEN; j++)
                switch (i_set_text) {
                    case 0: TEXT_I_J[i][j] = f_char(i*2, j); break;
                    case 1: TEXT_I_J[S.MATRIX_ROWS - 1 - i][j] = f_char(i*2 + 1, j); break;
                    case 2: TEXT_I_J[i][j] = " "; break;
                }
        return TEXT_I_J;
    }
    
    function f_set_svg(INDEX_SVG, flag_rect, deg_rotate, i_set_text, TEXT_INFO_ROWS) {
        f_add_grid(INDEX_SVG, flag_rect, f_m_ij(i_set_text), deg_rotate, TEXT_INFO_ROWS)
    }

    f_set_svg(0, true, 90, 0, null);
    f_set_svg(1, false, 270, 1, window.POLOZKOV.TEXT_INFO.ARR_TEXT_INFO_ROWS.reverse());
    f_set_svg(2, true, 0, 2, null);

    window.POLOZKOV.DRAW.f_calculate_text_transforms();
};

//console.time("Время выполнения");
f_add_matrixes(); // отрисуй все три страницы
//console.timeEnd("Время выполнения");