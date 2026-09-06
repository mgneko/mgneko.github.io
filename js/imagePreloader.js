// ===================================================================================
// imagePreloader.js - 靜態圖片(職階/標記)與從者圖片預載
// ===================================================================================
import i18n from '../i18n.js';
import { appState, bgcolor, font_color } from './state.js';
import { FGO_DATA, CLASS_ICON_MAP, Marks } from './gameData.js';
import { getFontString } from './fontHelper.js';

export const categoryImages = [];
export const markImages = [];

// preloadStaticImages 執行後，會把職階圖示對應到的魔法數字陣列存到這裡，
// render.js 需要用它把 classIconImg 轉成 categoryImages 的索引。
export const classes = [];

export const ImagePreloader = {
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

        const loadingText = i18n.loadingImages[appState.currentLang];
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

export function preloadStaticImages(callback) {
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
    classes.length = 0;
    classes.push(...classIds);
    Marks.forEach((mark, i) => {
        markImages[i] = new Image();
        markImages[i].src = `images/mark/${mark}.png`;
        markImages[i].onload = onImageLoad;
        markImages[i].onerror = onImageLoad;
    });
}
