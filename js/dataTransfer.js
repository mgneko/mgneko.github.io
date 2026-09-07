// ===================================================================================
// dataTransfer.js - 資料匯出 / 匯入 (JSON 備份檔)
// ===================================================================================
import i18n from '../i18n.js';
import { appState } from './state.js';
import { FGO_STORAGE, getCurrentAccount, getData, setData } from './storage.js';
import { Marks } from './gameData.js';

const MAX_NP_LEVEL = 20;
const MAX_IMPORT_ENTRIES = 2000; // 遠大於實際從者數量的合理上限，防止異常巨大的檔案
const MAX_IMPORT_FILE_SIZE = 5 * 1024 * 1024; // 5MB，正常備份檔頂多幾十 KB

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

// 將匯入的原始資料逐筆清洗成安全、型別正確的格式。
// 回傳 null 代表整體格式就不是我們認得的備份檔（例如根本不是陣列）。
// 回傳空陣列代表格式對，但裡面沒有任何一筆是有效資料。
function sanitizeImportedData(raw) {
    if (!Array.isArray(raw)) return null;
    if (raw.length > MAX_IMPORT_ENTRIES) {
        throw new Error(`Too many entries (${raw.length}), exceeds limit of ${MAX_IMPORT_ENTRIES}.`);
    }

    const seen = new Set();
    const sanitized = [];

    for (const item of raw) {
        if (!item || typeof item !== 'object') continue;

        const no = Number(item.no);
        if (!Number.isInteger(no) || no <= 0) continue; // 沒有有效從者編號，這筆資料沒有意義，直接跳過

        const key = String(no);
        if (seen.has(key)) continue; // 同一從者編號重複出現，只保留第一筆，避免定義不明
        seen.add(key);

        let npLv = Number(item.npLv);
        if (!Number.isFinite(npLv) || npLv < 0) npLv = 0;
        npLv = Math.min(Math.floor(npLv), MAX_NP_LEVEL);

        let mark = Number(item.mark);
        if (!Number.isFinite(mark) || mark < 0) mark = 0;
        mark = Math.min(Math.floor(mark), Marks.length);

        sanitized.push({
            no: key,
            npLv,
            mark,
            lv120: item.lv120 ? 1 : 0,
            crowned: item.crowned ? 1 : 0
        });
    }

    return sanitized;
}

export function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMPORT_FILE_SIZE) {
        alert(i18n.errorImport[appState.currentLang]);
        console.error(`Import failed: file too large (${file.size} bytes).`);
        event.target.value = null;
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedData = JSON.parse(e.target.result);
            const sanitized = sanitizeImportedData(importedData);

            if (sanitized === null) {
                throw new Error("Data is not an array.");
            }
            if (sanitized.length === 0) {
                throw new Error("No valid entries found in the backup file.");
            }

            if (confirm(i18n.confirmImport[appState.currentLang])) {
                try {
                    setData(FGO_STORAGE, sanitized);
                } catch (storageError) {
                    // 例如 localStorage 容量已滿 (QuotaExceededError)
                    console.error("Import failed while saving:", storageError);
                    alert(i18n.errorImport[appState.currentLang]);
                    return;
                }
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
    reader.onerror = function () {
        console.error("Import failed: could not read file.");
        alert(i18n.errorImport[appState.currentLang]);
        event.target.value = null;
    };
    reader.readAsText(file);
}