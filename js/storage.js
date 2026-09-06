// ===================================================================================
// storage.js - 儲存與帳號管理
// ===================================================================================

export const FGO_STORAGE = "FGO_Storage";
export const ACCOUNT_KEY = "FGO_Account";

export function toggleAccount() {
    const currentAccount = localStorage.getItem(ACCOUNT_KEY) || "account1";
    const newAccount = currentAccount === "account1" ? "account2" : "account1";
    localStorage.setItem(ACCOUNT_KEY, newAccount);
    console.log(`Account switched to: ${newAccount}`);
}

export function getCurrentAccount() {
    return localStorage.getItem(ACCOUNT_KEY) || "account1";
}

export function getData(name) {
    const acc = getCurrentAccount();
    const item = localStorage.getItem(`${name}_${acc}`);
    return item ? JSON.parse(item) : [];
}

export function setData(name, content) {
    const acc = getCurrentAccount();
    if (content) localStorage.setItem(`${name}_${acc}`, JSON.stringify(content));
}

export function deleteData(name) {
    const acc = getCurrentAccount();
    localStorage.removeItem(`${name}_${acc}`);
}

export function migrateOldData() {
    const oldData = localStorage.getItem(FGO_STORAGE);
    if (oldData && !localStorage.getItem(`${FGO_STORAGE}_account1`)) {
        localStorage.setItem(`${FGO_STORAGE}_account1`, oldData);
        console.log("舊資料已成功遷移到帳號1");
    }
}
