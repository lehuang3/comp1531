import { adminAuthRegister, adminAuthLogin } from './auth.js'
import { clear } from './other.js'

// Tests to make sure that adminAuthLogin is working correctly when it should and returning errors when it should
describe('tests for adminAuthLogin', () => {
  beforeEach(() => {
    clear()
    adminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel')
  })

  describe('adminAuthLogin success tests', () => {
    test('Simple test pass', () => {
      const userLogin = adminAuthLogin('patel@gmail.com', 'Abcd123%')
      expect(userLogin).toStrictEqual({ authUserId: expect.any(Number) })
    })
  })

  describe('adminAuthLogin invalid email', () => {
    test.each([
        ['santa@claus.com', 'abcd123%'],
        ['21l2@312ail.com', 'SUs'],
        ['pat23@132123ail.com', 'Abcd123%'],
        ['patel@1@ail.com', 'Password'],
    ])('Email invalid', (email, password) => {
      const userLogin = adminAuthLogin(email, password)
      expect(userLogin).toStrictEqual({ error: 'error: email address is does not exist' })
    })
  })

  describe('adminAuthLogin invalid password', () => {
    test.each([
        ['patel@gmail.com', 'abcd123%'],
        ['patel@gmail.com', 'notherightpass'],
        ['patel@gmail.com', '34792834792'],
        ['patel@gmail.com', '          '],
    ])('Password incorrect for (%s, %s)', (email, password) => {
      const userLogin = adminAuthLogin(email, password)
      expect(userLogin).toStrictEqual({ error: 'error: password incorrect' })
    })
  })
})
