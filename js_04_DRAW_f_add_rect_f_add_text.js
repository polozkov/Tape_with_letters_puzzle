// Нарисуй прямоугольник по координатам угла, ширине и высоте
window.POLOZKOV.DRAW.f_add_rect = function(SVG_EL, x, y, width, height) {
    const rect = document.createElementNS(window.POLOZKOV.SVG_NS, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    // заливка "fill" и обводка "stroke"
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", window.POLOZKOV.VIEW_STYLES.STROKE_RECT);

    rect.setAttribute("stroke-width", window.POLOZKOV.VIEW_STYLES.STROKE_WIDTH_RECT);
    SVG_EL.appendChild(rect);
};

window.POLOZKOV.DRAW.f_text_id = (i_page, i6, i14, is_info) => is_info ?
    ('id_' + (i_page+1) + '_' + (i6+1) + '_' + 'INFO') :
    ('id_' + (i_page+1) + '_' + (i6+1) + '_' + (i14+1));

window.POLOZKOV.DRAW.text_transforms = {};

window.POLOZKOV.DRAW.f_calculate_text_transforms = function() {
    let text_transform_matrixes = {};
    for (let key in window.POLOZKOV.DRAW.text_transforms) {
        if (window.POLOZKOV.DRAW.text_transforms.hasOwnProperty(key)) {
            let old = document.getElementById(key).getBBox();
            // новый обраничивающий контейнер
            let neu = window.POLOZKOV.DRAW.text_transforms[key];
            text_transform_matrixes[key] = window.POLOZKOV.M.f_matrix_to_new_rect(old, neu, neu.angle_0_90_180_270);
        }
      }
    for (let key in text_transform_matrixes) {
        if (text_transform_matrixes.hasOwnProperty(key)) {
            let m = text_transform_matrixes[key];
            let my_text = document.getElementById(key).innerHTML;
            if ((!my_text) || (my_text.trim() === "")) {
                m = [1,0,0,1,0,0];
            }
            document.getElementById(key).setAttribute("transform",`matrix(${m[0]} ${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]})`);
        }
    }
};

// добвавь svg-элемент "текст", который должен быть в рамке и повёрнут на нужный угол
window.POLOZKOV.DRAW.f_add_text = function(SVG_EL, x, y, width, height, my_text, angle_0_90_180_270, FILL_TEXT, FONT_WEIGHT, my_id) {
    // если текст пустая строка, или не строка, или пробел, то ничего не делай
    //if ((!my_text) || (my_text.trim() === "")) {return; };

    let text = document.createElementNS(window.POLOZKOV.SVG_NS, "text");
    text.setAttribute("x", 0);
    text.setAttribute("y", 0);
    // разме шрифта - любой ненулевой (потом всё равно повернут, растянут и сдвинут)
    text.setAttribute("font-size","42");

    text.setAttribute("font-family", window.POLOZKOV.VIEW_STYLES.FONT_FAMILY);

    text.setAttribute("font-weight", FONT_WEIGHT);
    text.setAttribute("fill", FILL_TEXT);
    text.setAttribute("id", my_id);
    text.textContent = my_text;

    SVG_EL.appendChild(text);
    if ((!my_text) || (my_text.trim() === "")) {
        window.POLOZKOV.DRAW.text_transforms[my_id] = ({x:0, y:0, width:1, height:1, angle_0_90_180_270: 0});
    } else {
        window.POLOZKOV.DRAW.text_transforms[my_id] = ({x:x, y:y, width:width, height:height, angle_0_90_180_270: angle_0_90_180_270});
    }
};