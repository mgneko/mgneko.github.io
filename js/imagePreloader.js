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

    // 建立一批 Image、掛上 src 跟 onload/onerror，職階圖跟標記圖的載入方式完全相同，
    // 差別只在圖片路徑跟要塞進哪個陣列，抽成同一個函式共用兩次。
    function loadImagesInto(targetArray, srcList) {
        srcList.forEach((src, i) => {
            targetArray[i] = new Image();
            targetArray[i].src = src;
            targetArray[i].onload = onImageLoad;
            targetArray[i].onerror = onImageLoad;
        });
    }

    loadImagesInto(categoryImages, classIds.map(id => `images/class/class_${id}.png`));
    classes.length = 0;
    classes.push(...classIds);
    loadImagesInto(markImages, Marks.map(mark => `images/mark/${mark}.png`));
}
