// ===================================================================================
// ui.js - 按鈕事件綁定、模式切換按鈕高亮
// ===================================================================================
import i18n from '../i18n.js';
import { appState, caculateField, USER_STATE, init_npLv, saveUserState } from './state.js';
import { toggleAccount, deleteData, FGO_STORAGE } from './storage.js';
import { exportData, importData } from './dataTransfer.js';
import { openImage } from './imageExport.js';

// 四種持有資料設定模式共用同一份 id 清單，button 的索引就是 appState.mode 的值，
// updateModeButtons 跟 bindActionButtons 都從這裡讀，避免同一份 id 各寫一次。
const MODE_BUTTON_IDS = ['set-button', 'mask-button', 'lv120-button', 'crowned-button'];

export function updateModeButtons(activeIndex) {
    MODE_BUTTON_IDS.forEach((id, index) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        if (index === activeIndex) {
            btn.classList.replace("btn--primary", "btn--checked");
        } else {
            btn.classList.replace("btn--checked", "btn--primary");
        }
    });
}

export function Checked(btns, ckbtn) {
    btns.forEach(btn => {
        if (btn === ckbtn) { btn.classList.remove('btn--primary'); btn.classList.add('btn--checked'); }
        else { btn.classList.remove('btn--checked'); btn.classList.add('btn--primary'); }
    });
}

function switchAccount(mainLogic) {
    toggleAccount();
    mainLogic(1);
}

// mainLogic 由 main.js 傳入，避免 ui.js <-> main.js 互相 import 造成循環相依
export function bindActionButtons(mainLogic) {
    document.getElementById('switch-account-btn').onclick = () => switchAccount(mainLogic);

    MODE_BUTTON_IDS.forEach((id, index) => {
        document.getElementById(id).onclick = () => { appState.mode = index; updateModeButtons(index); };
    });

    document.getElementById('luckyBag-button').onclick = () => {
        appState.luckyBag = !appState.luckyBag;
        if (appState.luckyBag) {
            document.getElementById('luckyBag-button').classList.replace("btn--primary", "btn--checked");
            appState.marginLeft += caculateField;
        } else {
            document.getElementById('luckyBag-button').classList.replace("btn--checked", "btn--primary");
            appState.marginLeft -= caculateField;
        }
        mainLogic(2);
    };

    document.getElementById('reset').onclick = () => {
        if (confirm(i18n.confirmClearAll[appState.currentLang])) {
            deleteData(FGO_STORAGE);
            localStorage.setItem("r_country", appState.country);
            location.reload();
        }
    };

    document.getElementById('reset-mark').onclick = () => {
        if (confirm(i18n.confirmResetMark[appState.currentLang])) {
            USER_STATE.forEach(state => state.mark = 0);
            saveUserState();
            location.reload();
        }
    };

    document.getElementById('breakthrough').onclick = () => {
        appState.npLv = (appState.npLv === init_npLv) ? 20 : init_npLv;
        alert(`${i18n.alertNpLimit[appState.currentLang]}${appState.npLv}`);
    };

    document.getElementById('open-image-btn').onclick = openImage;
    const importFile = document.getElementById('import-file');
    document.getElementById('import-button').onclick = () => importFile.click();
    document.getElementById('export-button').onclick = exportData;
    importFile.onchange = importData;
}
