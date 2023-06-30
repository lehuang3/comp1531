import { requestClear, requestAdminAuthRegister } from './other';

// Test if the adminAuthRegister function is returning errors correctly and passing when it should.
describe('adminAuthRegister tests', () => {
  beforeEach(() => {
    requestClear()
  })

  describe('Testing valid registrations', () => {
    test('Simple test pass', () => {
      const token = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel')
      expect(token).toStrictEqual({
        token: expect.any(String),
      })
    })

    test('Name assumption pass', () => {
      const token = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', '       ', '-------')
      expect(token).toStrictEqual({
        token: expect.any(String),
      })
    })
  })

  describe('Testing invalid emails', () => {
    test('Email is used by another user', () => {
      const token = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel')
      expect(token).toStrictEqual({
        token: expect.any(String),
      })
      const invalidUser = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel')
      expect(invalidUser).toStrictEqual({ error: 'error: email is already used for another account' })
    })

    test.each([
        ['patel@@gmail.com'],
        ['ashdaksjdhbmne23sakdasbmail.com'],
        ['sussybaka@amongus'],
        ['randomtester.net.au'],
    ])('Email is not valid, testing: %s', (email) => {
      const invalidUser = requestAdminAuthRegister(email, 'Vdhr347@', 'Santa', 'Claus')
      expect(invalidUser).toStrictEqual({ error: 'error: email is not valid' })
    })
  })

  describe('Testing invalid first names', () => {
    test.each([
        ['$@nta'],
        ['ash83984'],
        ['sussybaka@amongus'],
        ['Pksd&^2.'],
    ])('First name contains invalid characters, testing: %s', (nameFirst) => {
      const invalidUser = requestAdminAuthRegister('patel@gmail.com', 'Vdhr347@', nameFirst, 'Claus')
      expect(invalidUser).toStrictEqual({ error: 'error: first name contains invalid characters' })
    })

    test.each([
        ['L'],
        ['ashdaksjdhbmneeeeeeeeeeeeeeesakdasbmaileqwwwwwwweecom'],
        ['sussybakaamongusuuuuu'],
        ['P'],
    ])('First name has invalid length, testing: %s', (nameFirst) => {
      const invalidUser = requestAdminAuthRegister('patel@gmail.com', 'Vdhr347@', nameFirst, 'Claus')
      expect(invalidUser).toStrictEqual({ error: 'error: first name has an invalid length' })
    })
  })

  describe('Testing invalid last names', () => {
    test.each([
        ['$@nta'],
        ['ashda123123'],
        ['sussybaka@amongus'],
        ['Pksd&^2.'],
    ])('Last name contains invalid characters', (nameLast) => {
      const invalidUser = requestAdminAuthRegister('patel@gmail.com', 'Vdhr347@', 'Santa', nameLast)
      expect(invalidUser).toStrictEqual({ error: 'error: last name contains invalid characters' })
    })

    test.each([
        ['L'],
        ['ashdaksjdhbmneeeeeeeeeeeeeeesakdasbmaileqwwwwwwweecom'],
        ['sussybakaamongusuuuuu'],
        ['P'],
    ])('Last name has invalid length, testing: %s', (nameLast) => {
      const invalidUser = requestAdminAuthRegister('patel@gmail.com', 'Vdhr347@', 'Santa', nameLast)
      expect(invalidUser).toStrictEqual({ error: 'error: last name has an invalid length' })
    })
  })

  describe('Testing invalid passwords', () => {
    test.each([
        ['Ldasjh'],
        ['sWe@y7'],
        ['Pu@19'],
    ])('Short password test, testing: %s ', (password) => {
      const invalidUser = requestAdminAuthRegister('patel@gmail.com', password, 'Santa', 'Claus')
      expect(invalidUser).toStrictEqual({ error: 'error: password is too short' })
    })

    test.each([
        ['Ldasjhirebs'],
        ['swe@yrjdjdjkWw'],
        ['8347983749823649'],
        ['vdhr@!&hds'],
    ])('Weak password test, testing: %s', (password) => {
      const invalidUser = requestAdminAuthRegister('patel@gmail.com', password, 'Santa', 'Claus')
      expect(invalidUser).toStrictEqual({ error: 'error: password is too weak' })
    })
  })
})
