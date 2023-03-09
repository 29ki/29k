export const appendOrigin = (url: string, origin: string) => {
  const urlObject = new URL(url);
  urlObject.searchParams.append('origin', origin);

  return urlObject.toString();
};
