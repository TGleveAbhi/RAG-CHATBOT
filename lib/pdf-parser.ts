import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

const isTextItem = (item: unknown): item is TextItem =>
  typeof item === "object" && item !== null && "str" in item;

export async function parsePdf(buffer: Buffer): Promise<string> {
  const uint8Array = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => (isTextItem(item) ? item.str : ""))
      .join(" ");
    fullText += pageText + "\n";
  }

  return fullText;
}
