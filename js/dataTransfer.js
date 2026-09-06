// ===================================================================================
// dataTransfer.js - 資料匯出 / 匯入 (JSON 備份檔)
// ===================================================================================
import i18n from '../i18n.js';
import { appState } from './state.js';
import { FGO_STORAGE, getCurrentAccount, getData, setData } from './storage.js';

export function exportData() {
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

export function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!Array.isArray(importedData)) throw new Error("Data is not an array.");
            if (confirm(i18n.confirmImport[appState.currentLang])) {
                setData(FGO_STORAGE, importedData);
                alert(i18n.successImport[appState.currentLang]);
                location.reload();
            }
        } catch (error) {
            console.error("Import failed:", error);
            alert(i18n.errorImport[appState.currentLang]);
        } finally {
            event.target.value = null;
        }
    };
    reader.readAsText(file);
}
