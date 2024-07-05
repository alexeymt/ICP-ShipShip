export const transformDataToNumber = (date: string) => {
  let divider = '/';
  if (date[2] === '.') {
    divider = '.';
  }
  if (date[2] === '-') {
    divider = '-';
  }

  return date.split(divider).reverse().join('');
};
