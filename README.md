# FGO持有五星英靈一覽表 (FGO 5-Star Servant Checklist)

🔗 Site: https://leaflu0315.github.io/fgo/

可製作 FGO 台/日服所持五星英靈一覽表,支援多帳號、120等/戴冠標記、福袋期望值計算,並可產生圖片下載、上傳圖床或直接複製到剪貼簿。

This project lets you build a checklist of your 5-star servants in the Taiwan/Japan version of FGO, with multi-account support, Lv120/Grand tracking, GSSR (lucky bag) expected-value calculation, and image export (download / upload / copy to clipboard).

---

## 功能 (Features)

- **切換帳號 (Switch Account)**
  可在同一瀏覽器內切換兩組獨立帳號的資料,方便同時追蹤多帳號持有狀況。
  Switch between two independent accounts stored locally in the same browser.

- **匯入資料 / 匯出資料 (Import / Export Data)**
  將目前帳號的持有資料匯出成 `.json` 備份檔,或匯入既有備份檔(匯入前會二次確認,避免覆蓋)。
  Export your current account's data as a `.json` backup, or import one (with a confirmation prompt before overwriting).

- **設定數量 (Set NP Level)**
  左鍵增加、右鍵減少寶具等級;寶具 0 時右鍵點擊會直接設為目前上限等級。點擊左側職階圖示可整排標記紅底,方便對照。
  Left-click to increase NP level, right-click to decrease (right-click on NP0 jumps straight to the current max). Click a class icon to highlight its whole row.

- **突破按鈕 (Max Limit / NP20 Toggle)**
  切換寶具等級輸入上限(一般 NP6 / 突破後 NP20),因應寶具突破從者。
  Toggle the NP level input ceiling between 6 and 20, for servants with NP overcharge/limit break.

- **設定120等 / 設定戴冠 (Set Lv120 / Set Grand)**
  可分別標記從者是否已達 120 等或已戴冠;兩者皆滿足時會顯示第三種顏色框(黃框=120等,藍框=戴冠,靛藍框=兩者皆是)。
  Mark a servant as Lv120 and/or Grand (crowned) independently — yellow border for Lv120, blue for Grand, indigo when both apply.

- **設定標記 / 重設標記 (Set Mark / Reset Marks)**
  可為從者加上「不要」或「愛心」標記,方便篩選抽卡結果;也可一鍵清空全部標記。
  Tag servants as unwanted or favorites, with a one-click reset for all marks.

- **福袋期望值 (GSSR Calculator)**
  開啟後會依目前持有狀況,即時算出各職階的「新(未持有機率)」「盤(寶五持有機率)」「婆(愛心機率)」三項期望值;支援歷年福袋名單(含台版/日版限定池)切換計算。
  Calculates real-time "New / Overflow(NP5) / Wife" percentages per class based on your current holdings, and supports switching between multiple historical GSSR (lucky bag) pools, including TW/JP-exclusive ones.

- **產出圖片 (Generate Image)**
  將目前畫面產出成圖片,並在新分頁提供「上傳到 urusai.cc」或「複製圖片到剪貼簿」兩種快速分享方式。
  Renders the current board as an image, opened in a new tab with quick actions to upload to urusai.cc or copy directly to the clipboard.

- **多語言介面 (Multi-language UI)**
  支援繁體中文 / 日本語 / English 介面切換。
  Switch the interface between Traditional Chinese, Japanese, and English.

---

## 使用提示 (Usage Tips)

- 黃框代表 120 等,藍框代表戴冠,靛藍框代表 120 等且戴冠。
  Yellow border = Lv120, blue border = Grand, indigo = both.
- 若瀏覽器封鎖「產出圖片」的彈出視窗,請允許此網站的彈出視窗權限。
  If the image preview popup is blocked, please allow popups for this site.
- 因瀏覽器安全限制,若透過本地端(`file://`)直接開啟網頁,產出圖片功能可能無法使用,建議改用本地伺服器(例如 VS Code 的 "Live Server" 擴充功能)或直接透過 GitHub Pages 瀏覽。
  Due to browser security restrictions, generating images may not work when opening the page directly from the local filesystem (`file://`). Use a local server (e.g. VS Code's "Live Server") or the hosted GitHub Pages site instead.

---

## 專案結構 (Project Structure)

前端邏輯已模組化為 ES Modules,方便維護與擴充:

The frontend logic is organized as native ES Modules for easier maintenance:

```
index.html
i18n.js              # 多國語言字典 (i18n dictionary)
main.css
luckybag.json        # 福袋(GSSR)資料，可獨立新增/更新而不動程式碼
js/
  main.js            # 進入點，組裝所有模組
  state.js           # 常數設定 + 集中管理的可變全域狀態 + 使用者持有資料
  gameData.js         # 靜態圖鑑資料 + 福袋 JSON 動態載入
  storage.js          # 帳號與 localStorage 存取
  imagePreloader.js   # 圖片預載
  fontHelper.js       # 依語言組字型字串
  render.js           # canvas 繪圖邏輯
  interaction.js      # 點擊互動邏輯
  ui.js               # 按鈕綁定
  dataTransfer.js      # 匯入/匯出
  imageExport.js       # 產圖與上傳/複製預覽頁
  i18nHelper.js         # 語言切換
```

要新增一組福袋,只需要編輯 `luckybag.json`,不需要改動任何 JavaScript 程式碼。

To add a new GSSR (lucky bag) pool, simply edit `luckybag.json` — no JavaScript changes required.

---

## 致謝 (Acknowledgements)

感謝原作者之作品:

Thanks to the original author:

https://github.com/mgneko/mgneko.github.io

此版本陸續更新進度,由 LeafLu@ptt 維護。

This version is actively maintained by LeafLu on PTT (Taiwan's largest BBS community).

FGO 四星英靈版本請見: https://leaflu0315.github.io/fgo4s/

See also the 4-star version: https://leaflu0315.github.io/fgo4s/

問題回報 (Report an issue): https://forms.gle/78p1Luysj2qoMEts5