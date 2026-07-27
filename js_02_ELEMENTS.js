let ИНФО_1 = "Сгибая лишь сгибы, сложите без горок имя «Сергей».";
let ИНФО_2 = "Сгибая лишь сгибы, сложите без горок имя «Костя».";

let ИМЯ_1 = ['еРГСГЙГСЕЙРЕСЕ', 'сЕЙГРРГСЕЕРГЙЕ'];
let ИМЯ_2 = ['сОЯЯОЯОЯССТЯЯТ', 'тОЯОССЯТОСЯОЯТ'];

let f_rev_last = s01 => [s01[0], s01[1].split("").reverse().join("")];
let И1 = f_rev_last(ИМЯ_1);
let И2 = f_rev_last(ИМЯ_2);

window.POLOZKOV.TEXT_INFO.ARR_TEXT_INFO_ROWS = [ИНФО_1, ИНФО_1, ИНФО_1, ИНФО_1, ИНФО_2, ИНФО_2];
window.POLOZKOV.TEXT_INFO.ARR_TEXT_6_PAIRS = [...И1, ...И1, ...И1, ...И1, ...И2, ...И2];

window.POLOZKOV.EL = {
    INPUT_INFO_ARRAY: [0, 1, 2, 3, 4, 5].map(i => document.getElementById("id_info_" + (i+1))),
    INPUT_TASK_ARRAY: [0, 1, 2, 3, 4, 5].map(i => document.getElementById("id_task_" + (i+1))),
    INPUT_USING_INDEXES: document.getElementById("id_indexes"),
    BUTTON_REDRAW: document.getElementById("id_button_redraw"),
    BUTTON_PRINT: document.getElementById("id_button_print"),
};

window.POLOZKOV.EL.f_strings_and_not_reversed_strings = function(s6) {
    let arr_6_2 = [];
    console.log(s6);
    for (let i = 0; i < 6; i++) {
        
        let s01 = s6[i].split(";");
        arr_6_2.push(s01[0]);
        arr_6_2.push(s01[1].split('').reverse().join(''));
    };
    return arr_6_2;
};

window.POLOZKOV.EL.f_renew = function() {
    let arr_6_info = [0, 1, 2, 3, 4, 5].map(i => window.POLOZKOV.EL.INPUT_INFO_ARRAY[i].value);
    let arr_6_task = [0, 1, 2, 3, 4, 5].map(i => window.POLOZKOV.EL.INPUT_TASK_ARRAY[i].value);
    let str_6 = window.POLOZKOV.EL.INPUT_USING_INDEXES.value;

    let arr_6_info_final = [0, 1, 2, 3, 4, 5].map(i => "");
    let arr_6_task_final = [0, 1, 2, 3, 4, 5].map(i => " ".repeat(window.POLOZKOV.VIEW_STYLES.MATRIX_ROW_LEN));

    // debugger;

    let SPACES =  " ".repeat(window.POLOZKOV.VIEW_STYLES.MATRIX_ROW_LEN);
    for (let i = 0; i < 6; i++) {
        let n_1_6 = (+str_6[i]);
        //если ноль или не определено
        if (!n_1_6) {
            arr_6_info_final[i] = "";
            arr_6_task_final[i] = SPACES + ";" + SPACES;
            continue;
        }
        if ((1 <= n_1_6) && (n_1_6 <= 6)) {
            arr_6_info_final[i] = arr_6_info[n_1_6 - 1];
            arr_6_task_final[i] = arr_6_task[n_1_6 - 1];
            continue
        }
        arr_6_info_final[i] = "";
        arr_6_task_final[i] = SPACES + ";" + SPACES;
    };

    // debugger

    for (let i = 0; i < 6; i++) {
        window.POLOZKOV.TEXT_INFO.ARR_TEXT_INFO_ROWS[i] = arr_6_info_final[i];
    }
    console.log(arr_6_task_final);
    window.POLOZKOV.TEXT_INFO.ARR_TEXT_6_PAIRS = window.POLOZKOV.EL.f_strings_and_not_reversed_strings(arr_6_task_final);
};