export const getEnumValues = (enumerator: Record<string, string | number>): (string | number)[] => {
  if (!enumerator) {
    return []
  }
  return Object.keys(enumerator)
    .filter((key) => Number.isNaN(Number(key)))
    .map((key) => enumerator[key])
}
