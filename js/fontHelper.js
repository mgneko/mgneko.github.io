// ===================================================================================
// fontHelper.js - 依目前語言組出 canvas 用的字型字串
// ===================================================================================
import { appState } from './state.js';

export function getFontString(size = 20) {
    switch (appState.currentLang) {
        case 'ja':
            return `${size}px -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', '游ゴシック Medium', 'Yu Gothic Medium', 'メイリオ', Meiryo, sans-serif`;
        case 'en':
            return `${size}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;
        case 'zh-TW':
        default:
            return `${size}px -apple-system, BlinkMacSystemFont, 'PingFang TC', 'Microsoft JhengHei', '微軟正黑體', sans-serif`;
    }
}
