import { adminAuthRegister, adminAuthLogin } from './auth.js'
import { requestClear, requestAdminAuthRegister, requestAdminAuthLogin, requestAdminAuthDetailsUpdate } from './other'

// Tests to make sure that adminAuthLogin is working correctly when it should and returning errors when it should
describe('tests for adminAuthDetailsUpdate', () => {
  beforeEach(() => {
    requestClear();
    requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
  })

  describe('adminAuthLogout success tests', () => {
    test('Simple test pass', () => {
        const res = requestAdminAuthRegister('lain@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
      const response = requestAdminAuthDetailsUpdate(res.body, 'santaclaus@gmail.com', 'Santa', 'Claus');
      expect(response.body).toStrictEqual({});
      expect(response.status).toStrictEqual(200);
    })
  })

  describe('Testing if user is logged out', () => {    
    test.each([
        ['34638', 'portal@gmail.com', 'Portal', 'Gar$en'],
        ['24637', 'patel@gmail.com', 'Patel', 'Norris'],
        ['34892', 'gurgd@@8ey4dn', 'Iris', 'Colour'],
        ['34672', 'santaclaus@gmail.com', 'Prana^', 'Patel'],
        ['53782', 'clausanta@gmail.com', 'P', 'Rufus'],
        ['12833', 'lain@gmail.com', 'Lain', 'Cyireuyjkfkajsgdkajsgu']
    ])('Email invalid', (token, email, nameFirst, nameLast) => {
        const userLogin = requestAdminAuthDetailsUpdate(token, email, nameFirst, nameLast);
      expect(userLogin.body).toStrictEqual({ error: expect.any(String) });
      expect(userLogin.status).toStrictEqual(400);
    })
  })

  describe('adminAuthLogout wrong token struct', () => {
    test('Testing token is not a valid structure', () => {
        // Wrong password
        const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd173%', 'L', 'Cyberia');
        const userLogin = requestAdminAuthDetailsUpdate(response.body, 'santaclaus@gmail.com', 'Santa', 'Claus');
      expect(userLogin.body).toStrictEqual({ error: 'error: token is not valid struct' });
      expect(userLogin.status).toStrictEqual(401);
    })
  })

  describe('adminAuthLogout invalid token', () => {
    test('Testing token is for logged in session', () => {
        // Wrong password
        const response = requestAdminAuthLogin('patel@gmail.com', 'Abcd173%');
        const userLogin = requestAdminAuthDetailsUpdate(response.body, 'santaclaus@gmail.com', 'Santa', 'Claus');
      expect(userLogin.body).toStrictEqual({ error: 'error: token is for logged in session' });
      expect(userLogin.status).toStrictEqual(401);
    })
  })
})