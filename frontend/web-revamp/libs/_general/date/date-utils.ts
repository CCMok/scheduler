import { zhHK } from "date-fns/locale";
import { format } from "date-fns";

export const formatDate = (date: Date): string => {
  return format(date, 'PP', { locale: zhHK });
}