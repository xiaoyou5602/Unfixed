# 浏览器 PDF 依赖

- jsPDF 4.2.1：`https://unpkg.com/jspdf@4.2.1/dist/jspdf.umd.min.js`
- 上游：<https://github.com/parallax/jsPDF>
- MIT 许可见 `jspdf.LICENSE`，脚本保留上游许可头。
- html2canvas 1.4.1：`https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js`（npm 包 `html2canvas@1.4.1` 的 `dist/html2canvas.min.js` 原样复制）
- 上游：<https://github.com/niklasvh/html2canvas>
- MIT 许可见 `html2canvas.LICENSE`，脚本保留上游许可头。

两者都只在点“下载 PDF”时从本站加载（`web/js/handbook-pdf.js`），不走第三方 CDN；回答和结果不上传。html2canvas 在页面副本里按打印样式把每章画成图，jsPDF 把这些 JPEG 排进 A4。
