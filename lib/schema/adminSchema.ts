// lib/validations/adminSchemas.ts
import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});
export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});
export const updateSubCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  categoryId: z.string().uuid('Valid categoryId required'),
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

export const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  imageUrl: z.string().url().optional(),
  subCategoryId: z.string().cuid("Invalid subcategory ID").optional(),
});

export const createVariantTypeSchema = z.object({
  name: z.string().min(1),
});

export const updateVariantTypeSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
});

export const createVariantValueSchema = z.object({
  value: z.string().min(1),
  variantTypeId: z.string().uuid().nonempty(),
});

export const updateVariantValueSchema = z.object({
  value: z.string().min(1, 'Value is required'),
});

export const createCombinationSchema = z.object({
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url(),
  variantValueIds: z.array(z.string().uuid()).nonempty(),
});

export const updateCombinationSchema = z.object({
  price: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  imageUrl: z.string().url().optional(),
  variantValueIds: z.array(z.string().uuid()).nonempty().optional(),
});
