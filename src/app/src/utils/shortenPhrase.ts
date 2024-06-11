export const shortenPhrase = (phrase: string | number, startSymbols = 10, endSymbols = 5): string => {
  const strPhrase = `${phrase}`;

  return strPhrase.length > startSymbols + endSymbols
    ? `${strPhrase.slice(0, startSymbols)}...${strPhrase.slice(strPhrase.length - endSymbols, strPhrase.length)}`
    : strPhrase;
};
