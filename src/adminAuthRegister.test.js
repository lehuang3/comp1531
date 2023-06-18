import { adminAuthRegister } from './auth.js'
import { clear } from './other.js'

// Test if the adminAuthRegister function is returning errors correctly and passing when it should.
describe('adminAuthRegister tests', () => {
	beforeEach(() => {
		clear();
	});

	describe('Testing valid registrations', () => {
		test('Simple test pass', () => {
			let user = adminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
			expect(user).toStrictEqual({authUserId: expect.any(Number)});
		});

		test('Name assumption pass', () => {
			let user = adminAuthRegister('patel@gmail.com', 'Abcd123%', '       ', '-------');
			expect(user).toStrictEqual({authUserId: expect.any(Number)});
		});
	});

	describe('Testing invalid emails', () => {
		test('Email is used by another user', () => {
			let user = adminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
            expect(user).toStrictEqual({authUserId: expect.any(Number)});
			let invalidUser = adminAuthRegister('patel@gmail.com', 'Vdhr347@', 'Santa', 'Claus');
			expect(invalidUser).toStrictEqual({ error: 'error: email is already used for another account' });
		});

		test('Email is not valid', () => {
			let invalidUser = adminAuthRegister('patel@@gmailcom', 'Vdhr347@', 'Santa', 'Claus');
			expect(invalidUser).toStrictEqual({ error: 'error: email is not valid' });
		});
	});

	describe('Testing invalid first names', () => {
		test('First name contains invalid characters', () => {
			let invalidUser = adminAuthRegister('patel@gmail.com', 'Vdhr347@', '$@nta', 'Claus');
			expect(invalidUser).toStrictEqual({ error: 'error: first name contains invalid characters' });
		});

		test('First name has invalid length', () => {
			let invalidUser = adminAuthRegister('patel@gmail.com', 'Vdhr347@', 'S', 'Claus');
			expect(invalidUser).toStrictEqual({ error: 'error: first name has an invalid length' });
		});
	});

	describe('Testing invalid last names', () => {
		test('Last name contains invalid characters', () => {
			let invalidUser = adminAuthRegister('patel@gmail.com', 'Vdhr347@', 'Santa', 'C!aus');
			expect(invalidUser).toStrictEqual({ error: 'error: last name contains invalid characters' });
		});

		test('Last name has invalid length', () => {
			let invalidUser = adminAuthRegister('patel@gmail.com', 'Vdhr347@', 'Santa', 'Clausandhislittlehelperfriends');
			expect(invalidUser).toStrictEqual({ error: 'error: last name has an invalid length' });
		});
	});

	describe('Testing invalid passwords', () => {
		test('Short password test', () => {
			let invalidUser = adminAuthRegister('patel@gmail.com', 'Ys23&!', 'Santa', 'Claus');
			expect(invalidUser).toStrictEqual({ error: 'error: password is too short' });
		});

		test('Weak password test', () => {
			let invalidUser = adminAuthRegister('patel@gmail.com', 'vdhr@!&hds', 'Santa', 'Claus');
			expect(invalidUser).toStrictEqual({ error: 'error: password is too weak' });
		});
	});
});