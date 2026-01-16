import { z } from 'zod';
// 🧱 Define the asset validation schema using zod
export const assetSchema = z.object({
  id: z.string().nonempty('Asset ID is required.'),
  name: z.string().nonempty('Asset name is required.'),
  symbol: z.string().nonempty('Asset symbol is required.'),
  quantity: z
    .number({
      required_error: 'Quantity is required.',
      invalid_type_error: 'Quantity must be a number.',
    })
    .positive('Quantity must be a positive number.'),
});

// 📦 Inferred input type
export type AssetInput = z.infer<typeof assetSchema>;

// 🚦 Validator wrapper function
export function validateAsset(input: unknown): {
  valid: boolean;
  errors: { field: string; message: string }[];
} {
  const result = assetSchema.safeParse(input);

  if (result.success) {
    return { valid: true, errors: [] };
  }

  return {
    valid: false,
    errors: result.error.errors.map((e) => ({
      field: e.path[0] as string,
      message: e.message,
    })),
  };
}
