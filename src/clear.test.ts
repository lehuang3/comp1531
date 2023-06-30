import { requestClear, requestAdminAuthRegister, requestAdminAuthLogin } from './other';

// Test if the clear function is clearing the data values i.e. if we call adminAuthLogin then clear, we should be able to login again as a different user.
describe('Testing clear is resetting database', () => {
  beforeEach(() => {
    requestAdminAuthRegister('santaclaus@gmail.com', 'S@nta23!', 'Santa', 'Claus')
    requestClear()
  })

  test('Clear database test 1', () => {
    const result = requestAdminAuthRegister('santaclaus@gmail.com', 'S@nta23!', 'Santa', 'Claus')
    expect(result).toEqual({
      token: expect.any(String),
    })
  })

  test('Clear database test 2', () => {
    requestAdminAuthRegister('patel@gmail.com', 'Abcd123!', 'Pranav', 'Patel')
    const result = requestAdminAuthLogin('santaclaus@gmail.com', 'S@nta23!')
    expect(result).toStrictEqual({ error: 'error: email address is does not exist' })
  })
})

describe('Testing clear return value', () => {
  test('Clear return value test', () => {
    expect(requestClear()).toStrictEqual({})
  })
})
