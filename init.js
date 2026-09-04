// ===================================================================================
// 0. 儲存與帳號管理 (原 fgoStorage.js)
// ===================================================================================
const FGO_STORAGE = "FGO_Storage";
const ACCOUNT_KEY = "FGO_Account";

function toggleAccount() {
    const currentAccount = localStorage.getItem(ACCOUNT_KEY) || "account1";
    const newAccount = currentAccount === "account1" ? "account2" : "account1";
    localStorage.setItem(ACCOUNT_KEY, newAccount);
    console.log(`Account switched to: ${newAccount}`);
}
function getCurrentAccount() { return localStorage.getItem(ACCOUNT_KEY) || "account1"; }
function getData(name) { const acc = getCurrentAccount(); const item = localStorage.getItem(`${name}_${acc}`); return item ? JSON.parse(item) : []; }
function setData(name, content) { const acc = getCurrentAccount(); if (content) localStorage.setItem(`${name}_${acc}`, JSON.stringify(content)); }
function deleteData(name) { const acc = getCurrentAccount(); localStorage.removeItem(`${name}_${acc}`); }
function migrateOldData() { const oldData = localStorage.getItem(FGO_STORAGE); if (oldData && !localStorage.getItem(`${FGO_STORAGE}_account1`)) { localStorage.setItem(`${FGO_STORAGE}_account1`, oldData); console.log("舊資料已成功遷移到帳號1"); } }

// ===================================================================================
// 1. 全域變數與資料定義
// ===================================================================================
var canvas, context;
var CELL_SIZE = 50, caculateField = 70, row_padding = 30, col_padding = 20;
var marginTop = 10, marginLeft = 10;
const FOOTER_HEIGHT = 50;
var country = localStorage.getItem("r_country") || "jp";
var currentLang = getLanguage();
var mode = 0, luckyBag = 0;
var CategoryNum;
var bgcolor = "rgb(176, 176, 176)", mask = "rgb(0, 0, 0, 0.6)", font_color = "rgb(0, 0, 0)";
var init_npLv = 6, npLv = init_npLv;

const Category = ['saber', 'archer', 'lancer', 'rider', 'caster', 'assassin', 'berserker',
				  'ruler', 'avenger', 'alterego', 'foreigner', 'mooncancer', 'pretender', 'beast',
                  'unbeast', 'shielder', 'luckybag1', 'luckybag2', 'luckybag3', 'luckybag4', 'luckybag5'];
const CategoryLen = Category.length;
const Marks = ['hiclipart', 'heart'];

// 統一管理職階圖片的魔法數字 (Magic Numbers)
const CLASS_ICON_MAP = {
    SABER: 1, ARCHER: 2, LANCER: 3, RIDER: 4, CASTER: 5, ASSASSIN: 6, BERSERKER: 7,
    RULER: 8, AVENGER: 9, ALTEREGO: 10, FOREIGNER: 11, MOONCANCER: 12, PRETENDER: 13,
    BEAST: 14, UNBEAST: 15, SHIELDER: 19,
    SIXTH: 666, ALL: 1001, EXTRA: 1002,
    EXTRAI: 1004, EXTRAII: 1005, QUESTION: 99, EIGHTH: 888
};

const servents = {'saber': [2, 8, 68, 76, 90, 91, 153, 160, 213, 234, 270, 278, 299, 302, 317, 337, 343, 384, 402, 432, 445, 456, 461, 466],
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
				'unbeast':[444],
				'shielder': []};
const z_servants = {saber:[8, 2, 76, 278], archer:[84, 60, 212, 77, 350], lancer:[143, 85, 232, 119, 300], rider:[206, 274, 118, 65, 144, 99, 277, 331, 296], caster:[201, 113, 169, 37, 62], assassin:[189, 75, 235, 380], berserker:[52, 226, 97, 98, 306], ruler:[59], avenger:[370], alterego:[224], mooncancer:[244]};

// 福袋資料會在 loadLuckyBagData 時動態塞入
const FGO_DATA = {
    'jp': {servants: servents, type: 'full', isReleased: true, labelKey: 'jp_label'},
    'tw': {servants: servents, type: 'full', isReleased: true, categoryNumOverride: [19, 16, 14, 18, 16, 13, 16, 12, 10, 12, 11, 6, 3, 2], labelKey: 'tw_label'},
    'z': {servants: z_servants, type: 'partial', isReleased: true, labelKey: 'z_label'}
};

// ===================================================================================
// 1.5 狀態管理器 (解耦靜態資料與使用者狀態)
// ===================================================================================
let USER_STATE = new Map();

function loadUserState() {
    const data = getData(FGO_STORAGE);
    USER_STATE.clear();
    data.forEach(u => {
        USER_STATE.set(String(u.no), {
            npLv: u.npLv || 0,
            mark: u.mark || 0,
            lv120: u.lv120 || 0,
            crowned: u.crowned || 0
        });
    });
}

function saveUserState() {
    const arr = [];
    USER_STATE.forEach((state, no) => {
        if (state.npLv > 0 || state.mark > 0 || state.lv120 > 0 || state.crowned > 0) {
            arr.push({ no: String(no), ...state });
        }
    });
    setData(FGO_STORAGE, arr);
}

function getUnitState(no) {
    const key = String(no);
    if (!USER_STATE.has(key)) {
        USER_STATE.set(key, { npLv: 0, mark: 0, lv120: 0, crowned: 0 });
    }
    return USER_STATE.get(key);
}

// ===================================================================================
// 2. 核心邏輯區 (Core Logic)
// ===================================================================================

var units = [], svt = {}, categoryImages = [], markImages = [], allModeButtons = [];
var selectedClasses = new Set();

const ImagePreloader = {
    images: {},
    totalImages: 0,
    loadedImages: 0,
    init(callback) {
        const allServantNos = new Set();
        Object.values(FGO_DATA).forEach(data => {
            if (typeof data.servants === 'object') {
                Object.values(data.servants).forEach(noArray => {
                    noArray.forEach(no => allServantNos.add(no));
                });
            }
        });

        this.totalImages = allServantNos.size;
        if (this.totalImages === 0) {
            callback();
            return;
        }

        const loadingText = i18n.loadingImages[currentLang];
        this.updateProgress(loadingText);

        allServantNos.forEach(no => {
            const img = new Image();
            img.src = `images/servents/${no}.png`;
            this.images[no] = img;
            img.onload = img.onerror = () => {
                this.loadedImages++;
                this.updateProgress(loadingText);
                if (this.loadedImages === this.totalImages) {
                    callback();
                }
            };
        });
    },
    updateProgress(loadingText) {
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        const percentage = Math.round((this.loadedImages / this.totalImages) * 100);
        context.fillStyle = bgcolor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = font_color;
        context.font = getFontString(30);
        context.textAlign = "center";
        context.fillText(`${loadingText}${percentage}%`, canvas.width / 2, canvas.height / 2);
        context.textAlign = "start";
    }
};


function getUnit(country) {
    const currentData = FGO_DATA[country];
    if (!currentData || typeof currentData.servants !== 'object') {
         alert("資料載入錯誤或尚未完成，請稍後再試： " + country);
         return [];
    }
    const sourceServants = currentData.servants;
    CategoryNum = Category.map((className, index) => {
        if (currentData.categoryNumOverride) return currentData.categoryNumOverride[index] || 0;
        return sourceServants[className] ? sourceServants[className].length : 0;
    });

    let newUnits = [];
    for (let i = 0; i < CategoryLen; i++) {
        const className = Category[i];
        newUnits[i] = [];
        if (sourceServants[className] && CategoryNum[i] > 0) {
            for (let j = 0; j < CategoryNum[i]; j++) {
                const no = sourceServants[className][j];
                // 僅綁定靜態圖鑑資料，不再包含會變動的使用者狀態
                newUnits[i][j] = {
                    no: no,
                    image: ImagePreloader.images[no]
                };
            }
        }
    }
    return newUnits;
}

// 載入福袋 JSON 資料並動態生成 DOM
async function loadLuckyBagData() {
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
            a.innerText = bag.label[currentLang] || bag.label['zh-TW'];
            li.appendChild(a);

            // 插入到台版/日版/自選 按鈕之前
            gssrContainer.insertBefore(li, baseTwBtn);
        });
        console.log("福袋資料載入成功並動態建立完成！");
    } catch (error) {
        console.error("載入福袋資料失敗:", error);
    }
}

async function init() {
    preloadStaticImages(async () => {
        await loadLuckyBagData();
        ImagePreloader.init(() => {
            mainLogic();
        });
    });
}

function mainLogic(state = 0){
    if (state === 1) {
        selectedClasses.clear();
    }
    const currentCountryData = FGO_DATA[country];
    if (!currentCountryData || !currentCountryData.isReleased) {
        console.log(`Saved mode "${country}" is not available. Defaulting to "jp".`);
        country = 'jp';
        localStorage.setItem("r_country", 'jp');
    }

    // 取得靜態圖鑑與讀取狀態
    units = getUnit(country);
    if (!units) return;
    loadUserState();

    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    if (state === 0) {
        migrateOldData();
        Object.keys(FGO_DATA).forEach(modeKey => {
            const modeData = FGO_DATA[modeKey];
            const buttonId = ['jp', 'tw', 'z'].includes(modeKey) ? `${modeKey}-button` : modeKey;
            const button = document.getElementById(buttonId);
            if (button) {
                const listItem = button.parentElement;
                if (listItem) listItem.style.display = modeData.isReleased ? '' : 'none';

                allModeButtons.push(button);
                button.onclick = () => { if (country !== modeKey) { country = modeKey; localStorage.setItem("r_country", country); mainLogic(1); } };
            }
        });
        bindActionButtons();
        canvas.onclick = onCanvasClick;
        canvas.addEventListener('contextmenu', e => { e.preventDefault(); rightClick(e); });
    }

    const currentButtonId = ['jp', 'tw', 'z'].includes(country) ? `${country}-button` : country;
    const currentActiveButton = document.getElementById(currentButtonId);
    if (currentActiveButton) Checked(allModeButtons, currentActiveButton);

    const visibleRows = CategoryNum.filter(num => num > 0).length;
    const iconWidth = luckyBag ? (Math.max.apply(null,CategoryNum) + 1) * (CELL_SIZE + col_padding) + caculateField : (Math.max.apply(null,CategoryNum) + 1) * (CELL_SIZE + col_padding);
    const MIN_CANVAS_WIDTH = 850;
    canvas.width = Math.max(iconWidth, MIN_CANVAS_WIDTH);
    canvas.height = visibleRows * (CELL_SIZE + row_padding) + marginTop + FOOTER_HEIGHT;

    applyLanguage(currentLang);
    drawCanvas();
}

function drawCanvas() {
    context.fillStyle = bgcolor;
	context.fillRect (0, 0, canvas.width, canvas.height);

    const currentData = FGO_DATA[country];
    const classIconInfo = currentData.classIconImg;
    let pass = 0;
    for (let i = 0; i < CategoryLen; i++) {
        if (CategoryNum[i] > 0) {
            const yPos = i - pass;
            const rowTopY = yPos * (CELL_SIZE + row_padding) + marginTop;

            if (selectedClasses.has(i)) {
                context.fillStyle = 'rgba(255, 0, 0, 0.3)';
                const highlightX = marginLeft - col_padding / 2;
                const highlightY = rowTopY - (row_padding / 2) + 10;
                const highlightWidth = (CategoryNum[i] + 1) * (CELL_SIZE + col_padding);
                const highlightHeight = CELL_SIZE + row_padding;
                context.fillRect(highlightX, highlightY, highlightWidth, highlightHeight);
            }

            let imgIndex = i;
            if (classIconInfo) {
                let iconId = Array.isArray(classIconInfo) ? classIconInfo[i] : classIconInfo;
                const foundIndex = classes.indexOf(parseInt(iconId));
                if (foundIndex !== -1) imgIndex = foundIndex;
            }
            drawImage(0, yPos, categoryImages[imgIndex]);

            for (let j = 0; j < CategoryNum[i]; j++) {
                const unit = units[i][j];
                const state = getUnitState(unit.no);

                drawImage(j + 1, yPos, unit.image);

                if (!state.npLv) fillRect(j, yPos, mask);
                else fillNPText(j, yPos, `${i18n.npLevelPrefix[currentLang]}${state.npLv}`);

                const is120 = state.lv120;
                const isCrowned = state.crowned;
                if (is120 && isCrowned) {
                    drawUnitBorder(j + 1, yPos, "#39C5BB");
                } else if (is120) {
                    drawUnitBorder(j + 1, yPos, "#FFE211"); 
                } else if (isCrowned) {
                    drawUnitBorder(j + 1, yPos, "#0000FF"); 
                }

                if (state.mark) drawImage(j + 1, yPos, markImages[state.mark - 1]);
            }
        } else {
            pass++;
        }
    }
    fillTotalText();
    if (luckyBag) fillCaculate();
    context.font = getFontString(20);
	context.fillStyle = mask;
	context.fillText("This image was made by mgneko, maintained by LeafLu @ ptt", marginLeft, canvas.height - 15);
}

function updateModeButtons(activeIndex) {
    const modeButtons = [
        document.getElementById('set-button'),
        document.getElementById('mask-button'),
        document.getElementById('lv120-button'),
        document.getElementById('crowned-button')
    ];

    modeButtons.forEach((btn, index) => {
        if (!btn) return;
        if (index === activeIndex) {
            btn.classList.replace("btn--primary", "btn--checked");
        } else {
            btn.classList.replace("btn--checked", "btn--primary");
        }
    });
}

function bindActionButtons() {
    document.getElementById('switch-account-btn').onclick = switchAccount;

    document.getElementById('set-button').onclick = () => { mode = 0; updateModeButtons(0); };
    document.getElementById('mask-button').onclick = () => { mode = 1; updateModeButtons(1); };
    document.getElementById('lv120-button').onclick = () => { mode = 2; updateModeButtons(2); };
    document.getElementById('crowned-button').onclick = () => { mode = 3; updateModeButtons(3); };

    document.getElementById('luckyBag-button').onclick = () => { luckyBag = !luckyBag; if(luckyBag){ document.getElementById('luckyBag-button').classList.replace("btn--primary", "btn--checked"); marginLeft += caculateField; } else { document.getElementById('luckyBag-button').classList.replace("btn--checked", "btn--primary"); marginLeft -= caculateField; } mainLogic(2); };
    document.getElementById('reset').onclick = () => { if (confirm(i18n.confirmClearAll[currentLang])) { deleteData(FGO_STORAGE); localStorage.setItem("r_country", country); location.reload(); } };

    document.getElementById('reset-mark').onclick = () => { 
        if (confirm(i18n.confirmResetMark[currentLang])) { 
            USER_STATE.forEach(state => state.mark = 0);
            saveUserState();
            location.reload(); 
        } 
    };

    document.getElementById('breakthrough').onclick = () => { npLv = (npLv === init_npLv) ? 20 : init_npLv; alert(`${i18n.alertNpLimit[currentLang]}${npLv}`); };
    document.getElementById('open-image-btn').onclick = openImage;
    const importFile = document.getElementById('import-file');
    document.getElementById('import-button').onclick = () => importFile.click();
    document.getElementById('export-button').onclick = exportData;
    importFile.onchange = importData;
}

// ===================================================================================
// 3. 輔助與繪圖函式區 (Helper & Drawing Functions)
// ===================================================================================

function getFontString(size = 20) {
    switch (currentLang) {
        case 'ja': return `${size}px -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', '游ゴシック Medium', 'Yu Gothic Medium', 'メイリオ', Meiryo, sans-serif`;
        case 'en': return `${size}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;
        case 'zh-TW': default: return `${size}px -apple-system, BlinkMacSystemFont, 'PingFang TC', 'Microsoft JhengHei', '微軟正黑體', sans-serif`;
    }
}

function switchAccount() {
    toggleAccount();
    mainLogic(1);
}

function preloadStaticImages(callback) {
    const classIds = Object.values(CLASS_ICON_MAP);
    let loadedCount = 0;
    const total = classIds.length + Marks.length;
    const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === total) callback();
    };
    classIds.forEach((id, i) => {
        categoryImages[i] = new Image();
        categoryImages[i].src = `images/class/class_${id}.png`;
        categoryImages[i].onload = onImageLoad;
        categoryImages[i].onerror = onImageLoad;
    });
    window.classes = classIds;
    Marks.forEach((mark, i) => {
        markImages[i] = new Image();
        markImages[i].src = `images/mark/${mark}.png`;
        markImages[i].onload = onImageLoad;
        markImages[i].onerror = onImageLoad;
    });
}

function Checked(btns, ckbtn){
	btns.forEach(btn => { if (btn === ckbtn) { btn.classList.remove('btn--primary'); btn.classList.add('btn--checked'); }
						  else { btn.classList.remove('btn--checked'); btn.classList.add('btn--primary'); } }); }

function drawImage(x, y, image){
    const xPos = x * (CELL_SIZE + col_padding) + marginLeft, yPos = y * (CELL_SIZE + row_padding) + marginTop;
	if(image && image.complete && image.naturalHeight !== 0){
		try{ context.drawImage(image, xPos, yPos, CELL_SIZE, CELL_SIZE); }
        catch(e) { console.error("圖片繪製失敗 (catch):", image.src, e); drawPlaceholder(xPos, yPos); }
	} else {
        drawPlaceholder(xPos, yPos);
	}
}

function drawPlaceholder(xPos, yPos) {
    context.fillStyle = '#AAA'; context.fillRect(xPos, yPos, CELL_SIZE, CELL_SIZE);
    context.fillStyle = '#FFF'; context.font = `bold ${CELL_SIZE * 0.6}px Arial`; context.textAlign = "center"; context.textBaseline = "middle";
    context.fillText("?", xPos + CELL_SIZE / 2, yPos + CELL_SIZE / 2);
    context.textAlign = "start"; context.textBaseline = "alphabetic";
}

function fillCaculate(){
	context.font = getFontString(12);
	var have = 0, haveFull = 0, like = 0, percent = 0, ex = 0;
	var lucky_bag = (country != 'jp' && country != 'tw' && country != 'z');
	var default_cat1 = lucky_bag ? (CategoryLen - 1):7, default_cat2 = lucky_bag ? (CategoryLen - 1):6;
	context.fillStyle = bgcolor; context.fillRect(0, 0, caculateField + 10, canvas.height); context.fillStyle = font_color;
    let pass = 0;
	for(var category = 0; category < CategoryLen; category++){
        if (CategoryNum[category] === 0) { pass++; continue; }
		if (category <= default_cat1) have = 0, haveFull = 0, like = 0;
		for(var attribute = 0; attribute < CategoryNum[category]; attribute++){
            const state = getUnitState(units[category][attribute].no);
			if (state.npLv){ have++; if(state.npLv >= 5) haveFull++; }
			if (state.mark == 2) like++;
		}
		if (category <= default_cat2){
			if(attribute>0){
                const yPos = marginTop + (category - pass) * (CELL_SIZE + row_padding), centerY = yPos + (CELL_SIZE / 2);
                context.textBaseline = 'middle';
				percent = ((1 - (have / attribute)) * 100);
				context.fillText(`${i18n.expectNew[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY - 15);
				percent = (haveFull / units[category].length * 100);
				context.fillText(`${i18n.expectRegret[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY);
				percent = (like / units[category].length * 100);
				context.fillText(`${i18n.expectLove[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY + 15);
                context.textBaseline = 'alphabetic';
			}
		}else { ex += units[category].length; }
	}
	if(!lucky_bag){
        const yPos = marginTop + 7 * (CELL_SIZE + row_padding), centerY = yPos + (CELL_SIZE / 2);
        context.textBaseline = 'middle';
		percent = ((1 - (have / ex)) * 100);
		context.fillText(`${i18n.expectNew[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY - 15);
		percent = (haveFull / ex * 100);
		context.fillText(`${i18n.expectRegret[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY);
		percent = (like / ex * 100);
		context.fillText(`${i18n.expectLove[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY + 15);
        context.textBaseline = 'alphabetic';
	}
}
function fillRect(x, y, color){ context.fillStyle = color; context.fillRect ((x + 1) * (CELL_SIZE + col_padding) + marginLeft, y * (CELL_SIZE + row_padding) + marginTop, CELL_SIZE, CELL_SIZE); }
function fillTextMask(x, y, color){ context.fillStyle = color; context.fillRect(x * (CELL_SIZE + col_padding) + marginLeft, (y + 1) * (CELL_SIZE + row_padding) - row_padding  + marginTop, CELL_SIZE, row_padding); }
function fillNPText(x, y, msg) {
    context.font = getFontString(20);
    let number = msg.match(/\d+/)[0];
    context.fillStyle = (number == 5) ? "rgb(255, 255, 0)" : (number >= 6) ? "rgb(255, 0, 0)" : font_color;
    context.textBaseline = 'top';
    const textWidth = context.measureText(msg).width;
    const xPos = (x + 1) * (CELL_SIZE + col_padding) + marginLeft + (CELL_SIZE - textWidth) / 2;
    const yPos = y * (CELL_SIZE + row_padding) + marginTop + CELL_SIZE + 5;
    context.fillText(msg, xPos, yPos);
    context.textBaseline = 'alphabetic';
}

function fillTotalText() {
    context.font = getFontString(18);

    var totalHave = 0, totalNP = 0, total = 0, totalNP5 = 0;
    for (let i = 0; i < CategoryLen; i++) {
        total += CategoryNum[i];
        for (let j = 0; j < CategoryNum[i]; j++) {
            if (units[i][j]) {
                const state = getUnitState(units[i][j].no);
                totalNP += state.npLv;
                if (state.npLv > 0) totalHave++;
                if (state.npLv >= 5) totalNP5++;
            }
        }
    }
    var percent = total > 0 ? (totalHave / total) * 100 : 0;
    var percentNP5 = total > 0 ? (totalNP5 / total) * 100 : 0;

    let boxWidth;
    switch (currentLang) {
        case 'zh-TW': boxWidth = 220; break;
        case 'en': boxWidth = 260; break;
        case 'ja': boxWidth = 300; break;
        default: boxWidth = 220;
    }

    const boxHeight = 140;
    const boxX = canvas.width - boxWidth;
    const boxY = canvas.height - 170;
    context.fillStyle = bgcolor;
    context.fillRect(boxX, boxY, boxWidth, boxHeight);

    context.textAlign = 'left';
    context.fillStyle = font_color;
    const xPos = boxX + 10;
    const lineSpacing = 25;

    let currentY = boxY + 15;

    const line_np5_owned = `${i18n.totalNP5Owned[currentLang]}: ${totalNP5}/${total}`;
    context.fillText(line_np5_owned, xPos, currentY);
    currentY += lineSpacing;

    const line_np5_rate_label = `${i18n.ownedNP5Rate[currentLang]}: `;
    const line_np5_rate_value = `${percentNP5.toFixed(2)}%`;
    let valueColorNP5 = font_color;
    if (percentNP5 >= 100) valueColorNP5 = "gold";
    else if (percentNP5 >= 90) valueColorNP5 = "red";
    else if (percentNP5 >= 75) valueColorNP5 = "purple";
    else if (percentNP5 >= 50) valueColorNP5 = "blue";
    else if (percentNP5 >= 25) valueColorNP5 = "green";

    context.fillStyle = font_color;
    context.fillText(line_np5_rate_label, xPos, currentY);
    const labelWidthNP5 = context.measureText(line_np5_rate_label).width;
    context.fillStyle = valueColorNP5;
    context.fillText(line_np5_rate_value, xPos + labelWidthNP5, currentY);
    currentY += lineSpacing;

    context.fillStyle = font_color;
    const line_total_owned = `${i18n.totalOwned[currentLang]}: ${totalHave}/${total}`;
    context.fillText(line_total_owned, xPos, currentY);
    currentY += lineSpacing;

    const line_owned_rate_label = `${i18n.ownedRate[currentLang]}: `;
    const line_owned_rate_value = `${percent.toFixed(2)}%`;
    let valueColor = font_color;
    if (percent >= 100) valueColor = "gold";
    else if (percent >= 90) valueColor = "red";
    else if (percent >= 75) valueColor = "purple";
    else if (percent >= 50) valueColor = "blue";
    else if (percent >= 25) valueColor = "green";

    context.fillStyle = font_color;
    context.fillText(line_owned_rate_label, xPos, currentY);
    const labelWidthOwned = context.measureText(line_owned_rate_label).width;
    context.fillStyle = valueColor;
    context.fillText(line_owned_rate_value, xPos + labelWidthOwned, currentY);
    currentY += lineSpacing;

    context.fillStyle = font_color;
    const line_total_np = `${i18n.totalNPLevel[currentLang]}: ${totalNP}`;
    context.fillText(line_total_np, xPos, currentY);
    context.textAlign = 'start';
}

function drawUnitBorder(x, y, color) {
    const xPos = x * (CELL_SIZE + col_padding) + marginLeft;
    const yPos = y * (CELL_SIZE + row_padding) + marginTop;
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.strokeRect(xPos + 1.5, yPos + 1.5, CELL_SIZE - 3, CELL_SIZE - 3);
    context.lineWidth = 1;
}

function getCoordinates(e){ const rect = e.target.getBoundingClientRect(); const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height; return {'x': (e.clientX - rect.left) * scaleX, 'y': (e.clientY - rect.top) * scaleY}; }
function getCategory(y){ return Math.floor((y - marginTop) / (CELL_SIZE + row_padding)); }
function getAttribute(x){ return Math.floor((x - marginLeft) / (CELL_SIZE + col_padding)); }

function handleUnitInteraction(event, isRightClick = false) {
    const point = getCoordinates(event);
    let categoryIndex = getCategory(point.y);
    let attributeIndex = getAttribute(point.x);

    let visibleCategoryIndex = 0;
    let actualCategoryIndex = -1;
    for (let i = 0; i < CategoryLen; i++) {
        if (CategoryNum[i] > 0) {
            if (visibleCategoryIndex === categoryIndex) {
                actualCategoryIndex = i;
                break;
            }
            visibleCategoryIndex++;
        }
    }
    if (actualCategoryIndex === -1) return;

    if (attributeIndex === 0) {
        if (isRightClick) return;

        if (selectedClasses.has(actualCategoryIndex)) {
            selectedClasses.delete(actualCategoryIndex);
        } else {
            selectedClasses.add(actualCategoryIndex);
        }
        drawCanvas();
        return;
    }

    categoryIndex = actualCategoryIndex;
    const xInCell = point.x - (attributeIndex * (CELL_SIZE + col_padding) + marginLeft);
    const yInCell = point.y - (getCategory(point.y) * (CELL_SIZE + row_padding) + marginTop);

    if (xInCell < CELL_SIZE && xInCell > 0 && yInCell < CELL_SIZE && yInCell > 0 && attributeIndex > 0 && attributeIndex <= CategoryNum[categoryIndex]) {
        const unit = units[categoryIndex][attributeIndex - 1];
        const state = getUnitState(unit.no);
        const yPos = getCategory(point.y);

        switch(mode) {
			case 0:
                if (isRightClick) {
                    if (state.npLv === 0) state.npLv = npLv;
                    else state.npLv--;
                } else {
                    state.npLv = state.npLv < npLv ? state.npLv + 1 : 0;
                }
				break;
		    case 1:
                if (isRightClick) state.mark = state.mark > 0 ? state.mark - 1 : Marks.length;
                else state.mark = (state.mark + 1) % (Marks.length + 1);
				break;
            case 2:
                state.lv120 = !state.lv120 ? 1 : 0;
                break;
            case 3:
                state.crowned = !state.crowned ? 1 : 0;
                break;
		}

        drawImage(attributeIndex, yPos, unit.image);

        if (!state.npLv) { 
            fillTextMask(attributeIndex, yPos, bgcolor);
            fillRect(attributeIndex - 1, yPos, mask);
        } else { 
            fillTextMask(attributeIndex, yPos, bgcolor);
            fillNPText(attributeIndex - 1, yPos, `${i18n.npLevelPrefix[currentLang]}${state.npLv}`); 
        }

        const is120 = state.lv120;
        const isCrowned = state.crowned;
        if (is120 && isCrowned) {
            drawUnitBorder(attributeIndex, yPos, "#39C5BB");
        } else if (is120) {
            drawUnitBorder(attributeIndex, yPos, "#FFE211");
        } else if (isCrowned) {
            drawUnitBorder(attributeIndex, yPos, "#0000FF");
        }

        if (state.mark) drawImage(attributeIndex, yPos, markImages[state.mark - 1]);

		fillTotalText();
		if(luckyBag) fillCaculate();
		saveUserState();
    }
}

function rightClick(e){ handleUnitInteraction(e, true); }
function onCanvasClick(e){ handleUnitInteraction(e, false); }

function exportData() {
    const accountName = getCurrentAccount();
    const data = getData(FGO_STORAGE);
    if (data.length === 0) {
        alert("目前帳號沒有資料可匯出。");
        return;
    }
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fgo_5star_data_${accountName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!Array.isArray(importedData)) throw new Error("Data is not an array.");
            if (confirm(i18n.confirmImport[currentLang])) {
                setData(FGO_STORAGE, importedData);
                alert(i18n.successImport[currentLang]);
                location.reload();
            }
        } catch (error) {
            console.error("Import failed:", error);
            alert(i18n.errorImport[currentLang]);
        } finally {
            event.target.value = null;
        }
    };
    reader.readAsText(file);
}

function openImage(){
	try{
		const canvas = document.getElementById("canvas");
		const dataUrl = canvas.toDataURL("image/png");
		const win = window.open();
		if (!win) {
			alert(i18n.errorGenerateImage[currentLang] + "（彈出視窗被瀏覽器封鎖，請允許此網站的彈出視窗）");
			return;
		}
		win.document.write(buildImagePreviewHtml(dataUrl));
		win.document.close();
	}catch(e){
        if (e.name === "SecurityError") alert(i18n.errorSecurity[currentLang]);
        else alert(`${i18n.errorGenerateImage[currentLang]}${e}`);
	}
}

function buildImagePreviewHtml(dataUrl) {
    const t = {
        title: (i18n.pageTitle && i18n.pageTitle[currentLang]) || "FGO 五星英靈一覽表",
        upload: (i18n.uploadImage && i18n.uploadImage[currentLang]) || "上傳到 urusai.cc",
        uploading: (i18n.uploading && i18n.uploading[currentLang]) || "上傳中…",
        copy: (i18n.copyImage && i18n.copyImage[currentLang]) || "複製圖片到剪貼簿",
        copying: (i18n.copying && i18n.copying[currentLang]) || "複製中…",
        uploadSuccess: (i18n.uploadSuccess && i18n.uploadSuccess[currentLang]) || "上傳成功，已在新分頁開啟：",
        uploadFail: (i18n.errorUploadImage && i18n.errorUploadImage[currentLang]) || "上傳失敗：",
        copySuccess: (i18n.copySuccess && i18n.copySuccess[currentLang]) || "已複製圖片到剪貼簿",
        copyFail: (i18n.errorCopyImage && i18n.errorCopyImage[currentLang]) || "複製失敗：",
        copyUnsupported: (i18n.errorCopyUnsupported && i18n.errorCopyUnsupported[currentLang]) || "此瀏覽器不支援直接複製圖片，請改用右鍵另存圖片"
    };

    const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    const escJs = (s) => String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/</g, "\\x3C");

    return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<title>${escAttr(t.title)}</title>
<style>
  body { margin:0; padding:16px; background:#999; font-family: -apple-system, "Microsoft JhengHei", "PingFang TC", sans-serif; text-align:center; }
  .toolbar { margin-bottom:12px; display:flex; flex-wrap:wrap; justify-content:center; gap:8px; }
  .toolbar button { background:#000; color:#fff; border:none; border-radius:22px; padding:12px 20px; font-size:14px; cursor:pointer; letter-spacing: 1px; min-height:44px; }
  .toolbar button:hover:not(:disabled) { background:#2b3033; }
  .toolbar button:disabled { background:#666; cursor:not-allowed; }
  #status { display:block; margin:0 0 12px; font-size:12px; color:#222; min-height:16px; word-break:break-all; }
  #status a { color:#00405c; }
  #status .result-link { display:inline-block; margin-top:8px; padding:9px 18px; background:#000; color:#fff; text-decoration:none; border-radius:20px; font-size:13px; word-break:break-all; }
  #status .result-link:hover { background:#2b3033; }
  #preview-img { max-width:100%; height:auto; display:block; margin:0 auto; box-shadow:0 0 8px rgba(0,0,0,0.4); }
</style>
</head>
<body>
  <div class="toolbar">
    <button id="upload-btn">${escAttr(t.upload)}</button>
    <button id="copy-btn">${escAttr(t.copy)}</button>
  </div>
  <span id="status"></span>
  <img id="preview-img" src="${dataUrl}" alt="${escAttr(t.title)}">
  <script>
  (function () {
    var dataUrl = document.getElementById('preview-img').src;
    var statusEl = document.getElementById('status');
    var uploadBtn = document.getElementById('upload-btn');
    var copyBtn = document.getElementById('copy-btn');
    var LABEL_UPLOAD = '${escJs(t.upload)}';
    var LABEL_UPLOADING = '${escJs(t.uploading)}';
    var LABEL_COPY = '${escJs(t.copy)}';
    var LABEL_COPYING = '${escJs(t.copying)}';
    var MSG_UPLOAD_SUCCESS = '${escJs(t.uploadSuccess)}';
    var MSG_UPLOAD_FAIL = '${escJs(t.uploadFail)}';
    var MSG_COPY_SUCCESS = '${escJs(t.copySuccess)}';
    var MSG_COPY_FAIL = '${escJs(t.copyFail)}';
    var MSG_COPY_UNSUPPORTED = '${escJs(t.copyUnsupported)}';

    function setStatus(html) { statusEl.innerHTML = html || ''; }
    function toOriginalQualityUrl(url) {
      if (!url) return url;
      try {
        var u = new URL(url);
        if (u.hostname.toLowerCase() === 'l.urusai.cc') {
          u.hostname = 'i.urusai.cc';
          return u.toString();
        }
      } catch (e) {}
      return url;
    }

    uploadBtn.addEventListener('click', function () {
      uploadBtn.disabled = true;
      uploadBtn.textContent = LABEL_UPLOADING;
      setStatus('');

      fetch(dataUrl)
        .then(function (r) { return r.blob(); })
        .then(function (blob) {
          var form = new FormData();
          form.append('file', blob, 'fgo-5star.png');
          form.append('r18', '0');
          form.append('token', '');
          form.append('sha256', '');
          return fetch('https://api-v1-t2-upload.urusai.cc', { method: 'POST', body: form });
        })
        .then(function (res) {
          return res.json().then(function (json) {
            if (!res.ok || json.status !== 'success' || !json.data) throw new Error((json && json.message) || 'upload failed');
            return json.data;
          });
        })
        .then(function (data) {
          var link = toOriginalQualityUrl(data.url_direct) || data.url_direct;
          try { window.open(link, '_blank'); } catch (e) {}
          setStatus(MSG_UPLOAD_SUCCESS + '<br><a class="result-link" href="' + link + '" target="_blank" rel="noopener">' + link + '</a>');
        })
        .catch(function (err) {
          setStatus(MSG_UPLOAD_FAIL + (err && err.message ? err.message : err));
        })
        .finally(function () {
          uploadBtn.disabled = false;
          uploadBtn.textContent = LABEL_UPLOAD;
        });
    });

    copyBtn.addEventListener('click', function () {
      if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
        setStatus(MSG_COPY_UNSUPPORTED);
        return;
      }
      copyBtn.disabled = true;
      copyBtn.textContent = LABEL_COPYING;
      setStatus('');

      const blobPromise = fetch(dataUrl).then(function (r) { return r.blob(); });
      navigator.clipboard
        .write([new ClipboardItem({ 'image/png': blobPromise })])
        .then(function () { setStatus(MSG_COPY_SUCCESS); })
        .catch(function (err) { setStatus(MSG_COPY_FAIL + (err && err.message ? err.message : err)); })
        .finally(function () {
          copyBtn.disabled = false;
          copyBtn.textContent = LABEL_COPY;
        });
    });
  })();
  <\/script>
</body>
</html>`;
}

function getLanguage() {
    const savedLang = localStorage.getItem('fgo5s-lang');
    if (savedLang && i18n.pageTitle[savedLang]) return savedLang;
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) return 'ja';
    if (browserLang.startsWith('en')) return 'en';
    return 'zh-TW';
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('fgo5s-lang', lang);
    applyLanguage(lang);
    if (canvas && context) drawCanvas();
}

function applyLanguage(lang) {
    document.querySelectorAll('[data-i18n-key]').forEach(el => {
        const key = el.getAttribute('data-i18n-key');
        if (i18n[key] && i18n[key][lang]) {
            el.innerText = i18n[key][lang];
        }
    });
    Object.keys(FGO_DATA).forEach(modeKey => {
        const modeData = FGO_DATA[modeKey];
        const buttonId = ['jp', 'tw', 'z'].includes(modeKey) ? `${modeKey}-button` : modeKey;
        const button = document.getElementById(buttonId);
        if (button) {
            // 支援舊版 i18n (labelKey) 與新版 JSON 動態載入 (label)
            if (modeData.labelKey && i18n[modeData.labelKey] && i18n[modeData.labelKey][lang]) {
                button.innerText = i18n[modeData.labelKey][lang];
            } else if (modeData.label && modeData.label[lang]) {
                button.innerText = modeData.label[lang];
            }
        }
    });
}