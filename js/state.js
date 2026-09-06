// ===================================================================================
// state.js - 常數設定 + 集中管理的可變全域狀態 + 使用者持有資料狀態
// ===================================================================================
import i18n from '../i18n.js';
import { FGO_STORAGE, getData, setData } from './storage.js';

// ---- 版面 / 顏色常數 ----
export const CELL_SIZE = 50;
export const caculateField = 70;
export const row_padding = 30;
export const col_padding = 20;
export const marginTop = 10;
export const FOOTER_HEIGHT = 50;
export const bgcolor = "rgb(176, 176, 176)";
export const mask = "rgb(0, 0, 0, 0.6)";
export const font_color = "rgb(0, 0, 0)";
export const init_npLv = 6;
export const MIN_CANVAS_WIDTH = 850;

// 偵測預設語言。只在初始化 appState 時用一次，故不對外 export，
// 之後要「切換」語言請一律透過 i18nHelper.js 的 setLanguage()。
function detectInitialLanguage() {
    const savedLang = localStorage.getItem('fgo5s-lang');
    if (savedLang && i18n.pageTitle[savedLang]) return savedLang;
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) return 'ja';
    if (browserLang.startsWith('en')) return 'en';
    return 'zh-TW';
}

// ---- 執行期會變動的全域狀態，統一放在這個物件裡 ----
export const appState = {
    canvas: null,
    context: null,
    country: localStorage.getItem("r_country") || "jp",
    currentLang: detectInitialLanguage(),
    mode: 0,
    luckyBag: 0,
    npLv: init_npLv,
    marginLeft: 10,
    CategoryNum: [],
    units: [],
    allModeButtons: [],
    selectedClasses: new Set(),
};

// ===================================================================================
// 使用者持有資料狀態 (npLv / mark / lv120 / crowned)
// ===================================================================================
export let USER_STATE = new Map();

export function loadUserState() {
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

export function saveUserState() {
    const arr = [];
    USER_STATE.forEach((state, no) => {
        if (state.npLv > 0 || state.mark > 0 || state.lv120 > 0 || state.crowned > 0) {
            arr.push({ no: String(no), ...state });
        }
    });
    setData(FGO_STORAGE, arr);
}

export function getUnitState(no) {
    const key = String(no);
    if (!USER_STATE.has(key)) {
        USER_STATE.set(key, { npLv: 0, mark: 0, lv120: 0, crowned: 0 });
    }
    return USER_STATE.get(key);
}
