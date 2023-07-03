import {appendOrigin} from './url';

describe('appendOrigin', () => {
  it('adds origin search param to url', () => {
    expect(appendOrigin('https://29k.org', 'interwebz')).toBe(
      'https://29k.org/?origin=interwebz',
    );
  });

  it('adds utm search params to url', () => {
    expect(
      appendOrigin('https://29k.org', 'interwebz', {
        utm_source: 'utm source',
        utm_medium: 'utm medium',
        utm_campaign: 'utm campaign',
        utm_content: 'utm content',
        utm_term: 'utm term',
      }),
    ).toBe(
      'https://29k.org/?origin=interwebz&utm_source=utm+source&utm_medium=utm+medium&utm_campaign=utm+campaign&utm_content=utm+content&utm_term=utm+term',
    );
  });

  it('throws on invalid URL', () => {
    expect(() => appendOrigin('', 'interwebz')).toThrowError('Invalid URL');
  });
});
