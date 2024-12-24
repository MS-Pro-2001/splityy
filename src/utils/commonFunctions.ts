export function createUniqueId(): string {
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return uniqueId;
}

export const truncateText = (text: string, maxLength: number = 30) =>
  text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
