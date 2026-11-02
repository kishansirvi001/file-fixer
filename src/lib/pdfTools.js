import JSZip from "jszip";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

export async function loadPdf(file) {
  return pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
}

export async function downloadPagesAsImages(file, format = "png", onProgress) {
  const pdf = await loadPdf(file);
  const zip = new JSZip();
  const mime = format === "jpg" ? "image/jpeg" : "image/png";
  const ext = format === "jpg" ? "jpg" : "png";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.7 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not create an image canvas.");
    await page.render({ canvasContext: context, viewport }).promise;
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Could not render this page.")), mime, 0.9);
    });
    zip.file(`page-${String(pageNumber).padStart(3, "0")}.${ext}`, blob);
    canvas.width = 0;
    canvas.height = 0;
    onProgress?.(pageNumber, pdf.numPages);
  }

  const output = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(output);
  link.download = `${file.name.replace(/\.pdf$/i, "")}-${format}.zip`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export function extractPdfRows(pdf) {
  return Promise.all(Array.from({ length: pdf.numPages }, async (_, pageIndex) => {
    const page = await pdf.getPage(pageIndex + 1);
    const { items } = await page.getTextContent();
    const rows = new Map();
    for (const item of items) {
      if (!item.str?.trim()) continue;
      const y = Math.round(item.transform[5] / 3) * 3;
      if (!rows.has(y)) rows.set(y, []);
      rows.get(y).push(item);
    }
    return [...rows.entries()]
      .sort(([a], [b]) => b - a)
      .map(([, row]) => {
        row.sort((a, b) => a.transform[4] - b.transform[4]);
        const cells = [];
        let previousRight = null;
        for (const item of row) {
          const x = item.transform[4];
          if (previousRight !== null && x - previousRight > 18) cells.push("");
          cells.push(item.str.trim());
          previousRight = x + item.width;
        }
        return cells;
      });
  }));
}

const escapeXml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&apos;");

export async function createXlsx(rowsByPage) {
  const zip = new JSZip();
  const sheets = rowsByPage.map((rows) => rows.map((row, rowIndex) =>
    `<row r="${rowIndex + 1}">${row.map((value, index) => `<c r="${columnName(index + 1)}${rowIndex + 1}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`).join("")}</row>`
  ).join(""));
  const sheetNames = rowsByPage.map((_, i) => `Sheet${i + 1}`);

  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${sheetNames.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}</Types>`);
  zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`);
  zip.file("xl/workbook.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheetNames.map((name, i) => `<sheet name="${name}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</sheets></workbook>`);
  zip.file("xl/_rels/workbook.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheetNames.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("")}</Relationships>`);
  sheets.forEach((sheet, i) => zip.file(`xl/worksheets/sheet${i + 1}.xml`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheet}</sheetData></worksheet>`));
  return zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

function columnName(number) {
  let name = "";
  while (number > 0) {
    number -= 1;
    name = String.fromCharCode(65 + number % 26) + name;
    number = Math.floor(number / 26);
  }
  return name;
}
