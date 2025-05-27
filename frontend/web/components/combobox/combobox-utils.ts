export const getSelectedItemDisplay = <T,>(
  value: string,
  items: T[],
  getValue: (item: T) => string,
  getDisplayName: (item: T) => string,
): string => {
  if (!value) return '選擇';
  const item = items.find(item => getValue(item) === value)
  return item ? getDisplayName(item) : '';
}