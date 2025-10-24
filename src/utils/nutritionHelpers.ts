export const calculateNutrient = (nutrientValue: number | null, servingSize: number, currentQuantityInGrams: number) => {
  if (nutrientValue === null || !servingSize || !currentQuantityInGrams) return 0;
  return (nutrientValue / servingSize) * currentQuantityInGrams;
};