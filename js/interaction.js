// ===================================================================================
// interaction.js - 使用者點擊 canvas 的互動邏輯
// ===================================================================================
import { appState, CELL_SIZE, row_padding, col_padding, marginTop, getUnitState, saveUserState } from './state.js';
import { CategoryLen, Marks } from './gameData.js';
import { drawCanvas } from './render.js';

export function getCoordinates(e) {
    const rect = e.target.getBoundingClientRect();
    const scaleX = appState.canvas.width / rect.width;
    const scaleY = appState.canvas.height / rect.height;
    return { 'x': (e.clientX - rect.left) * scaleX, 'y': (e.clientY - rect.top) * scaleY };
}

export function getCategory(y) { return Math.floor((y - marginTop) / (CELL_SIZE + row_padding)); }
export function getAttribute(x) { return Math.floor((x - appState.marginLeft) / (CELL_SIZE + col_padding)); }

export function handleUnitInteraction(event, isRightClick = false) {
    const point = getCoordinates(event);
    let categoryIndex = getCategory(point.y);
    let attributeIndex = getAttribute(point.x);
    const { CategoryNum, units, selectedClasses } = appState;

    let visibleCategoryIndex = 0;
    let actualCategoryIndex = -1;
    for (let i = 0; i < CategoryLen; i++) {
        if (CategoryNum[i] > 0) {
            if (visibleCategoryIndex === categoryIndex) {
                actualCategoryIndex = i;
                break;
            }
            visibleCategoryIndex++;
        }
    }
    if (actualCategoryIndex === -1) return;

    if (attributeIndex === 0) {
        if (isRightClick) return;

        if (selectedClasses.has(actualCategoryIndex)) {
            selectedClasses.delete(actualCategoryIndex);
        } else {
            selectedClasses.add(actualCategoryIndex);
        }
        drawCanvas();
        return;
    }

    categoryIndex = actualCategoryIndex;
    const xInCell = point.x - (attributeIndex * (CELL_SIZE + col_padding) + appState.marginLeft);
    const yInCell = point.y - (getCategory(point.y) * (CELL_SIZE + row_padding) + marginTop);

    if (xInCell < CELL_SIZE && xInCell > 0 && yInCell < CELL_SIZE && yInCell > 0 && attributeIndex > 0 && attributeIndex <= CategoryNum[categoryIndex]) {
        const unit = units[categoryIndex][attributeIndex - 1];
        const state = getUnitState(unit.no);

        switch (appState.mode) {
            case 0:
                if (isRightClick) {
                    if (state.npLv === 0) state.npLv = appState.npLv;
                    else state.npLv--;
                } else {
                    state.npLv = state.npLv < appState.npLv ? state.npLv + 1 : 0;
                }
                break;
            case 1:
                if (isRightClick) state.mark = state.mark > 0 ? state.mark - 1 : Marks.length;
                else state.mark = (state.mark + 1) % (Marks.length + 1);
                break;
            case 2:
                state.lv120 = !state.lv120 ? 1 : 0;
                break;
            case 3:
                state.crowned = !state.crowned ? 1 : 0;
                break;
        }

        saveUserState();
        /* 用整張重繪取代局部重繪：同一個 no（同一位從者）在畫面上可能因為
           資料本身的關係出現在不只一個位置（例如同一個福袋把同一位從者
           同時列在兩個職階底下），局部重繪只會更新被點到的那一格，
           導致另一格顯示過期畫面。整張重繪雖然多做一點工，但能保證
           只要是同一個 no，畫面上所有出現的地方都會同步更新。*/
        drawCanvas();
    }
}

export function rightClick(e) { handleUnitInteraction(e, true); }
export function onCanvasClick(e) { handleUnitInteraction(e, false); }