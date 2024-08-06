export const getStringOfMaxLength = (str, maxLength = 15) => {
  if (str.length > maxLength) {
    return `${str.slice(0, maxLength)}...`;
  }
  return str;
};
