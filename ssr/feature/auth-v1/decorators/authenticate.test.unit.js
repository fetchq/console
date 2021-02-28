const { getRequestToken } = require('./authenticate');

describe('authenticateDecorator', () => {
  describe('getRequestToken', () => {
    let getConfig;
    beforeEach(() => {
      getConfig = jest.fn();
      getConfig
        .mockReturnValueOnce('header-name')
        .mockReturnValueOnce('cookie-name')
        .mockReturnValueOnce('param-name');
    });

    it('should get a token from a header', () => {
      const result = getRequestToken({
        getConfig,
        headers: { 'header-name': 'Bearer xxx' },
      });

      expect(result).toBe('xxx');
    });

    it('should get a token from a cookie', () => {
      const result = getRequestToken({
        getConfig,
        headers: {},
        cookies: { 'cookie-name': 'xxx' },
        query: {},
      });

      expect(result).toBe('xxx');
    });

    it('should get a token from the query string', () => {
      const result = getRequestToken({
        getConfig,
        headers: {},
        cookies: {},
        query: { 'param-name': 'xxx' },
      });

      expect(result).toBe('xxx');
    });
  });
});
