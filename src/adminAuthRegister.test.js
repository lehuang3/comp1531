import { adminAuthRegister } from './auth.js'
import { getData } from './dataStore.js';
import { clear } from './other.js'

// Test if the adminAuthRegister function is returning errors correctly and passing when it should.

beforeEach(() => {
	clear();
});

test('Simple test pass', () => {
	let store = getData();
    let user = adminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
	expect(user).toStrictEqual(store.UserID);
});

test('Name assumption pass', () => {
	let store = getData();
    let user = adminAuthRegister('patel@gmail.com', 'Abcd123%', '       ', '-------');
	expect(user).toStrictEqual(store.UserID);
});

test('Email is used by another user', () => {
	let user = adminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
	let invalidUser = adminAuthRegister('patel@gmail.com', 'Vdhr347@', 'Santa', 'Claus');
	expect(invalidUser).toStrictEqual({ error: 'error: email is already used for another account' });
});

test('Email is not valid', () => {
	let invalidUser = adminAuthRegister('patel@@gmailcom', 'Vdhr347@', 'Santa', 'Claus');
	expect(invalidUser).toStrictEqual({ error: 'error: email is not valid' });
});

test('First name contains invalid characters', () => {
	let invalidUser = adminAuthRegister('patel@gmail.com', 'Vdhr347@', '$@nta', 'Claus');
	expect(invalidUser).toStrictEqual({ error: 'error: first name contains invalid characters' });
});

test('First name has invalid length', () => {
	let invalidUser = adminAuthRegister('patel@gmail.com', 'Vdhr347@', 'S', 'Claus');
	expect(invalidUser).toStrictEqual({ error: 'error: first name has an invalid length' });
});

test('Last name contains invalid characters', () => {
	let invalidUser = adminAuthRegister('patel@gmail.com', 'Vdhr347@', 'Santa', 'C!aus');
	expect(invalidUser).toStrictEqual({ error: 'error: last name contains invalid characters' });
});

test('Last name has invalid length', () => {
	let invalidUser = adminAuthRegister('patel@gmail.com', 'Vdhr347@', 'Santa', 'Clausandhislittlehelperfriends');
	expect(invalidUser).toStrictEqual({ error: 'error: last name has an invlaid length' });
});

test('Short password test', () => {
	let invalidUser = adminAuthRegister('patel@gmail.com', 'Ys23&!', 'Santa', 'Claus');
	expect(invalidUser).toStrictEqual({ error: 'error: password is too short' });
});

test('Weak password test', () => {
	let invalidUser = adminAuthRegister('patel@gmail.com', 'vdhr@!&hds', '$@nta', 'Claus');
	expect(invalidUser).toStrictEqual({ error: 'error: password is too weak' });
});