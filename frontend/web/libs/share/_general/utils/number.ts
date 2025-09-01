export const toNumber = (string?: string): number | undefined => {
  if (!string) return undefined;
  const number = Number(string);
  if (isNaN(number)) return undefined;
  return number;
}