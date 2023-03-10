import {appendOrigin} from './url';

describe('appendOrigin', () => {
  it('adds origin search param to url', () => {
    expect(appendOrigin('https://29k.org', 'interwebz')).toBe(
      'https://29k.org/?origin=interwebz',
    );
  });

  it('throws on invalid URL', () => {
    expect(() => appendOrigin('', 'interwebz')).toThrowError('Invalid URL');
  });
});
