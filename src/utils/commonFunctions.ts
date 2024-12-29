import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
export function createUniqueId(): string {
  return uuidv4();
}

export const truncateText = (text: string, maxLength: number = 30) =>
  text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
