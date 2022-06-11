export const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const snakeToCamelCase = (str: string) => str.replace(
  /([-_][A-z])/g,
  group => group.toUpperCase()
    .replace('-', '')
    .replace('_', ''),
);
