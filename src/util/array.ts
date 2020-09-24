export const containsAtLeastOneUndefined = (array: string[]): boolean => array.includes(undefined);

// eslint-disable-next-line arrow-body-style
export const containsAtLeastOneDefined = (array: string[]): boolean => {
  return array.findIndex((item) => item !== undefined) !== -1;
};
