export const mergeRecords = <K extends string | number | symbol, V>(
  ...records: Record<K, V>[]
) => {
  const merged: Record<K, V> = {} as Record<K, V>
  for (const record of records) {
    for (const [key, value] of Object.entries<V>(record)) {
      merged[key as K] = value
    }
  }
  return merged
}
