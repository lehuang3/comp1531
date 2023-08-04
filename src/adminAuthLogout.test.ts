import { requestClear, requestAdminAuthRegister, requestAdminAuthLogin, requestAdminAuthLogout, v1requestAdminAuthLogout } from './request';

// Tests to make sure that adminAuthLogin is working correctly when it should and returning errors when it should

beforeEach(() => {
  requestClear();
});
describe('v2 route', () => {
  test('Simple test pass', () => {
    const res = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
    const response = requestAdminAuthLogout(res.body.token);
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
  });

  test('Token is already logout', () => {
    const token1 = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
    requestAdminAuthLogout(token1.body.token);
    const userLogin = requestAdminAuthLogout(token1.body.token);
    expect(userLogin.body).toStrictEqual({ error: 'Not a valid session' });
    expect(userLogin.status).toStrictEqual(403);
  });

  test('Testing token is not a valid structure', () => {
    requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
    const response = requestAdminAuthLogin('patel@gmail.com', 'Abcd173%');
    const userLogin = requestAdminAuthLogout(response.body.token);
    expect(userLogin.body).toStrictEqual({ error: 'Invalid token structure' });
    expect(userLogin.status).toStrictEqual(401);
  });
});

describe('v1 route', () => {
  test('Simple test pass, v1 route', () => {
    const res = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
    const response = v1requestAdminAuthLogout(res.body.token);
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
  });

  test('Token is already logout', () => {
    const token1 = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
    requestAdminAuthLogout(token1.body.token);
    const userLogin = v1requestAdminAuthLogout(token1.body.token);
    expect(userLogin.body).toStrictEqual({ error: 'Not a valid session' });
    expect(userLogin.status).toStrictEqual(403);
  });

  test('Testing token is not a valid structure', () => {
    requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
    const response = requestAdminAuthLogin('patel@gmail.com', 'Abcd173%');
    const userLogin = v1requestAdminAuthLogout(response.body.token);
    expect(userLogin.body).toStrictEqual({ error: 'Invalid token structure' });
    expect(userLogin.status).toStrictEqual(401);
  });
});
