import { isAbsoluteUrl, composeUrl } from './use-axios';

describe('use-axios', () => {
  describe('isAbsoluteUrl()', () => {
    ['http://foobar', 'https://foobar'].forEach((url) =>
      it(`should detect an absolute url: ${url}`, () => {
        const res = isAbsoluteUrl(url);
        expect(res).toBe(true);
      }),
    );

    ['/foobar', '//foobar'].forEach((url) =>
      it(`should detect a relative url: ${url}`, () => {
        const res = isAbsoluteUrl(url);
        expect(res).toBe(false);
      }),
    );
  });

  describe('composeUrl()', () => {
    it(`should remove duplicate "/" from a url`, () => {
      expect(composeUrl('http://foo/', '/bar')).toBe('http://foo/bar');
      expect(composeUrl('http://', '/foobar')).toBe('http://foobar');
      expect(composeUrl('http://', 'foobar')).toBe('http://foobar');
      expect(composeUrl('/', '/foobar')).toBe('/foobar');
      expect(composeUrl('', '//foobar')).toBe('/foobar');
      expect(composeUrl('http://foo/', '/bar/', '/tee')).toBe(
        'http://foo/bar/tee',
      );
      expect(composeUrl('http://foo/', '/bar/', '/tee//')).toBe(
        'http://foo/bar/tee/',
      );
    });
  });
});
