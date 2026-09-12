// ===================================================================================
// render.js - canvas 繪圖邏輯 (純畫面呈現，不處理互動)
// ===================================================================================
import i18n from '../i18n.js';
import {
    appState, CELL_SIZE, row_padding, col_padding, caculateField, marginTop,
    bgcolor, mask, font_color, getUnitState
} from './state.js';
import { CategoryLen, FGO_DATA } from './gameData.js';
import { categoryImages, markImages, classes } from './imagePreloader.js';
import { getFontString } from './fontHelper.js';

export function drawCanvas() {
    const { context, canvas, country, CategoryNum, units, marginLeft, selectedClasses, luckyBag, currentLang } = appState;

    context.fillStyle = bgcolor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const currentData = FGO_DATA[country];
    const classIconInfo = currentData.classIconImg;
    let pass = 0;
    for (let i = 0; i < CategoryLen; i++) {
        if (CategoryNum[i] > 0) {
            const yPos = i - pass;
            const rowTopY = yPos * (CELL_SIZE + row_padding) + marginTop;

            if (selectedClasses.has(i)) {
                context.fillStyle = 'rgba(255, 0, 0, 0.3)';
                const highlightX = marginLeft - col_padding / 2;
                const highlightY = rowTopY - (row_padding / 2) + 10;
                const highlightWidth = (CategoryNum[i] + 1) * (CELL_SIZE + col_padding);
                const highlightHeight = CELL_SIZE + row_padding;
                context.fillRect(highlightX, highlightY, highlightWidth, highlightHeight);
            }

            let imgIndex = i;
            if (classIconInfo) {
                let iconId = Array.isArray(classIconInfo) ? classIconInfo[i] : classIconInfo;
                const foundIndex = classes.indexOf(parseInt(iconId));
                if (foundIndex !== -1) imgIndex = foundIndex;
            }
            drawImage(0, yPos, categoryImages[imgIndex]);

            for (let j = 0; j < CategoryNum[i]; j++) {
                const unit = units[i][j];
                const state = getUnitState(unit.no);

                drawImage(j + 1, yPos, unit.image);

                if (!state.npLv) fillRect(j, yPos, mask);
                else fillNPText(j, yPos, `${i18n.npLevelPrefix[currentLang]}${state.npLv}`);

                const is120 = state.lv120;
                const isCrowned = state.crowned;
                if (is120 && isCrowned) {
                    drawUnitBorder(j + 1, yPos, "#39C5BB");
                } else if (is120) {
                    drawUnitBorder(j + 1, yPos, "#FFE211");
                } else if (isCrowned) {
                    drawUnitBorder(j + 1, yPos, "#0000FF");
                }

                if (state.mark) drawImage(j + 1, yPos, markImages[state.mark - 1]);
            }
        } else {
            pass++;
        }
    }
    fillTotalText();
    if (luckyBag) fillCaculate();
    context.font = getFontString(20);
    context.fillStyle = mask;
    context.fillText("This image was made by mgneko, maintained by LeafLu @ ptt", marginLeft, canvas.height - 15);
}

export function drawImage(x, y, image) {
    const { context, marginLeft } = appState;
    const xPos = x * (CELL_SIZE + col_padding) + marginLeft, yPos = y * (CELL_SIZE + row_padding) + marginTop;
    if (image && image.complete && image.naturalHeight !== 0) {
        try { context.drawImage(image, xPos, yPos, CELL_SIZE, CELL_SIZE); }
        catch (e) { console.error("圖片繪製失敗 (catch):", image.src, e); drawPlaceholder(xPos, yPos); }
    } else {
        drawPlaceholder(xPos, yPos);
    }
}

export function drawPlaceholder(xPos, yPos) {
    const { context } = appState;
    context.fillStyle = '#AAA'; context.fillRect(xPos, yPos, CELL_SIZE, CELL_SIZE);
    context.fillStyle = '#FFF'; context.font = `bold ${CELL_SIZE * 0.6}px Arial`; context.textAlign = "center"; context.textBaseline = "middle";
    context.fillText("?", xPos + CELL_SIZE / 2, yPos + CELL_SIZE / 2);
    context.textAlign = "start"; context.textBaseline = "alphabetic";
}

// 畫「新/盤/婆」三行期望值文字。逐職階跟全體加總都是同一套算法跟排版，
// 差別只在傳進來的 have/haveFull/like/total 是哪個範圍的統計。
function drawExpectLines(have, haveFull, like, total, x, centerY) {
    const { context, currentLang } = appState;
    context.textBaseline = 'middle';
    const newPercent = total > 0 ? (1 - have / total) * 100 : 0;
    const regretPercent = total > 0 ? (haveFull / total) * 100 : 0;
    const lovePercent = total > 0 ? (like / total) * 100 : 0;
    context.fillText(`${i18n.expectNew[currentLang]}:${newPercent.toFixed(2)}%`, x, centerY - 15);
    context.fillText(`${i18n.expectRegret[currentLang]}:${regretPercent.toFixed(2)}%`, x, centerY);
    context.fillText(`${i18n.expectLove[currentLang]}:${lovePercent.toFixed(2)}%`, x, centerY + 15);
    context.textBaseline = 'alphabetic';
}

export function fillCaculate() {
    const { context, canvas, country, CategoryNum, units, marginLeft } = appState;
    context.font = getFontString(12);
    let have = 0, haveFull = 0, like = 0, ex = 0, attribute = 0;
    const lucky_bag = (country != 'jp' && country != 'tw' && country != 'z');
    const default_cat1 = lucky_bag ? (CategoryLen - 1) : 7, default_cat2 = lucky_bag ? (CategoryLen - 1) : 6;
    context.fillStyle = bgcolor; context.fillRect(0, 0, caculateField + 10, canvas.height); context.fillStyle = font_color;
    let pass = 0;
    for (let category = 0; category < CategoryLen; category++) {
        if (CategoryNum[category] === 0) { pass++; continue; }
        if (category <= default_cat1) { have = 0; haveFull = 0; like = 0; }
        for (attribute = 0; attribute < CategoryNum[category]; attribute++) {
            const state = getUnitState(units[category][attribute].no);
            if (state.npLv) { have++; if (state.npLv >= 5) haveFull++; }
            if (state.mark == 2) like++;
        }
        if (category <= default_cat2) {
            if (attribute > 0) {
                const yPos = marginTop + (category - pass) * (CELL_SIZE + row_padding), centerY = yPos + (CELL_SIZE / 2);
                drawExpectLines(have, haveFull, like, units[category].length, marginLeft - caculateField, centerY);
            }
        } else {
            ex += units[category].length;
        }
    }
    if (!lucky_bag) {
        const yPos = marginTop + 7 * (CELL_SIZE + row_padding), centerY = yPos + (CELL_SIZE / 2);
        drawExpectLines(have, haveFull, like, ex, marginLeft - caculateField, centerY);
    }
}

export function fillRect(x, y, color) {
    const { context, marginLeft } = appState;
    context.fillStyle = color;
    context.fillRect((x + 1) * (CELL_SIZE + col_padding) + marginLeft, y * (CELL_SIZE + row_padding) + marginTop, CELL_SIZE, CELL_SIZE);
}

export function fillTextMask(x, y, color) {
    const { context, marginLeft } = appState;
    context.fillStyle = color;
    context.fillRect(x * (CELL_SIZE + col_padding) + marginLeft, (y + 1) * (CELL_SIZE + row_padding) - row_padding + marginTop, CELL_SIZE, row_padding);
}

export function fillNPText(x, y, msg) {
    const { context, marginLeft, currentLang } = appState;
    context.font = getFontString(20);
    let number = msg.match(/\d+/)[0];
    context.fillStyle = (number == 5) ? "rgb(255, 255, 0)" : (number >= 6) ? "rgb(255, 0, 0)" : font_color;
    context.textBaseline = 'top';
    const textWidth = context.measureText(msg).width;
    const xPos = (x + 1) * (CELL_SIZE + col_padding) + marginLeft + (CELL_SIZE - textWidth) / 2;
    const yPos = y * (CELL_SIZE + row_padding) + marginTop + CELL_SIZE + 5;
    context.fillText(msg, xPos, yPos);
    context.textBaseline = 'alphabetic';
}

// 依百分比決定顯示顏色的門檻，寶五持有率跟英靈持有率共用同一套規則。
function getRateColor(percent) {
    if (percent >= 100) return "gold";
    if (percent >= 90) return "red";
    if (percent >= 75) return "purple";
    if (percent >= 50) return "blue";
    if (percent >= 25) return "green";
    return font_color;
}

// 畫一行「標籤: 數值%」，數值部分依百分比上色，標籤維持預設文字色。
function drawRateLine(label, percent, x, y) {
    const { context } = appState;
    const labelText = `${label}: `;
    const valueText = `${percent.toFixed(2)}%`;
    context.fillStyle = font_color;
    context.fillText(labelText, x, y);
    const labelWidth = context.measureText(labelText).width;
    context.fillStyle = getRateColor(percent);
    context.fillText(valueText, x + labelWidth, y);
}

export function fillTotalText() {
    const { context, canvas, CategoryNum, units, currentLang } = appState;
    context.font = getFontString(18);

    var totalHave = 0, totalNP = 0, total = 0, totalNP5 = 0;
    for (let i = 0; i < CategoryLen; i++) {
        total += CategoryNum[i];
        for (let j = 0; j < CategoryNum[i]; j++) {
            if (units[i][j]) {
                const state = getUnitState(units[i][j].no);
                totalNP += state.npLv;
                if (state.npLv > 0) totalHave++;
                if (state.npLv >= 5) totalNP5++;
            }
        }
    }
    var percent = total > 0 ? (totalHave / total) * 100 : 0;
    var percentNP5 = total > 0 ? (totalNP5 / total) * 100 : 0;

    let boxWidth;
    switch (currentLang) {
        case 'zh-TW': boxWidth = 220; break;
        case 'en': boxWidth = 260; break;
        case 'ja': boxWidth = 300; break;
        default: boxWidth = 220;
    }

    const boxHeight = 140;
    const boxX = canvas.width - boxWidth;
    const boxY = canvas.height - 170;
    context.fillStyle = bgcolor;
    context.fillRect(boxX, boxY, boxWidth, boxHeight);

    context.textAlign = 'left';
    context.fillStyle = font_color;
    const xPos = boxX + 10;
    const lineSpacing = 25;

    let currentY = boxY + 15;

    context.fillText(`${i18n.totalNP5Owned[currentLang]}: ${totalNP5}/${total}`, xPos, currentY);
    currentY += lineSpacing;

    drawRateLine(i18n.ownedNP5Rate[currentLang], percentNP5, xPos, currentY);
    currentY += lineSpacing;

    context.fillStyle = font_color;
    context.fillText(`${i18n.totalOwned[currentLang]}: ${totalHave}/${total}`, xPos, currentY);
    currentY += lineSpacing;

    drawRateLine(i18n.ownedRate[currentLang], percent, xPos, currentY);
    currentY += lineSpacing;

    context.fillStyle = font_color;
    context.fillText(`${i18n.totalNPLevel[currentLang]}: ${totalNP}`, xPos, currentY);
    context.textAlign = 'start';
}

export function drawUnitBorder(x, y, color) {
    const { context, marginLeft } = appState;
    const xPos = x * (CELL_SIZE + col_padding) + marginLeft;
    const yPos = y * (CELL_SIZE + row_padding) + marginTop;
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.strokeRect(xPos + 1.5, yPos + 1.5, CELL_SIZE - 3, CELL_SIZE - 3);
    context.lineWidth = 1;
}
