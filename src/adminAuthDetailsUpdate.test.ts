import { requestClear, requestAdminAuthRegister, requestAdminAuthDetailsUpdate } from './other';

let token1: string;
describe('tests for adminAuthDetailsUpdate', () => {
  beforeEach(() => {
    requestClear();
    token1 = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel').body.token;
  });
  test('Simple test pass', () => {
    const res = requestAdminAuthRegister('lain@gmail.com', 'Abcd123%', 'Pranav', 'Patel').body.token;
    const response = requestAdminAuthDetailsUpdate(res, 'santaclaus@gmail.com', 'Santa', 'Claus');
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
  });

  test('email used by another user', () => {
    // Wrong password
    const token2 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
    const userLogin = requestAdminAuthDetailsUpdate(token2, 'patel@gmail.com', 'Santa', 'Claus');
    expect(userLogin.body).toStrictEqual({ error: 'email is already used for another account' });
    expect(userLogin.status).toStrictEqual(400);
  });

  describe('Testing if user is logged out', () => {
    test.each([
      ['portal@gmail.com', 'Portal', 'Gar$en'],
      ['santaclaus@gmail.com', 'Prana^', 'Patel'],
      ['clausanta@gmail.com', 'P', 'Rufus'],
      ['lain@gmail.com', 'Lain', 'Cyireuyjkfkajsgdkajsgu']
    ])('Invalid email/first name/last name', (email, nameFirst, nameLast) => {
      requestClear();
      const res = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel').body.token;
      const userLogin = requestAdminAuthDetailsUpdate(res, email, nameFirst, nameLast);
      expect(userLogin.body).toStrictEqual({ error: expect.any(String) });
      expect(userLogin.status).toStrictEqual(400);
    });
  });
  test('Testing token is not a valid structure', () => {
    // Wrong password
    const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd173%', 'L', 'Cyberia').body.token;
    const userLogin = requestAdminAuthDetailsUpdate(response, 'santaclaus@gmail.com', 'Santa', 'Claus');
    expect(userLogin.body).toStrictEqual({ error: expect.any(String) });
    expect(userLogin.status).toStrictEqual(401);
  });
  test('invalid session', () => {
    const token2 = (parseInt(token1) + 1).toString();
    const response = requestAdminAuthDetailsUpdate(token2, 'santaclaus@gmail.com', 'Santa', 'Claus');
    expect(response.body).toStrictEqual({
      error: 'Not a valid session'
    });
    expect(response.status).toStrictEqual(403);
  });
});
