const PWD_PATH = 'app.auth.console.password';

describe('v1/session/details', () => {
  afterEach(global.mockConfig.reset);

  it('should receive a dummy session for a non secured instance', async () => {
    await global.mockConfig(PWD_PATH, null);
    const res = await global.get(`/api/v1/session`);
    expect(res.success).toBe(true);
    expect(res.data.groups[0]).toBe('*');
  });

  it('should receive an error for a secured instance and no login', async () => {
    await global.mockConfig(PWD_PATH, 'foobar');
    const res = await global.get(`/api/v1/session?q=1`);
    expect(res.success).toBe(false);
    expect(res.errors[0].message).toBe('missing auth token');
  });

  it('should validate a session via Authentication header', async () => {
    await global.mockConfig(PWD_PATH, 'foobar');

    // Obtain a valid session token by authentication method
    const { value: headerName } = await global.getConfig(
      `app.auth.header.name`,
    );
    const r1 = await global.post(`/api/v1/session`, {
      uname: 'console',
      passw: 'foobar',
    });

    // Check the session status by forwarding the session token as a Header
    const headerValue = `Bearer ${r1.data.token}`;
    const r2 = await global.get(`/api/v1/session?q=2`, {
      headers: {
        [headerName]: headerValue,
      },
    });

    expect(r2.success).toBe(true);
    expect(r2.data['x-fetchq-groups'][0]).toBe('*');
  });

  it('should validate a session via Cookie', async () => {
    await global.mockConfig(PWD_PATH, 'foobar');

    // Obtain a valid session token by authentication method
    const { value: cookieName } = await global.getConfig(
      `app.auth.cookie.name`,
    );

    const r1 = await global.post(`/api/v1/session`, {
      uname: 'console',
      passw: 'foobar',
    });

    // Check the session status by forwarding the session token as a Cookie
    const cookieValue = `${cookieName}=${r1.data.token}`;
    const r2 = await global.get(`/api/v1/session?q=2`, {
      headers: {
        Cookie: cookieValue,
      },
    });

    expect(r2.success).toBe(true);
    expect(r2.data['x-fetchq-groups'][0]).toBe('*');
  });

  it('should validate a session via Query', async () => {
    await global.mockConfig(PWD_PATH, 'foobar');

    // Obtain a valid session token by authentication method
    const { value: queryParamName } = await global.getConfig(
      `app.auth.query.param`,
    );

    const r1 = await global.post(`/api/v1/session`, {
      uname: 'console',
      passw: 'foobar',
    });

    // Check the session status by forwarding the session token as a Query
    const queryParam = `${queryParamName}=${r1.data.token}`;
    const r2 = await global.get(`/api/v1/session?${queryParam}`);

    expect(r2.success).toBe(true);
    expect(r2.data['x-fetchq-groups'][0]).toBe('*');
  });

  it('should fail to validate a session with a wrong signature', async () => {
    await global.mockConfig(PWD_PATH, 'foobar');

    const { value: headerName } = await global.getConfig(
      `app.auth.header.name`,
    );
    const r1 = await global.get(`/api/v1/session?q=2`, {
      headers: {
        [headerName]: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJncm91cHMiOlsiKiJdLCJpYXQiOjE1ODM3NDI1NDUsImV4cCI6MTU4Mzc0MjU0N30.D3E7MPe_uB7TrI-gSwh1Ij_8mefX17AjeRqQ434K7yI`,
      },
    });

    // console.log(r.data);
    expect(r1.success).toBe(false);
    expect(r1.errors[0].message).toBe('invalid signature');
  });

  it('should fail to validate a session with an expired token', async () => {
    await global.mockConfig(PWD_PATH, 'foobar');

    const { value: headerName } = await global.getConfig(
      `app.auth.header.name`,
    );
    const r1 = await global.get(`/api/v1/session?q=2`, {
      headers: {
        [headerName]: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJncm91cHMiOlsiKiJdLCJpYXQiOjE1ODM3NDI1NDUsImV4cCI6MTU4Mzc0MjU0N30.a1lfsngErvuS_zrY_iBboIcivcrU-UOGkxb9PwphKcs`,
      },
    });

    expect(r1.success).toBe(false);
    expect(r1.errors[0].message).toBe('invalid signature');
  });
});
