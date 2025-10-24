import * as z from 'zod';

export const commonServingSchema = z.object({
  unit: z.string().min(1, 'Nome da unidade é obrigatório.'),
  grams: z.coerce.number().min(1, 'Gramas devem ser 1 ou mais.'),
});

export const customFoodSchema = z.object({
  name: z.string().min(2, 'O nome do alimento é obrigatório.'),
  calories: z.coerce.number().min(0, 'Calorias devem ser 0 ou mais.'),
  protein: z.coerce.number().min(0, 'Proteína deve ser 0 ou mais.'),
  carbs: z.coerce.number().min(0, 'Carboidratos devem ser 0 ou mais.'),
  fat: z.coerce.number().min(0, 'Gorduras devem ser 0 ou mais.'),
  serving_size_grams: z.coerce.number().min(1, 'Tamanho da porção padrão deve ser 1g ou mais.'),
  fiber: z.coerce.number().min(0, 'Fibras devem ser 0 ou mais.').nullable().optional(),
  sugar: z.coerce.number().min(0, 'Açúcar deve ser 0 ou mais.').nullable().optional(),
  sodium: z.coerce.number().min(0, 'Sódio deve ser 0 ou mais.').nullable().optional(),
  common_servings: z.array(commonServingSchema).optional(),
});