import { adminAuthRegister, adminAuthLogin } from './auth.js'
import { requestClear, requestAdminAuthRegister, requestAdminAuthLogin, requestAdminAuthPasswordUpdate } from './other'

// Tests to make sure that adminAuthLogin is working correctly when it should and returning errors when it should

  beforeEach(() => {
    requestClear();
  })


    test('Simple test pass', () => {
      const res = requestAdminAuthRegister('lain@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
      const response = requestAdminAuthPasswordUpdate(res.body.token, 'Abcd123%', 'ADsd&1929');
      expect(response.body).toStrictEqual({});
      expect(response.status).toStrictEqual(200);
    })


  describe('Testing if user is logged out', () => {    
    test.each([
        ['abcd1234', 'Dcba$321'],
        ['Abcd123%', 'Dcba$32'],
        ['Abcd123%', '34628372938'],
    ])('Email invalid', (oldPassword, newPassword) => {
        requestClear();
        const res = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
        const userLogin = requestAdminAuthPasswordUpdate(res.body.token, oldPassword, newPassword);
      expect(userLogin.body).toStrictEqual({ error: expect.any(String) });
      expect(userLogin.status).toStrictEqual(400);
    })
  })

  describe('adminAuthDetailsUpdate wrong token struct', () => {
    test('Testing token is not a valid structure', () => {
        // Wrong password
        const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd173%', 'L', 'Cyberia');
        const userLogin = requestAdminAuthPasswordUpdate(response.body.token, 'Abcd173%', 'ADsd&1929');
      expect(userLogin.body).toStrictEqual({ error: 'Invalid token structure' });
      expect(userLogin.status).toStrictEqual(401);
    })
  })

  describe('adminAuthDetailsUpdate invalid token', () => {
    test('Testing token is for logged in session', () => {
        // Wrong password
        const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
        requestClear();
        const userLogin = requestAdminAuthPasswordUpdate(response.body.token, 'Abcd173%', 'ADsd&1929');
      expect(userLogin.body).toStrictEqual({ error: 'Not a valid session' });
      expect(userLogin.status).toStrictEqual(401);
    })
  })
