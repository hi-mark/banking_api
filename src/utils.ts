export const isPositiveInteger = (n: any): boolean =>
  Number.isInteger(n) && n > 0;

export const isNonNegativeAmount = (v: any): boolean =>
  typeof v === "number" && isFinite(v) && v >= 0 && Number(v.toFixed(2)) === v;

export const isPositiveAmount = (v: any): boolean =>
  typeof v === "number" && isFinite(v) && v > 0 && Number(v.toFixed(2)) === v;
