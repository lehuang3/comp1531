import { adminAuthRegister, adminAuthLogin } from './auth.js'
import { requestClear, requestAdminAuthRegister, requestAdminAuthLogin, requestAdminAuthPasswordUpdate } from './other'

// Tests to make sure that adminAuthLogin is working correctly when it should and returning errors when it should
describe('tests for adminAuthDetailsUpdate', () => {
  beforeEach(() => {
    requestClear();
    requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
  })

  describe('adminAuthDetailsUpdate success tests', () => {
    test('Simple test pass', () => {
      const res = requestAdminAuthRegister('lain@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
      console.log(res.body)
      const response = requestAdminAuthPasswordUpdate(res.body, 'Abcd123%', 'ADsd&1929');
      expect(response.body).toStrictEqual({});
      expect(response.status).toStrictEqual(200);
    })
  })

  // describe('Testing if user is logged out', () => {    
  //   test.each([
  //       ['abcd1234', 'Dcba$321'],
  //       ['Abcd123%', 'Dcba$32'],
  //       ['Abcd123%', '34628372938'],
  //   ])('Email invalid', (oldPassword, newPassword) => {
  //       requestClear();
  //       const res = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
  //       const userLogin = requestAdminAuthPasswordUpdate(res.body, oldPassword, newPassword);
  //     expect(userLogin.body).toStrictEqual({ error: expect.any(String) });
  //     expect(userLogin.status).toStrictEqual(400);
  //   })
  // })

  // describe('adminAuthDetailsUpdate wrong token struct', () => {
  //   test('Testing token is not a valid structure', () => {
  //       // Wrong password
  //       const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd173%', 'L', 'Cyberia');
  //       const userLogin = requestAdminAuthPasswordUpdate(response.body, 'Abcd173%', 'ADsd&1929');
  //     expect(userLogin.body).toStrictEqual({ error: 'error: token is not valid struct' });
  //     expect(userLogin.status).toStrictEqual(401);
  //   })
  // })

  // describe('adminAuthDetailsUpdate invalid token', () => {
  //   test('Testing token is for logged in session', () => {
  //       // Wrong password
  //       const response = requestAdminAuthLogin('patel@gmail.com', 'Abcd173%');
  //       requestClear();
  //       const userLogin = requestAdminAuthPasswordUpdate(response.body, 'Abcd173%', 'ADsd&1929');
  //     expect(userLogin.body).toStrictEqual({ error: 'error: token is for logged in session' });
  //     expect(userLogin.status).toStrictEqual(401);
  //   })
  // })
})