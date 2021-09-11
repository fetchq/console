const getRequestToken = (request) => {
  const headerName = request.getConfig('app.auth.header.name');
  const cookieName = request.getConfig('app.auth.cookie.name');
  const paramName = request.getConfig('app.auth.query.param');

  if (request.headers[headerName]) {
    return request.headers[headerName].substr(7);
  }
  if (request.cookies[cookieName]) {
    return request.cookies[cookieName];
  }
  if (request.query[paramName]) {
    return request.query[paramName];
  }
};

const authenticateDecorator = async (request, reply) => {
  const password = request.getConfig('app.auth.console.password');
  const jwtScope = request.getConfig('app.auth.jwt.scope');

  // Dynamic session for a non authenticated instance
  if (password === null) {
    request.auth = {
      groups: ['*'],
      secure: false,
      iat: new Date(),
      eat: new Date(Date.now() + 1000 * 60),
    };
    return;
  }

  // Get the JWT token from the request
  const token = getRequestToken(request);
  if (!token) {
    return reply.send({
      success: false,
      errors: [{ message: 'missing auth token' }],
    });
  }

  // Validate the token and export the claims into the request object
  try {
    const payload = await request.jwt.verify(token);
    const jwtClaims = payload[jwtScope];
    request.auth = jwtClaims;
  } catch (err) {
    return reply.send({
      success: false,
      errors: [{ message: err.message }],
    });
  }
};

module.exports = {
  authenticateDecorator,
  getRequestToken,
};
