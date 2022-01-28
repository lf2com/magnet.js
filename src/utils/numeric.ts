const { isNaN } = globalThis;
const { abs } = Math;

export { isNaN, abs };

/**
 * Returns true if source is a number.
 */
export function isnum(n: unknown): n is number {
  return typeof n === 'number';
}

/**
 * Returns number.
 */
export function stdNum(n: number): number {
  if (isNaN(n)) {
    throw new TypeError(`Invalid number: ${n}`);
  }

  return (isnum(n) ? n : Number(n));
}
