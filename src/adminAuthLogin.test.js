import { adminAuthRegister, adminAuthLogin } from './auth.js'
import { clear } from './other.js'

// Tests to make sure that adminAuthLogin is working correctly when it should and returning errors when it should
describe('tests for adminAuthLogin', () => {
	beforeEach(() => {
		clear();
		adminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
	});

	describe('adminAuthLogin success tests', () => {
		test('Simple test pass', () => {
			let userLogin = adminAuthLogin('patel@gmail.com', 'Abcd123%');
			expect(userLogin).toStrictEqual({ authUserId: expect.any(Number)});
		});
	});

	describe('adminAuthLogin invalid email', () => {
		test('Email invalid', () => {
			let userLogin = adminAuthLogin('patel2@gmail.com', 'Abcd123%');
			expect(userLogin).toStrictEqual({ error: 'error: email address is does not exist' });
		});
	});

	describe('adminAuthLogin invalid password', () => {
		test('Password incorrect', () => {
			let userLogin = adminAuthLogin('patel@gmail.com', 'abcd123%');
			expect(userLogin).toStrictEqual({ error: 'error: password incorrect' });
		});
	});
});