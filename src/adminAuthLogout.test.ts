import { adminAuthRegister, adminAuthLogin } from './auth.js'
import { requestClear, requestAdminAuthRegister, requestAdminAuthLogin, requestAdminAuthLogout } from './other'

// Tests to make sure that adminAuthLogin is working correctly when it should and returning errors when it should

beforeEach(() => {
  requestClear()
})

test('Simple test pass', () => {
  const res = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel')
  const res1 = requestAdminAuthLogin('patel@gmail.com', 'Abcd123%')
  const res2 = requestAdminAuthLogin('patel@gmail.com', 'Abcd123%')
  const res4 = requestAdminAuthRegister('patel12@gmail.com', 'Abcd123%', 'Pranav', 'Patel')
  const response = requestAdminAuthLogout(res.body.token)
  expect(response.body).toStrictEqual({})
  expect(response.status).toStrictEqual(200)
})

test('Token is already logout', () => {
  const token1 = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel')
  const token2 = requestAdminAuthLogin('patel@gmail.com', 'Abcd123%')
  requestAdminAuthLogout(token1.body.token)
  const userLogin = requestAdminAuthLogout(token1.body.token)
  expect(userLogin.body).toStrictEqual({ error: 'Not a valid session' })
  expect(userLogin.status).toStrictEqual(400)
})

test('Testing token is not a valid structure', () => {
  requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel')
  const response = requestAdminAuthLogin('patel@gmail.com', 'Abcd173%')
  const userLogin = requestAdminAuthLogout(response.body.token)
  expect(userLogin.body).toStrictEqual({ error: 'Invalid token structure' })
  expect(userLogin.status).toStrictEqual(401)
})
