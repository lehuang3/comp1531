import {adminUserDetails, adminAuthRegister, adminAuthLogin} from './auth.js';

	let user1;

beforeEach(() => {
	clear();
	user1 = adminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le');
});

test('Check for invalid auth', () => {
  expect(adminUserDetails(user1.authUserId + 1)).toStrictEqual({
    error: 'Not a valid user',
  })
});

test('Check for valid auth', () => {
  expect(adminUserDetails(user1.authUserId)).toStrictEqual({
    user: {
      userId: user1.authUserId,
      name: 'Minh Le',
      email: 'Minh@gmail.com',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0,
    }
  });
});

describe('Check for successful and failed logins', () => {
	test('Successful followed by failed login', () => {
		adminAuthLogin('Minh@gmail.com', '1234abcd');
		expect(adminUserDetails(user1.authUserId)).toStrictEqual({
			user: {
      userId: user1.authUserId,
      name: 'Minh Le',
      email: 'Minh@gmail.com',
      numSuccessfulLogins: 2,
      numFailedPasswordsSinceLastLogin: 0,
    }
		});
		
		adminAuthLogin('Minh@gmail.com', '12345abcd');
		expect(adminUserDetails(user1.authUserId)).toStrictEqual({
			user: {
      userId: user1.authUserId,
      name: 'Minh Le',
      email: 'Minh@gmail.com',
      numSuccessfulLogins: 2,
      numFailedPasswordsSinceLastLogin: 1,
    }
		});
		
	});
	
	test('Failed followed by successful login', () => {
		adminAuthLogin('Minh@gmail.com', '12345abcd');
		expect(adminUserDetails(user1.authUserId)).toStrictEqual({
			user: {
      userId: user1.authUserId,
      name: 'Minh Le',
      email: 'Minh@gmail.com',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 1,
    }
		});
		
		adminAuthLogin('Minh@gmail.com', '1234abcd');
		expect(adminUserDetails(user1.authUserId)).toStrictEqual({
			user: {
      userId: user1.authUserId,
      name: 'Minh Le',
      email: 'Minh@gmail.com',
      numSuccessfulLogins: 2,
      numFailedPasswordsSinceLastLogin: 0,
    }
		});
		
	});
	
});
