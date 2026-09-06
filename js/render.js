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

export function fillCaculate() {
    const { context, canvas, country, CategoryNum, units, marginLeft, currentLang } = appState;
    context.font = getFontString(12);
    var have = 0, haveFull = 0, like = 0, percent = 0, ex = 0, attribute = 0;
    var lucky_bag = (country != 'jp' && country != 'tw' && country != 'z');
    var default_cat1 = lucky_bag ? (CategoryLen - 1) : 7, default_cat2 = lucky_bag ? (CategoryLen - 1) : 6;
    context.fillStyle = bgcolor; context.fillRect(0, 0, caculateField + 10, canvas.height); context.fillStyle = font_color;
    let pass = 0;
    for (var category = 0; category < CategoryLen; category++) {
        if (CategoryNum[category] === 0) { pass++; continue; }
        if (category <= default_cat1) have = 0, haveFull = 0, like = 0;
        for (attribute = 0; attribute < CategoryNum[category]; attribute++) {
            const state = getUnitState(units[category][attribute].no);
            if (state.npLv) { have++; if (state.npLv >= 5) haveFull++; }
            if (state.mark == 2) like++;
        }
        if (category <= default_cat2) {
            if (attribute > 0) {
                const yPos = marginTop + (category - pass) * (CELL_SIZE + row_padding), centerY = yPos + (CELL_SIZE / 2);
                context.textBaseline = 'middle';
                percent = ((1 - (have / attribute)) * 100);
                context.fillText(`${i18n.expectNew[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY - 15);
                percent = (haveFull / units[category].length * 100);
                context.fillText(`${i18n.expectRegret[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY);
                percent = (like / units[category].length * 100);
                context.fillText(`${i18n.expectLove[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY + 15);
                context.textBaseline = 'alphabetic';
            }
        } else { ex += units[category].length; }
    }
    if (!lucky_bag) {
        const yPos = marginTop + 7 * (CELL_SIZE + row_padding), centerY = yPos + (CELL_SIZE / 2);
        context.textBaseline = 'middle';
        percent = ((1 - (have / ex)) * 100);
        context.fillText(`${i18n.expectNew[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY - 15);
        percent = (haveFull / ex * 100);
        context.fillText(`${i18n.expectRegret[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY);
        percent = (like / ex * 100);
        context.fillText(`${i18n.expectLove[currentLang]}:${percent.toFixed(2)}%`, marginLeft - caculateField, centerY + 15);
        context.textBaseline = 'alphabetic';
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

    const line_np5_owned = `${i18n.totalNP5Owned[currentLang]}: ${totalNP5}/${total}`;
    context.fillText(line_np5_owned, xPos, currentY);
    currentY += lineSpacing;

    const line_np5_rate_label = `${i18n.ownedNP5Rate[currentLang]}: `;
    const line_np5_rate_value = `${percentNP5.toFixed(2)}%`;
    let valueColorNP5 = font_color;
    if (percentNP5 >= 100) valueColorNP5 = "gold";
    else if (percentNP5 >= 90) valueColorNP5 = "red";
    else if (percentNP5 >= 75) valueColorNP5 = "purple";
    else if (percentNP5 >= 50) valueColorNP5 = "blue";
    else if (percentNP5 >= 25) valueColorNP5 = "green";

    context.fillStyle = font_color;
    context.fillText(line_np5_rate_label, xPos, currentY);
    const labelWidthNP5 = context.measureText(line_np5_rate_label).width;
    context.fillStyle = valueColorNP5;
    context.fillText(line_np5_rate_value, xPos + labelWidthNP5, currentY);
    currentY += lineSpacing;

    context.fillStyle = font_color;
    const line_total_owned = `${i18n.totalOwned[currentLang]}: ${totalHave}/${total}`;
    context.fillText(line_total_owned, xPos, currentY);
    currentY += lineSpacing;

    const line_owned_rate_label = `${i18n.ownedRate[currentLang]}: `;
    const line_owned_rate_value = `${percent.toFixed(2)}%`;
    let valueColor = font_color;
    if (percent >= 100) valueColor = "gold";
    else if (percent >= 90) valueColor = "red";
    else if (percent >= 75) valueColor = "purple";
    else if (percent >= 50) valueColor = "blue";
    else if (percent >= 25) valueColor = "green";

    context.fillStyle = font_color;
    context.fillText(line_owned_rate_label, xPos, currentY);
    const labelWidthOwned = context.measureText(line_owned_rate_label).width;
    context.fillStyle = valueColor;
    context.fillText(line_owned_rate_value, xPos + labelWidthOwned, currentY);
    currentY += lineSpacing;

    context.fillStyle = font_color;
    const line_total_np = `${i18n.totalNPLevel[currentLang]}: ${totalNP}`;
    context.fillText(line_total_np, xPos, currentY);
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
