window.POLOZKOV.TEXT_INFO = {
    TEXT_PRE: "Сгибая лишь сгибы, сложите без горок имя ",
    TEXT_KVANTIK: "Сгибая лишь сгибы, сложите без горок название журнала «Квантик». Сайт: kvantik.com"
};

window.POLOZKOV.TEXT_INFO.f_replace_letters = function(str, replacementMap) {
    // Меняет букву, если она есть в списке, иначе оставляет прежней
    return str.split('').map(char => replacementMap[char] || char).join('');
};

window.POLOZKOV.TEXT_INFO.f_create_map = function(str1, str2) {
    const map = {};
    for (let i = 0; i < str1.length; i++) {
      map[str1[i]] = str2[i];
    }
    return map;
  }

window.POLOZKOV.TEXT_INFO.f_replace_names = function (str, name_a, name_b) {
    replacementMap = window.POLOZKOV.TEXT_INFO.f_create_map(name_a, name_b);
    return window.POLOZKOV.TEXT_INFO.f_replace_letters(str, replacementMap);
};

