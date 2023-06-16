import { adminAuthRegister, adminAuthLogin } from './auth.js'
import { clear } from './other.js'

// Tests to make sure that adminAuthLogin is working correctly when it should and returning errors when it should

beforeEach(() => {
	clear();
});

test('Simple test pass', () => {
	adminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
	let userLogin = adminAuthLogin('patel@gmail.com', 'Abcd123%');
	expect(userLogin).toStrictEqual(users.UserID);
});

test('Email invalid', () => {
	adminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
	let userLogin = adminAuthLogin('patel2@gmail.com', 'Abcd123%');
	expect(userLogin).toStrictEqual('error: email address is does not exist');
});

test('Password incorrect', () => {
	adminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
	let userLogin = adminAuthLogin('patel@gmail.com', 'abcd123%');
	expect(userLogin).toStrictEqual('error: password incorrect');
});