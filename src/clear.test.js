import { adminAuthRegister, adminAuthLogin } from './auth.js'
import { clear } from './other.js'

// Test if the clear function is clearing the data values i.e. if we call adminAuthLogin then clear, we should be able to login again as a different user.

test('Test successful for clear', () => {
	adminAuthRegister('santaclaus@gmail.com', 'S@nta23!', 'Santa', 'Claus');
	adminAuthRegister('patel@gmail.com', 'Abcd123!', 'Pranav', 'Patel');
	adminAuthLogin('patel@gmail.com', 'Abcd123!');
	clear();
	let result = adminAuthLogin('santaclaus@gmail.com', 'S@nta23!');
	expect(result).toBe(users.UserID);
});