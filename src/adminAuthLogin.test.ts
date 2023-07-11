import { requestClear, requestAdminAuthRegister, requestAdminAuthLogin } from './other';

describe('tests for adminAuthLogin', () => {
  beforeEach(() => {
    requestClear();
    requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
  });

  describe('adminAuthLogin success tests', () => {
    test('Simple test pass', () => {
      const response = requestAdminAuthLogin('patel@gmail.com', 'Abcd123%');
      expect(response.body).toStrictEqual({
        token: expect.any(String)
      });
      expect(response.status).toStrictEqual(200);
    });
  });

  describe('adminAuthLogin invalid email', () => {
    test.each([
      ['santa@claus.com', 'abcd123%'],
      ['21l2@312ail.com', 'SUs'],
      ['pat23@132123ail.com', 'Abcd123%'],
      ['patel@1@ail.com', 'Password']
    ])('Email invalid', (email, password) => {
      const userLogin = requestAdminAuthLogin(email, password);
      expect(userLogin.body).toStrictEqual({ error: 'error: email address is does not exist' });
      expect(userLogin.status).toStrictEqual(400);
    });
  });

  describe('adminAuthLogin invalid password', () => {
    test.each([
      ['patel@gmail.com', 'abcd123%'],
      ['patel@gmail.com', 'notherightpass'],
      ['patel@gmail.com', '34792834792'],
      ['patel@gmail.com', '          ']
    ])('Password incorrect for (%s, %s)', (email, password) => {
      const userLogin = requestAdminAuthLogin(email, password);
      expect(userLogin.body).toStrictEqual({ error: 'error: password incorrect' });
      expect(userLogin.status).toStrictEqual(400);
    });
  });
});
