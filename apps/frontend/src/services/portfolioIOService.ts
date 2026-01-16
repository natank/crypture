import { z } from "zod";

export type ImportedAsset = { asset: string; quantity: number };

const AssetSchema = z.object({
  asset: z.string().min(1),
  quantity: z.number().finite().nonnegative(),
});

const AssetArraySchema = z.array(AssetSchema).min(1);

export async function parsePortfolioFile(file: File): Promise<ImportedAsset[]> {
  const text = await file.text();
  const ext = file.name.toLowerCase().endsWith(".csv") ? "csv" : file.name.toLowerCase().endsWith(".json") ? "json" : inferFormat(text);

  if (ext === "json") {
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON file");
    }
    const parsed = AssetArraySchema.safeParse(data);
    if (!parsed.success) {
      throw new Error("Invalid portfolio JSON schema");
    }
    return normalizeAssets(parsed.data);
  }

  if (ext === "csv") {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length === 0) throw new Error("CSV file is empty");
    // Expect header with Asset,Quantity
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const assetIdx = header.findIndex((h) => h.startsWith("asset"));
    const qtyIdx = header.findIndex((h) => h.startsWith("quantity"));
    if (assetIdx === -1 || qtyIdx === -1) {
      throw new Error("CSV header must include Asset and Quantity");
    }
    const rows: ImportedAsset[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = splitCsvLine(lines[i]);
      const asset = (cols[assetIdx] || "").trim();
      const quantity = Number((cols[qtyIdx] || "0").replace(/,/g, ""));
      rows.push({ asset: asset.toLowerCase(), quantity });
    }
    const parsed = AssetArraySchema.safeParse(rows);
    if (!parsed.success) {
      throw new Error("Invalid portfolio CSV schema");
    }
    return normalizeAssets(parsed.data);
  }

  throw new Error("Unsupported file format");
}

function inferFormat(text: string): "csv" | "json" {
  const trimmed = text.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) return "json";
  return "csv";
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function normalizeAssets(items: ImportedAsset[]): ImportedAsset[] {
  return items.map((i) => ({ asset: i.asset.toLowerCase(), quantity: i.quantity }));
}
