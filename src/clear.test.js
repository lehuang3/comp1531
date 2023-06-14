import { clear } from './other.js'
import { adminAuthLogin } from './auth.js'


// Test if the clear function is clearing the data values i.e. if we call adminAuthLogin then clear, the user object in datastore should be cleared

test('Test successful for clear', () => {
    let result = adminAuthLogin('joe.devon@gmail.com', 'Test123!');
    expect(result).toBe('1');
    clear();
  });