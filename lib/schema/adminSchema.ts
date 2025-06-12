// lib/validations/adminSchemas.ts
import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

export const createSubCategorySchema = z.object({
  name: z.string().min(1, 'Subcategory name is required'),
  categoryId: z.string().uuid('Invalid category ID'),
});

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url(),
  subCategoryId: z.string().uuid(),
});

export const createVariantTypeSchema = z.object({
  name: z.string().min(1),
});

export const createVariantValueSchema = z.object({
  value: z.string().min(1),
  variantTypeId: z.string().uuid().nonempty(),
});

export const createCombinationSchema = z.object({
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url(),
  variantValueIds: z.array(z.string().uuid()).nonempty(),
});
