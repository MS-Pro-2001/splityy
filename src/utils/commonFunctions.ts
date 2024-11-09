export function createUniqueId(prefix: string = 'group'): string {
  const uniqueId = `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  return uniqueId;
}
