// ─────────────────────────────────────────────────────────────────────────────
// pdfExtract.js  —  Extract text from PDF files using PDF.js CDN
// ─────────────────────────────────────────────────────────────────────────────

const loadPdfJs = () =>
  new Promise((resolve, reject) => {
    if (window.pdfjsLib) return resolve();
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

export const extractPdfText = async (arrayBuffer) => {
  await loadPdfJs();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let output = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const lines = {};
    content.items.forEach((item) => {
      const y = Math.round(item.transform[5]);
      if (!lines[y]) lines[y] = [];
      lines[y].push(item.str);
    });
    Object.keys(lines)
      .map(Number)
      .sort((a, b) => b - a)
      .forEach((y) => {
        output += lines[y].join(' ').trim() + '\n';
      });
    output += '\n';
  }

  return output.trim();
};
