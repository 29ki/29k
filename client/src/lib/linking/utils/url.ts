type UtmParameters = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};
export const appendOrigin = (
  url: string,
  origin: string,
  utmParameters?: UtmParameters,
) => {
  const urlObject = new URL(url);
  urlObject.searchParams.append('origin', origin);

  if (utmParameters) {
    Object.entries(utmParameters).forEach(([key, value]) => {
      urlObject.searchParams.append(key, value);
    });
  }

  return urlObject.toString();
};
