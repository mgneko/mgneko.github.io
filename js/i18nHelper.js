// ===================================================================================
// i18nHelper.js - 語言切換與套用 (語言偵測邏輯已移至 state.js 供初始化使用)
// ===================================================================================
import i18n from '../i18n.js';
import { appState } from './state.js';
import { FGO_DATA } from './gameData.js';
import { drawCanvas } from './render.js';

export function setLanguage(lang) {
    appState.currentLang = lang;
    localStorage.setItem('fgo5s-lang', lang);
    applyLanguage(lang);
    if (appState.canvas && appState.context) drawCanvas();
}

export function applyLanguage(lang) {
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
