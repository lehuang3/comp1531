import { requestClear, requestGetAdminUserDetails, requestAdminAuthRegister, requestAdminAuthLogin, v1requestGetAdminUserDetails } from './request';
let token1: string;
beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
});
describe('v2 route', () => {
  test('Check for invalid token structure', () => {
    const token2 = requestAdminAuthRegister('Minh@gmail.com', '', 'Minh', 'Le').body.token;
    const response = requestGetAdminUserDetails(token2);
    expect(response.body).toStrictEqual({
      error: 'Invalid token structure',
    });
    expect(response.status).toStrictEqual(401);
  });

  test('Check for invalid session', () => {
    const token2 = (parseInt(token1) + 1).toString();

    const response = requestGetAdminUserDetails(token2);
    expect(response.body).toStrictEqual({
      error: 'Not a valid session'
    });
    expect(response.status).toStrictEqual(403);
  });

  test('Check for valid auth', () => {
    const response = requestGetAdminUserDetails(token1);

    expect(response.body).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
    expect(response.status).toStrictEqual(200);
  });

  describe('Check for successful and failed logins due to incorrect password', () => {
    test('Successful followed by failed login', () => {
      requestAdminAuthLogin('Minh@gmail.com', '1234abcd');
      let response = requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0
        }
      });
      expect(response.status).toStrictEqual(200);

      requestAdminAuthLogin('Minh@gmail.com', '12345abcd');
      response = requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 1
        }
      });
      expect(response.status).toStrictEqual(200);
    });

    test('Failed followed by successful login', () => {
      requestAdminAuthLogin('Minh@gmail.com', '12345abcd');
      let response = requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 1
        }
      });
      expect(response.status).toStrictEqual(200);

      requestAdminAuthLogin('Minh@gmail.com', '1234abcd');
      response = requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0
        }
      });
      expect(response.status).toStrictEqual(200);
    });
  });

  describe('Check for successful and failed logins due to incorrect email', () => {
    test('Successful followed by failed login', () => {
      requestAdminAuthLogin('Minh@gmail.com', '1234abcd');
      let response = requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0
        }
      });
      expect(response.status).toStrictEqual(200);

      requestAdminAuthLogin('Minh@gmaill.com', '1234abcd');
      response = requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0
        }
      });
      expect(response.status).toStrictEqual(200);
    });

    test('Failed followed by successful login', () => {
      requestAdminAuthLogin('Minh@gmaill.com', '1234abcd');
      let response = requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0
        }
      });
      expect(response.status).toStrictEqual(200);

      requestAdminAuthLogin('Minh@gmail.com', '1234abcd');
      response = requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0
        }
      });
      expect(response.status).toStrictEqual(200);
    });
  });
})

describe('v1 route', () => {
  test('Check for valid auth, v1 route', () => {
    const response = v1requestGetAdminUserDetails(token1);

    expect(response.body).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
    expect(response.status).toStrictEqual(200);
  });

  test('Check for invalid token structure', () => {
    const token2 = requestAdminAuthRegister('Minh@gmail.com', '', 'Minh', 'Le').body.token;
    const response = v1requestGetAdminUserDetails(token2);
    expect(response.body).toStrictEqual({
      error: 'Invalid token structure',
    });
    expect(response.status).toStrictEqual(401);
  });

  test('Check for invalid session', () => {
    const token2 = (parseInt(token1) + 1).toString();

    const response = v1requestGetAdminUserDetails(token2);
    expect(response.body).toStrictEqual({
      error: 'Not a valid session'
    });
    expect(response.status).toStrictEqual(403);
  });

  describe('Check for successful and failed logins due to incorrect password', () => {
    test('Successful followed by failed login', () => {
      requestAdminAuthLogin('Minh@gmail.com', '1234abcd');
      let response = v1requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0
        }
      });
      expect(response.status).toStrictEqual(200);

      requestAdminAuthLogin('Minh@gmail.com', '12345abcd');
      response = v1requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 1
        }
      });
      expect(response.status).toStrictEqual(200);
    });

    test('Failed followed by successful login', () => {
      requestAdminAuthLogin('Minh@gmail.com', '12345abcd');
      let response = v1requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 1
        }
      });
      expect(response.status).toStrictEqual(200);

      requestAdminAuthLogin('Minh@gmail.com', '1234abcd');
      response = v1requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0
        }
      });
      expect(response.status).toStrictEqual(200);
    });
  });

  describe('Check for successful and failed logins due to incorrect email', () => {
    test('Successful followed by failed login', () => {
      requestAdminAuthLogin('Minh@gmail.com', '1234abcd');
      let response = v1requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0
        }
      });
      expect(response.status).toStrictEqual(200);

      requestAdminAuthLogin('Minh@gmaill.com', '1234abcd');
      response = v1requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0
        }
      });
      expect(response.status).toStrictEqual(200);
    });

    test('Failed followed by successful login', () => {
      requestAdminAuthLogin('Minh@gmaill.com', '1234abcd');
      let response = v1requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0
        }
      });
      expect(response.status).toStrictEqual(200);

      requestAdminAuthLogin('Minh@gmail.com', '1234abcd');
      response = v1requestGetAdminUserDetails(token1);
      expect(response.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Minh Le',
          email: 'Minh@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0
        }
      });
      expect(response.status).toStrictEqual(200);
    });
  });
})