// ===================================================================================
// main.js - 進入點：組裝所有模組、負責流程控制 (init / mainLogic / getUnit)
// ===================================================================================
import { appState, CELL_SIZE, row_padding, col_padding, caculateField, marginTop, FOOTER_HEIGHT, MIN_CANVAS_WIDTH, loadUserState } from './state.js';
import { migrateOldData } from './storage.js';
import { Category, CategoryLen, FGO_DATA, loadLuckyBagData } from './gameData.js';
import { ImagePreloader, preloadStaticImages } from './imagePreloader.js';
import { drawCanvas } from './render.js';
import { onCanvasClick, rightClick } from './interaction.js';
import { bindActionButtons, Checked } from './ui.js';
import { applyLanguage, setLanguage } from './i18nHelper.js';

function getUnit(country) {
    const currentData = FGO_DATA[country];
    if (!currentData || typeof currentData.servants !== 'object') {
        alert("資料載入錯誤或尚未完成，請稍後再試： " + country);
        return [];
    }
    const sourceServants = currentData.servants;
    appState.CategoryNum = Category.map((className, index) => {
        if (currentData.categoryNumOverride) return currentData.categoryNumOverride[index] || 0;
        return sourceServants[className] ? sourceServants[className].length : 0;
    });

    let newUnits = [];
    for (let i = 0; i < CategoryLen; i++) {
        const className = Category[i];
        newUnits[i] = [];
        if (sourceServants[className] && appState.CategoryNum[i] > 0) {
            for (let j = 0; j < appState.CategoryNum[i]; j++) {
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

function mainLogic(state = 0) {
    if (state === 1) {
        appState.selectedClasses.clear();
    }
    const currentCountryData = FGO_DATA[appState.country];
    if (!currentCountryData || !currentCountryData.isReleased) {
        console.log(`Saved mode "${appState.country}" is not available. Defaulting to "jp".`);
        appState.country = 'jp';
        localStorage.setItem("r_country", 'jp');
    }

    // 取得靜態圖鑑與讀取狀態
    appState.units = getUnit(appState.country);
    if (!appState.units) return;
    loadUserState();

    appState.canvas = document.getElementById('canvas');
    appState.context = appState.canvas.getContext('2d');

    if (state === 0) {
        migrateOldData();
        Object.keys(FGO_DATA).forEach(modeKey => {
            const modeData = FGO_DATA[modeKey];
            const buttonId = ['jp', 'tw', 'z'].includes(modeKey) ? `${modeKey}-button` : modeKey;
            const button = document.getElementById(buttonId);
            if (button) {
                const listItem = button.parentElement;
                if (listItem) listItem.style.display = modeData.isReleased ? '' : 'none';

                appState.allModeButtons.push(button);
                button.onclick = () => {
                    if (appState.country !== modeKey) {
                        appState.country = modeKey;
                        localStorage.setItem("r_country", appState.country);
                        mainLogic(1);
                    }
                };
            }
        });
        bindActionButtons(mainLogic);
        appState.canvas.onclick = onCanvasClick;
        appState.canvas.addEventListener('contextmenu', e => { e.preventDefault(); rightClick(e); });
        bindLanguageSwitcher();
    }

    const currentButtonId = ['jp', 'tw', 'z'].includes(appState.country) ? `${appState.country}-button` : appState.country;
    const currentActiveButton = document.getElementById(currentButtonId);
    if (currentActiveButton) Checked(appState.allModeButtons, currentActiveButton);

    const visibleRows = appState.CategoryNum.filter(num => num > 0).length;
    const iconWidth = appState.luckyBag
        ? (Math.max.apply(null, appState.CategoryNum) + 1) * (CELL_SIZE + col_padding) + caculateField
        : (Math.max.apply(null, appState.CategoryNum) + 1) * (CELL_SIZE + col_padding);
    appState.canvas.width = Math.max(iconWidth, MIN_CANVAS_WIDTH);
    appState.canvas.height = visibleRows * (CELL_SIZE + row_padding) + marginTop + FOOTER_HEIGHT;

    applyLanguage(appState.currentLang);
    drawCanvas();
}

// 語言切換器改用事件綁定，取代原本 index.html 內的 inline onclick="setLanguage(...)"
function bindLanguageSwitcher() {
    document.querySelectorAll('#language-switcher [data-lang]').forEach(el => {
        el.addEventListener('click', () => setLanguage(el.getAttribute('data-lang')));
    });
}

async function init() {
    preloadStaticImages(async () => {
        await loadLuckyBagData();
        ImagePreloader.init(() => {
            mainLogic();
        });
    });
}

// type="module" 的 script 會在 DOM 解析完成後才執行，等同原本 body onload 的時機，
// 因此這裡可以直接呼叫，不需要再監聽 load 事件。
init();
