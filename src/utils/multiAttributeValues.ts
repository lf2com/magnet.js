const SPLITTER = /[|;,\s]/;

/**
 * Returns splitted values from attribute value.
 */
export function getArrayFromAttributeValue<V extends string>(
  value: string | null,
  indexObject?: Record<string, V>,
): V[] {
  if (value === null) {
    return [];
  }

  const values = value.split(SPLITTER);

  if (indexObject === undefined) {
    return values as V[];
  }

  const indexs = Object.values(indexObject);

  return indexs
    .filter((index) => values.includes(index));
}

/**
 * Returns combined value from array of values.
 */
export function getAttributeValueFromArray<T>(
  value: string | string[],
  indexObject?: T,
): string {
  const values = Array.isArray(value) ? value : [value];

  if (indexObject === undefined) {
    return values.join('|');
  }

  const indexs = Object.values(indexObject);

  return indexs
    .filter((index) => values.includes(index))
    .join('|');
}
