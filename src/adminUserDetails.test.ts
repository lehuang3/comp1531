import { adminAuthLogin } from './auth';
import { requestClear, requestGetAdminUserDetails, requestAdminAuthRegister } from './other';
import HTTPError from 'http-errors';
let token1: string;
beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  // authUserId will always be in user1 as adminAuthRegister always succeeds
  // but we need this if statement to bypass typescript
});

test('Check for invalid token structure', () => {
  const token2 = requestAdminAuthRegister('Minh@gmail.com', '', 'Minh', 'Le').body.token;

  // const response = requestGetAdminUserDetails(token2);
  // expect(response.body).toStrictEqual({
  //   error: 'Invalid token structure',
  // });
  // expect(response.status).toStrictEqual(401);
  expect(() => requestGetAdminUserDetails(token2)).toThrow(HTTPError[401]);
});

test('Check for invalid session', () => {
  const token2 = (parseInt(token1) + 1).toString();

  // const response = requestGetAdminUserDetails(token2);
  // expect(response.body).toStrictEqual({
  //   error: 'Not a valid session'
  // });
  // expect(response.status).toStrictEqual(403);
  expect(() => requestGetAdminUserDetails(token2)).toThrow(HTTPError[403]);
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
    adminAuthLogin('Minh@gmail.com', '1234abcd');
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

    adminAuthLogin('Minh@gmail.com', '12345abcd');
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
    adminAuthLogin('Minh@gmail.com', '12345abcd');
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

    adminAuthLogin('Minh@gmail.com', '1234abcd');
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
    adminAuthLogin('Minh@gmail.com', '1234abcd');
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

    adminAuthLogin('Minh@gmaill.com', '1234abcd');
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
    adminAuthLogin('Minh@gmaill.com', '1234abcd');
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

    adminAuthLogin('Minh@gmail.com', '1234abcd');
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
