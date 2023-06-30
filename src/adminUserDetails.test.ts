import request from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;
import {adminAuthRegister, adminAuthLogin } from './auth';

function requestClear() {
  const res = request(
    'DELETE',
    SERVER_URL + '/v1/clear',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return JSON.parse(res.body.toString());
}

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
  //console.log(JSON.parse(res.body.toString()));
  return JSON.parse(res.body.toString());
}

let user1;
let userId: number;
beforeEach(() => {
  requestClear();
  user1 = adminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le');
  // authUserId will always be in user1 as adminAuthRegister always succeeds
  // but we need this if statement to bypass typescript
  if ('authUserId' in user1) {
    userId = user1.authUserId;
  }
  
})

test('Check for invalid auth', () => {
  expect(requestGetAdminUserDetails(userId + 1)).toStrictEqual({
    error: 'Not a valid user'
  })
})

test('Check for valid auth', () => {
  expect(requestGetAdminUserDetails(userId)).toStrictEqual({
    user: {
      userId: userId,
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
    expect(requestGetAdminUserDetails(userId)).toStrictEqual({
      user: {
        userId: userId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0
      }
    })

    adminAuthLogin('Minh@gmail.com', '12345abcd')
    expect(requestGetAdminUserDetails(userId)).toStrictEqual({
      user: {
        userId: userId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 1
      }
    })
  })

  test('Failed followed by successful login', () => {
    adminAuthLogin('Minh@gmail.com', '12345abcd')
    expect(requestGetAdminUserDetails(userId)).toStrictEqual({
      user: {
        userId: userId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 1
      }
    })

    adminAuthLogin('Minh@gmail.com', '1234abcd')
    expect(requestGetAdminUserDetails(userId)).toStrictEqual({
      user: {
        userId: userId,
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
    expect(requestGetAdminUserDetails(userId)).toStrictEqual({
      user: {
        userId: userId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0
      }
    })

    adminAuthLogin('Minh@gmaill.com', '1234abcd')
    expect(requestGetAdminUserDetails(userId)).toStrictEqual({
      user: {
        userId: userId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0
      }
    })
  })

  test('Failed followed by successful login', () => {
    adminAuthLogin('Minh@gmaill.com', '1234abcd')
    expect(requestGetAdminUserDetails(userId)).toStrictEqual({
      user: {
        userId: userId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    })

    adminAuthLogin('Minh@gmail.com', '1234abcd')
    expect(requestGetAdminUserDetails(userId)).toStrictEqual({
      user: {
        userId: userId,
        name: 'Minh Le',
        email: 'Minh@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0
      }
    })
  })
})
