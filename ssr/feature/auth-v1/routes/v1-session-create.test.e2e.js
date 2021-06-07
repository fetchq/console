describe('v1/session/create', () => {
  const PWD_PATH = 'app.auth.console.password';

  const mockPassword = async (value = null) => {
    const { value: currentPassword } = await global.get(
      `/test/config?key=${PWD_PATH}`,
    );
    await global.post(`/test/config`, { key: PWD_PATH, value });

    return (mockPassword.resetMock = () => {
      mockPassword.resetMock = null;
      return global.post(`/test/config`, {
        key: PWD_PATH,
        value: currentPassword,
      });
    });
  };

  afterEach(async () => {
    if (mockPassword.resetMock) {
      await mockPassword.resetMock();
    }
  });

  it('should authenticate without a password', async () => {
    await mockPassword(null);

    const res = await global.rawPost(`/api/v1/session`, {
      uname: 'console',
      passw: '',
    });

    expect(res.data.success).toBe(true);
    expect(res.data.data.groups[0]).toBe('*');
    expect(res.data.data.token.length).toBeGreaterThan(50);
    expect(res.headers['set-cookie'].some(($) => $.includes('auth='))).toBe(
      true,
    );
  });

  it('should authenticate with a custom password', async () => {
    await mockPassword('foobar');
    const res = await global.rawPost(`/api/v1/session`, {
      uname: 'console',
      passw: 'foobar',
    });

    expect(res.data.success).toBe(true);
    expect(res.data.data.groups[0]).toBe('*');
    expect(res.data.data.token.length).toBeGreaterThan(50);
    expect(res.headers['set-cookie'].some(($) => $.includes('auth='))).toBe(
      true,
    );
  });

  it('should deny authentication in case of a custom secret and wrong password', async () => {
    await mockPassword('foobar');
    const res = await global.post(`/api/v1/session`, {
      uname: 'console',
      passw: 'wtf',
    });

    expect(res.success).toBe(false);
    expect(res.errors[0].message).toBe('Authentication failed');
  });

  it('should deny authentication in case of a custom secret and empty password', async () => {
    await mockPassword('foobar');
    const res = await global.post(`/api/v1/session`, {
      uname: 'console',
      passw: '',
    });

    expect(res.success).toBe(false);
    expect(res.errors[0].message).toBe('Authentication failed');
  });

  it('should deny authentication in case of a null secret and wrong', async () => {
    await mockPassword(null);

    const res = await global.post(`/api/v1/session`, {
      uname: 'foobar',
      passw: '',
    });

    expect(res.success).toBe(false);
    expect(res.errors[0].message).toBe('Authentication failed');
  });
});
