// ===================================================================================
// 多國語言資料庫 (i18n) - 純 UI 介面用語
// ===================================================================================
const i18n = {
    // HTML Elements
    pageTitle: {
        "zh-TW": "FGO持有五星英靈一覽表",
        "ja": "FGO所持星5サーヴァント一覧",
        "en": "FGO 5-Star Servant Checklist"
    },
    mainTitle: {
        "zh-TW": "FGO持有五星英靈一覽表",
        "ja": "FGO所持星5サーヴァント一覧",
        "en": "FGO 5-Star Servant Checklist"
    },
    switchAccount: {
        "zh-TW": "切換帳號",
        "ja": "アカウント切替",
        "en": "Switch Account"
    },
    setAmount: {
        "zh-TW": "設定數量",
        "ja": "宝具Lv設定",
        "en": "Set NP Level"
    },
    breakthroughBtn: {
        "zh-TW": "突破按鈕",
        "ja": "限界突破",
        "en": "Max Limit"
    },
    setMark: {
        "zh-TW": "設定標記",
        "ja": "マーク設定",
        "en": "Set Mark"
    },
    resetMark: {
        "zh-TW": "重設標記",
        "ja": "マークリセット",
        "en": "Reset Marks"
    },
    luckyBagValue: {
        "zh-TW": "福袋期望值",
        "ja": "福袋期待値",
        "en": "GSSR Calculator"
    },
    clearAll: {
        "zh-TW": "清空",
        "ja": "リセット",
        "en": "Clear All"
    },
    generateImage: {
        "zh-TW": "產出圖片",
        "ja": "画像生成",
        "en": "Generate Image"
    },
    uploadImage: {
        'zh-TW': '上傳到 urusai.cc',
        'ja': 'urusai.cc にアップロード',
        'en': 'Upload to urusai.cc'
    },
    uploading: {
        'zh-TW': '上傳中…',
        'ja': 'アップロード中…',
        'en': 'Uploading…'
    },
    errorUploadImage: {
        'zh-TW': '上傳圖片失敗：',
        'ja': '画像のアップロードに失敗しました：',
        'en': 'Failed to upload image: '
    },
    copyImage:{
        'zh-TW': '複製圖片到剪貼簿',
        'ja': '画像をクリップボードにコピー',
        'en': 'Copy Image to Clipboard'
    },
    copying:{
        'zh-TW': '複製中…',
        'ja': 'コピー中…',
        'en': 'Copying…'
    },
    uploadSuccess:{
        'zh-TW': '上傳成功，已在新分頁開啟：',
        'ja': 'アップロード成功、新しいタブで開きました：',
        'en': 'Upload successful, opened in a new tab:'
    },
    copySuccess:{
        'zh-TW': '已複製圖片到剪貼簿',
        'ja': '画像をクリップボードにコピーしました',
        'en': 'Image copied to clipboard'
    },
    errorCopyImage:{
        'zh-TW': '複製圖片到剪貼簿失敗：',
        'ja': '画像をクリップボードにコピーするのに失敗しました：',
        'en': 'Failed to copy image to clipboard:'
    },
    errorCopyUnsupported:{
        'zh-TW': '此瀏覽器不支援直接複製圖片，請改用右鍵另存圖片',
        'ja': 'このブラウザは画像の直接コピーをサポートしていません。右クリックで画像を保存してください。',
        'en': 'This browser does not support direct image copying. Please use right-click to save the image.'
    },
    importData: {
        "zh-TW": "匯入資料",
        "ja": "インポート",
        "en": "Import Data"
    },
    exportData: {
        "zh-TW": "匯出資料",
        "ja": "エクスポート",
        "en": "Export Data"
    },
    fourStarLink: {
        "zh-TW": "FGO持有四星英靈一覽表",
        "ja": "FGO所持星4サーヴァント一覧",
        "en": "FGO 4-Star Servant Checklist"
    },
    reportProblem: {
        "zh-TW": "問題回報",
        "ja": "問題報告",
        "en": "Report Issue"
    },
    setLv120: {
        "zh-TW": "設定120等",
        "ja": "Lv120設定",
        "en": "Set Lv 120"
    },
    setCrowned: {
        "zh-TW": "設定戴冠",
        "ja": "戴冠設定",
        "en": "Set Grand"
    },

    // Server / Base Mode Button Labels (常駐按鈕仍保留在此)
    jp_label: { "zh-TW": "日GO", "ja": "日GO", "en": "JP Server" },
    tw_label: { "zh-TW": "台GO", "ja": "台GO", "en": "TW Server" },
    z_label: { "zh-TW": "五星自選(含3000DL)", "ja": "星5選択(3000DL含)", "en": "SSR Ticket (30M DL)" },

    // Canvas Dynamic Text
    npLevelPrefix: { "zh-TW": "寶", "ja": "宝具", "en": "NP" },
    expectNew: { "zh-TW": "新", "ja": "新", "en": "New" },
    expectRegret: { "zh-TW": "盤", "ja": "皿", "en": "Plate" },
    expectLove: { "zh-TW": "婆", "ja": "嫁", "en": "Wife" },
    totalOwned: { "zh-TW": "英靈持有數", "ja": "サーヴァント所持数", "en": "Servants Owned" },
    ownedRate: { "zh-TW": "英靈持有率", "ja": "サーヴァント所持率", "en": "Ownership Rate" },
    totalNPLevel: { "zh-TW": "總寶數", "ja": "宝具レベル合計", "en": "Total NP Levels" },
    totalNP5Owned: { "zh-TW": "寶五持有數", "ja": "宝具5所持数", "en": "NP5 Owned" },
    ownedNP5Rate: { "zh-TW": "寶五持有率", "ja": "宝具5所持率", "en": "NP5 Rate" },

    // Alerts & Prompts
    confirmImport: {
        "zh-TW": "確定要匯入資料嗎？這將會覆寫目前帳號的所有持有和標記資料！此操作無法復原。",
        "ja": "データをインポートしますか？現在のアカウントのすべての所持データとマークが上書きされます！この操作は元に戻せません。",
        "en": "Are you sure you want to import data? This will overwrite all servant data and marks for the current account! This action cannot be undone."
    },
    errorImport: {
        "zh-TW": "檔案讀取或解析失敗，請確認檔案格式是否為正確的 .json 備份檔。",
        "ja": "ファイルの読み込みまたは解析に失敗しました。ファイルが正しい.jsonバックアップファイルであることを確認してください。",
        "en": "Failed to read or parse the file. Please ensure it is a correct .json backup file."
    },
    successImport: {
        "zh-TW": "資料匯入成功！頁面將會重新整理。",
        "ja": "データのインポートが成功しました！ページがリロードされます。",
        "en": "Data imported successfully! The page will now reload."
    },
    alertNpLimit: {
        "zh-TW": "寶具等級上限已切換為: ",
        "ja": "宝具レベルの上限を切り替えました: ",
        "en": "NP level limit has been switched to: "
    },
    confirmClearAll: {
        "zh-TW": "確定要清空這個帳號的所有持有和標記資料嗎？此操作無法復原。",
        "ja": "このアカウントのすべての所持データとマークをリセットしますか？この操作は元に戻せません。",
        "en": "Are you sure you want to clear all servant data and marks for this account? This action cannot be undone."
    },
    confirmResetMark: {
        "zh-TW": "確定要清空這個帳號的所有標記嗎？",
        "ja": "このアカウントのすべてのマークをリセットしますか？",
        "en": "Are you sure you want to clear all marks for this account?"
    },
    errorGenerateImage: {
        "zh-TW": "產出圖片時發生未知錯誤：",
        "ja": "画像生成中に不明なエラーが発生しました：",
        "en": "An unknown error occurred while generating the image: "
    },
    errorSecurity: {
        "zh-TW": "錯誤：無法在本地端直接產出圖片。\n\n原因：瀏覽器基於安全考量，禁止讀取本地圖片檔案後再匯出。\n\n解決方案：請透過本地伺服器 (例如 VS Code 的 'Live Server' 擴充功能) 來瀏覽您的網頁，即可正常使用此功能。",
        "ja": "エラー：ローカル環境で画像を直接生成することはできません。\n\n原因：ブラウザのセキュリティ上の理由により、ローカルファイルの読み込みとエクスポートが制限されています。\n\n解決策：ローカルサーバー（例：VS Codeの「Live Server」拡張機能）経由でページを閲覧すると、この機能が正常に動作します。",
        "en": "Error: Cannot generate image directly from local file system.\n\nReason: For security reasons, browsers restrict reading local files and then exporting them.\n\nSolution: Please view this page via a local server (e.g., the 'Live Server' extension in VS Code) to use this feature correctly."
    },
    loadingImages: {
        "zh-TW": "圖片資源載入中... ",
        "ja": "画像リソースを読み込み中... ",
        "en": "Loading image assets... "
    },
    howToUseNp: {
        "zh-TW": "設定寶具等級: 左鍵增加，右鍵減少。 (從者為寶具0時，右鍵點擊會設為最高等級)，點擊職階圖可有紅底顯示。\n黃框代表120等，藍框代表戴冠，靛藍框代表120等且戴冠。",
        "ja": "宝具レベル設定: 左クリックで増加、右クリックで減少します。(宝具Lv.0の場合、右クリックで最大レベルに設定されます)。クラスアイコンをクリックすると赤背景が表示されます。\n黄色の枠はLv120、青色の枠は戴冠、藍色の枠はLv120かつ戴冠を表します。",
        "en": "Set NP Level: Left-click to increase, right-click to decrease. (If NP0, right-click sets to max level). Click class icon to show red background.\nYellow border indicates Lv 120, blue border indicates Grand, indigo border indicates both Lv 120 and Grand."
    },
    latestUpdate: {
        "zh-TW": "最近更新: 改寫維護邏輯，新增產生圖片後可複製到剪貼簿功能&上傳到 urusai.cc 圖床功能",
        "ja": "最近の更新: メンテナンスロジックを改修し、画像生成後にクリップボードにコピーする機能と urusai.cc へのアップロード機能を追加しました。",
        "en": "Recent Updates: Rewritten maintenance logic, added feature to copy generated image to clipboard & upload to urusai.cc image hosting."
    },
}