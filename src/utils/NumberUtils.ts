export const parseStringToNumber = (string: string) =>
  parseInt(string.replace(/\./g, ''));