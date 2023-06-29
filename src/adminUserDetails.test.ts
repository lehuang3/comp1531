import request from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;
import {adminAuthRegister, adminAuthLogin } from './auth'
import { clear } from './other'

function requestGetAdminUserDetails(authUserId: number) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/user/details',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        authUserId
      }
    }
  );
  return JSON.parse(res.body.toString());
}

let user1:any;

beforeEach(() => {
  clear();
  const user1 = adminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le');
})

test('Check for invalid auth', () => {
  expect(requestGetAdminUserDetails(user1.authUserId + 1)).toStrictEqual({
    error: 'Not a valid user'
  })
})

test('Check for valid auth', () => {
  expect(requestGetAdminUserDetails(user1.authUserId)).toStrictEqual({
    user: {
      userId: user1.authUserId,
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
    expect(requestGetAdminUserDetails(user1.authUserId)).toStrictEqual({
      user: {
        userId: user1.authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0
      }
    })

    adminAuthLogin('Minh@gmail.com', '12345abcd')
    expect(requestGetAdminUserDetails(user1.authUserId)).toStrictEqual({
      user: {
        userId: user1.authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 1
      }
    })
  })

  test('Failed followed by successful login', () => {
    adminAuthLogin('Minh@gmail.com', '12345abcd')
    expect(requestGetAdminUserDetails(user1.authUserId)).toStrictEqual({
      user: {
        userId: user1.authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 1
      }
    })

    adminAuthLogin('Minh@gmail.com', '1234abcd')
    expect(requestGetAdminUserDetails(user1.authUserId)).toStrictEqual({
      user: {
        userId: user1.authUserId,
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
    expect(requestGetAdminUserDetails(user1.authUserId)).toStrictEqual({
      user: {
        userId: user1.authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0
      }
    })

    adminAuthLogin('Minh@gmaill.com', '1234abcd')
    expect(requestGetAdminUserDetails(user1.authUserId)).toStrictEqual({
      user: {
        userId: user1.authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0
      }
    })
  })

  test('Failed followed by successful login', () => {
    adminAuthLogin('Minh@gmaill.com', '1234abcd')
    expect(requestGetAdminUserDetails(user1.authUserId)).toStrictEqual({
      user: {
        userId: user1.authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    })

    adminAuthLogin('Minh@gmail.com', '1234abcd')
    expect(requestGetAdminUserDetails(user1.authUserId)).toStrictEqual({
      user: {
        userId: user1.authUserId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0
      }
    })
  })
})
