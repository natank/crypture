export type ParsedPortfolioItem = {
  asset: string;
  quantity: number;
};

export async function parseImportedFile(
  file: File
): Promise<ParsedPortfolioItem[]> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  const text = await file.text();

  if (extension === "json") {
    return parseJson(text);
  } else if (extension === "csv") {
    return parseCsv(text);
  } else {
    throw new Error("Unsupported file format. Please use CSV or JSON.");
  }
}

// Private helpers
function parseJson(text: string): ParsedPortfolioItem[] {
  let data: unknown;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("⚠️ Invalid JSON file. Please check the file format.");
  }

  if (!Array.isArray(data)) {
    throw new Error("⚠️ JSON must be an array of portfolio items.");
  }

  return data.map((item: any, i: number) => {
    const asset = item?.asset;
    const quantity = item?.quantity;

    if (typeof asset !== "string" || !asset.trim()) {
      throw new Error(`⚠️ Entry ${i + 1}: Asset must be a non-empty string.`);
    }

    const parsedQty = Number(quantity);
    if (isNaN(parsedQty)) {
      throw new Error(`⚠️ Entry ${i + 1}: Quantity must be a valid number.`);
    }

    return {
      asset: asset.toLowerCase(),
      quantity: parsedQty,
    };
  });
}

function parseCsv(text: string): ParsedPortfolioItem[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("⚠️ CSV file is missing data rows.");
  }

  const [headerLine, ...rows] = lines;
  const header = headerLine
    .toLowerCase()
    .split(",")
    .map((h) => h.trim());

  if (!header.includes("asset") || !header.includes("quantity")) {
    throw new Error('⚠️ CSV must include "Asset" and "Quantity" columns.');
  }

  return rows.map((line, i) => {
    const [assetRaw, qtyRaw] = line
      .split(",")
      .map((s) => s.trim().replace(/"/g, ""));

    if (!assetRaw) {
      throw new Error(`⚠️ Row ${i + 2}: Missing asset value.`);
    }

    const quantity = Number(qtyRaw);
    if (isNaN(quantity) || qtyRaw === "") {
      throw new Error(`⚠️ Row ${i + 2}: Quantity must be a number.`);
    }

    return {
      asset: assetRaw.toLowerCase(),
      quantity,
    };
  });
}
