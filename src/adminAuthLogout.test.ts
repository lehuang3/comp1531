import { adminAuthRegister, adminAuthLogin } from './auth.js'
import { requestClear, requestAdminAuthRegister, requestAdminAuthLogin, requestAdminAuthLogout } from './other'

// Tests to make sure that adminAuthLogin is working correctly when it should and returning errors when it should
describe('tests for adminAuthLogout', () => {
  beforeEach(() => {
    requestClear()
  })
  afterAll(() => {
    requestClear()
  })

  describe('adminAuthLogout success tests', () => {
    test('Simple test pass', () => {
      const res = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
      console.log(res.body.token)
      const response = requestAdminAuthLogout(res.body.token);
      expect(response.body).toStrictEqual({});
      expect(response.status).toStrictEqual(200);
    })
  })

  // describe('Testing if user is logged out', () => {    
  //   test('Token is already logout', () => {
  //     const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
  //     requestAdminAuthLogout(response.body.token);
  //     const userLogin = requestAdminAuthLogout(response.body.token);
  //     expect(userLogin.body).toStrictEqual({ error: "User is already logged out" });
  //     expect(userLogin.status).toStrictEqual(400);
  //   })
  // })

  describe('adminAuthLogin invalid password', () => {
    test('Testing token is not a valid structure', () => {
      requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
      // Wrong password
      const response = requestAdminAuthLogin('patel@gmail.com', 'Abcd173%');
      const userLogin = requestAdminAuthLogout(response.body.token);
      expect(userLogin.body).toStrictEqual({ error: "Invalid token structure" });
      expect(userLogin.status).toStrictEqual(401);
    })
  })
})