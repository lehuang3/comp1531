import { adminAuthLogin } from './auth';
import { requestClear, requestGetAdminUserDetails, requestAdminAuthRegister } from './other';


let user1;
let authUserId: number;
beforeEach(() => {
  requestClear();
  user1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le');
  // authUserId will always be in user1 as adminAuthRegister always succeeds
  // but we need this if statement to bypass typescript
  if ('authUserId' in user1) {
    authUserId = user1.authUserId;
  }
  
})

test('Check for invalid auth', () => {
  expect(requestGetAdminUserDetails(authUserId + 1)).toStrictEqual({
    error: 'Not a valid user'
  })
})

test('Check for valid auth', () => {
  expect(requestGetAdminUserDetails(authUserId)).toStrictEqual({
    user: {
      userId: authUserId,
      name: 'Minh Le',
      email: 'Minh@gmail.com',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0
    }
  })
})

describe('Check for successful and failed logins due to incorrect password', () => {
  test('Successful followed by failed login', () => {
    adminAuthLogin('Minh@gmail.com', '1234abcd')
    expect(requestGetAdminUserDetails(authUserId)).toStrictEqual({
      user: {
        userId: authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0
      }
    })

    adminAuthLogin('Minh@gmail.com', '12345abcd')
    expect(requestGetAdminUserDetails(authUserId)).toStrictEqual({
      user: {
        userId: authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 1
      }
    })
  })

  test('Failed followed by successful login', () => {
    adminAuthLogin('Minh@gmail.com', '12345abcd')
    expect(requestGetAdminUserDetails(authUserId)).toStrictEqual({
      user: {
        userId: authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 1
      }
    })

    adminAuthLogin('Minh@gmail.com', '1234abcd')
    expect(requestGetAdminUserDetails(authUserId)).toStrictEqual({
      user: {
        userId: authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0
      }
    })
  })
})

describe('Check for successful and failed logins due to incorrect email', () => {
  test('Successful followed by failed login', () => {
    adminAuthLogin('Minh@gmail.com', '1234abcd')
    expect(requestGetAdminUserDetails(authUserId)).toStrictEqual({
      user: {
        userId: authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0
      }
    })

    adminAuthLogin('Minh@gmaill.com', '1234abcd')
    expect(requestGetAdminUserDetails(authUserId)).toStrictEqual({
      user: {
        userId: authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0
      }
    })
  })

  test('Failed followed by successful login', () => {
    adminAuthLogin('Minh@gmaill.com', '1234abcd')
    expect(requestGetAdminUserDetails(authUserId)).toStrictEqual({
      user: {
        userId: authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    })

    adminAuthLogin('Minh@gmail.com', '1234abcd')
    expect(requestGetAdminUserDetails(authUserId)).toStrictEqual({
      user: {
        userId: authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0
      }
    })
  })
})
