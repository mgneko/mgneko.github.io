// ===================================================================================
// gameData.js - 靜態圖鑑資料定義 + 福袋 JSON 動態載入
// ===================================================================================
import { appState } from './state.js';

export const Category = [
    'saber', 'archer', 'lancer', 'rider', 'caster', 'assassin', 'berserker',
    'ruler', 'avenger', 'alterego', 'foreigner', 'mooncancer', 'pretender', 'beast',
    'unbeast', 'shielder', 'luckybag1', 'luckybag2', 'luckybag3', 'luckybag4', 'luckybag5'
];
export const CategoryLen = Category.length;
export const Marks = ['hiclipart', 'heart'];

// 常駐伺服器模式的按鈕 id 是 `${key}-button`（例如 jp-button），
// 動態福袋按鈕的 id 則直接等於 key 本身。main.js / i18nHelper.js
// 都需要把 FGO_DATA 的 key 轉成對應的按鈕 id，統一收在這裡避免重複。
const BASE_MODE_KEYS = ['jp', 'tw', 'z'];
export function getModeButtonId(modeKey) {
    return BASE_MODE_KEYS.includes(modeKey) ? `${modeKey}-button` : modeKey;
}

// 統一管理職階圖片的魔法數字 (Magic Numbers)
export const CLASS_ICON_MAP = {
    SABER: 1, ARCHER: 2, LANCER: 3, RIDER: 4, CASTER: 5, ASSASSIN: 6, BERSERKER: 7,
    RULER: 8, AVENGER: 9, ALTEREGO: 10, FOREIGNER: 11, MOONCANCER: 12, PRETENDER: 13,
    BEAST: 14, UNBEAST: 15, SHIELDER: 19,
    SIXTH: 666, ALL: 1001, EXTRA: 1002,
    EXTRAI: 1004, EXTRAII: 1005, QUESTION: 99, EIGHTH: 888
};

export const servents = {
    'saber': [2, 8, 68, 76, 90, 91, 153, 160, 213, 234, 270, 278, 299, 302, 317, 337, 343, 384, 402, 432, 445, 456, 461, 466],
    'archer': [12, 60, 77, 84, 129, 142, 156, 212, 216, 272, 276, 350, 375, 383, 394, 427, 450, 470],
    'lancer': [70, 85, 88, 119, 128, 143, 196, 232, 280, 300, 312, 329, 368, 381, 433, 442, 457, 465],
    'rider': [65, 99, 108, 118, 144, 179, 205, 206, 241, 253, 274, 277, 296, 331, 342, 349, 397, 406, 452, 478],
    'caster': [37, 62, 113, 127, 136, 150, 169, 175, 201, 215, 237, 284, 307, 327, 385, 415, 435, 462, 467],
    'assassin': [75, 86, 112, 139, 154, 189, 199, 235, 239, 314, 365, 371, 380, 453, 474],
    'berserker': [51, 52, 97, 98, 114, 155, 161, 226, 247, 261, 306, 309, 355, 362, 386, 429, 440, 475],
    'ruler': [59, 93, 173, 229, 265, 292, 305, 346, 357, 374, 390, 400, 438],
    'avenger': [96, 106, 250, 268, 303, 321, 370, 403, 407, 409, 469, 479],
    'alterego': [163, 167, 209, 224, 238, 297, 336, 339, 369, 376, 416, 426, 471],
    'foreigner': [195, 198, 275, 281, 289, 295, 324, 334, 373, 393, 413],
    'mooncancer': [220, 244, 285, 351, 418, 421, 448, 476],
    'pretender': [316, 353, 431, 437, 441, 459],
    'beast': [377, 417],
    'unbeast': [444],
    'shielder': []
};

export const z_servants = {
    saber: [8, 2, 76, 278],
    archer: [84, 60, 212, 77, 350],
    lancer: [143, 85, 232, 119, 300],
    rider: [206, 274, 118, 65, 144, 99, 277, 331, 296],
    caster: [201, 113, 169, 37, 62],
    assassin: [189, 75, 235, 380],
    berserker: [52, 226, 97, 98, 306],
    ruler: [59],
    avenger: [370],
    alterego: [224],
    mooncancer: [244]
};

// 福袋資料會在 loadLuckyBagData 時動態塞入
export const FGO_DATA = {
    'jp': { servants: servents, type: 'full', isReleased: true, labelKey: 'jp_label' },
    'tw': {
        servants: servents, type: 'full', isReleased: true,
        //                    劍, 弓, 槍,  騎, 術, 殺, 狂, 裁, 仇,  丑, 外, 月,偽,獸,非獸
        categoryNumOverride: [19, 16, 14, 18, 16, 13, 16, 12, 10, 12, 11, 6, 3, 2],
        labelKey: 'tw_label'
    },
    'z': { servants: z_servants, type: 'partial', isReleased: true, labelKey: 'z_label' }
};

// 載入福袋 JSON 資料並動態生成 DOM
export async function loadLuckyBagData() {
    try {
        const response = await fetch('luckybag.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error('無法載入 luckybag.json: ' + response.statusText);

        const luckyBags = await response.json();
        const gssrContainer = document.getElementById('gssr-container');
        const baseTwBtn = document.getElementById('base-tw-btn'); // 插入基準點

        Object.keys(luckyBags).forEach(key => {
            // 跳過底線開頭的 key（例如 _README_CLASS_ICONS），這類 key 只是給人看的說明資料，不是真正的福袋
            if (key.startsWith('_')) return;

            const bag = luckyBags[key];

            // 寫入全域資料
            FGO_DATA[key] = {
                servants: bag.servants,
                type: 'luckyBag',
                isReleased: bag.isReleased,
                classIconImg: bag.classIconImg,
                label: bag.label
            };

            // 動態生成 HTML
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.id = key;
            a.className = "btn btn--primary btn--round";
            a.href = "javascript:void(0);";
            a.innerText = bag.label[appState.currentLang] || bag.label['zh-TW'];
            li.appendChild(a);

            // 插入到台版/日版/自選 按鈕之前
            gssrContainer.insertBefore(li, baseTwBtn);
        });
        console.log("福袋資料載入成功並動態建立完成！");
    } catch (error) {
        console.error("載入福袋資料失敗:", error);
    }
}
