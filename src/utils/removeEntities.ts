export const removeEntities = (str: string) => {
  const regex = /&amp;/g;
  return str.replaceAll(regex, '&');
}