// ===================================================================================
// imageExport.js - 將 canvas 匯出成圖片，並開啟含上傳/複製功能的預覽頁
// ===================================================================================
import i18n from '../i18n.js';
import { appState } from './state.js';

export function openImage() {
    try {
        const canvas = document.getElementById("canvas");
        const dataUrl = canvas.toDataURL("image/png");
        const win = window.open();
        if (!win) {
            alert(i18n.errorGenerateImage[appState.currentLang] + "（彈出視窗被瀏覽器封鎖，請允許此網站的彈出視窗）");
            return;
        }
        win.document.write(buildImagePreviewHtml(dataUrl));
        win.document.close();
    } catch (e) {
        if (e.name === "SecurityError") alert(i18n.errorSecurity[appState.currentLang]);
        else alert(`${i18n.errorGenerateImage[appState.currentLang]}${e}`);
    }
}

export function buildImagePreviewHtml(dataUrl) {
    const currentLang = appState.currentLang;
    // 統一處理「有翻譯就用翻譯，沒有就用預設字串」，避免每一行都重複同樣的判斷式。
    const translate = (key, fallback) => (i18n[key] && i18n[key][currentLang]) || fallback;
    const t = {
        title: translate('pageTitle', "FGO 五星英靈一覽表"),
        upload: translate('uploadImage', "上傳到 urusai.cc"),
        uploading: translate('uploading', "上傳中…"),
        copy: translate('copyImage', "複製圖片到剪貼簿"),
        copying: translate('copying', "複製中…"),
        uploadSuccess: translate('uploadSuccess', "上傳成功，已在新分頁開啟："),
        uploadFail: translate('errorUploadImage', "上傳失敗："),
        copySuccess: translate('copySuccess', "已複製圖片到剪貼簿"),
        copyFail: translate('errorCopyImage', "複製失敗："),
        copyUnsupported: translate('errorCopyUnsupported', "此瀏覽器不支援直接複製圖片，請改用右鍵另存圖片")
    };

    const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    const escJs = (s) => String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/</g, "\\x3C");

    return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<title>${escAttr(t.title)}</title>
<style>
  body { margin:0; padding:16px; background:#999; font-family: -apple-system, "Microsoft JhengHei", "PingFang TC", sans-serif; text-align:center; }
  .toolbar { margin-bottom:12px; display:flex; flex-wrap:wrap; justify-content:center; gap:8px; }
  .toolbar button { background:#000; color:#fff; border:none; border-radius:22px; padding:12px 20px; font-size:14px; cursor:pointer; letter-spacing: 1px; min-height:44px; }
  .toolbar button:hover:not(:disabled) { background:#2b3033; }
  .toolbar button:disabled { background:#666; cursor:not-allowed; }
  #status { display:block; margin:0 0 12px; font-size:12px; color:#222; min-height:16px; word-break:break-all; }
  #status a { color:#00405c; }
  #status .result-link { display:inline-block; margin-top:8px; padding:9px 18px; background:#000; color:#fff; text-decoration:none; border-radius:20px; font-size:13px; word-break:break-all; }
  #status .result-link:hover { background:#2b3033; }
  #preview-img { max-width:100%; height:auto; display:block; margin:0 auto; box-shadow:0 0 8px rgba(0,0,0,0.4); }
</style>
</head>
<body>
  <div class="toolbar">
    <button id="upload-btn">${escAttr(t.upload)}</button>
    <button id="copy-btn">${escAttr(t.copy)}</button>
  </div>
  <span id="status"></span>
  <img id="preview-img" src="${dataUrl}" alt="${escAttr(t.title)}">
  <script>
  (function () {
    var dataUrl = document.getElementById('preview-img').src;
    var statusEl = document.getElementById('status');
    var uploadBtn = document.getElementById('upload-btn');
    var copyBtn = document.getElementById('copy-btn');
    var LABEL_UPLOAD = '${escJs(t.upload)}';
    var LABEL_UPLOADING = '${escJs(t.uploading)}';
    var LABEL_COPY = '${escJs(t.copy)}';
    var LABEL_COPYING = '${escJs(t.copying)}';
    var MSG_UPLOAD_SUCCESS = '${escJs(t.uploadSuccess)}';
    var MSG_UPLOAD_FAIL = '${escJs(t.uploadFail)}';
    var MSG_COPY_SUCCESS = '${escJs(t.copySuccess)}';
    var MSG_COPY_FAIL = '${escJs(t.copyFail)}';
    var MSG_COPY_UNSUPPORTED = '${escJs(t.copyUnsupported)}';

    function setStatus(html) { statusEl.innerHTML = html || ''; }
    function toOriginalQualityUrl(url) {
      if (!url) return url;
      try {
        var u = new URL(url);
        if (u.hostname.toLowerCase() === 'l.urusai.cc') {
          u.hostname = 'i.urusai.cc';
          return u.toString();
        }
      } catch (e) {}
      return url;
    }

    uploadBtn.addEventListener('click', function () {
      uploadBtn.disabled = true;
      uploadBtn.textContent = LABEL_UPLOADING;
      setStatus('');

      fetch(dataUrl)
        .then(function (r) { return r.blob(); })
        .then(function (blob) {
          var form = new FormData();
          form.append('file', blob, 'fgo-5star.png');
          form.append('r18', '0');
          form.append('token', '');
          form.append('sha256', '');
          return fetch('https://api-v1-t2-upload.urusai.cc', { method: 'POST', body: form });
        })
        .then(function (res) {
          return res.json().then(function (json) {
            if (!res.ok || json.status !== 'success' || !json.data) throw new Error((json && json.message) || 'upload failed');
            return json.data;
          });
        })
        .then(function (data) {
          var link = toOriginalQualityUrl(data.url_direct) || data.url_direct;
          try { window.open(link, '_blank'); } catch (e) {}
          setStatus(MSG_UPLOAD_SUCCESS + '<br><a class="result-link" href="' + link + '" target="_blank" rel="noopener">' + link + '</a>');
        })
        .catch(function (err) {
          setStatus(MSG_UPLOAD_FAIL + (err && err.message ? err.message : err));
        })
        .finally(function () {
          uploadBtn.disabled = false;
          uploadBtn.textContent = LABEL_UPLOAD;
        });
    });

    copyBtn.addEventListener('click', function () {
      if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
        setStatus(MSG_COPY_UNSUPPORTED);
        return;
      }
      copyBtn.disabled = true;
      copyBtn.textContent = LABEL_COPYING;
      setStatus('');

      const blobPromise = fetch(dataUrl).then(function (r) { return r.blob(); });
      navigator.clipboard
        .write([new ClipboardItem({ 'image/png': blobPromise })])
        .then(function () { setStatus(MSG_COPY_SUCCESS); })
        .catch(function (err) { setStatus(MSG_COPY_FAIL + (err && err.message ? err.message : err)); })
        .finally(function () {
          copyBtn.disabled = false;
          copyBtn.textContent = LABEL_COPY;
        });
    });
  })();
  <\/script>
</body>
</html>`;
}
