import { adminAuthRegister, adminAuthLogin } from './auth.js'
import { requestClear, requestAdminAuthRegister, requestAdminAuthLogin, requestAdminAuthLogout } from './other'

// Tests to make sure that adminAuthLogin is working correctly when it should and returning errors when it should
describe('tests for adminAuthLogout', () => {
  beforeEach(() => {
    requestClear()
  })

  describe('adminAuthLogout success tests', () => {
    test('Simple test pass', () => {
        const res = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
      const response = requestAdminAuthLogout(res.body);
      expect(response.body).toStrictEqual({});
      expect(response.status).toStrictEqual(200);
    })
  })

  describe('Testing if user is logged out', () => {    
    test('Email invalid', () => {
        const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
        requestAdminAuthLogout(response.body);
        const userLogin = requestAdminAuthLogout(response.body);
      expect(userLogin.body).toStrictEqual({ error: 'error: user is already logged out' });
      expect(userLogin.status).toStrictEqual(400);
    })
  })

  describe('adminAuthLogin invalid password', () => {
    test('Testing token is not a valid structure', () => {
        requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
        // Wrong password
        const response = requestAdminAuthLogin('patel@gmail.com', 'Abcd173%');
        const userLogin = requestAdminAuthLogout(response.body);
      expect(userLogin.body).toStrictEqual({ error: 'error: token is not valid struct' });
      expect(userLogin.status).toStrictEqual(401);
    })
  })
})