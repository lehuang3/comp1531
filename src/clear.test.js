import { adminAuthRegister, adminAuthLogin } from './auth.js'
import { getData } from './dataStore.js';
import { clear } from './other.js'

// Test if the clear function is clearing the data values i.e. if we call adminAuthLogin then clear, we should be able to login again as a different user.
describe('Testing clear is resetting database', () => {
    test('Clear database test 1', () => {
        adminAuthRegister('santaclaus@gmail.com', 'S@nta23!', 'Santa', 'Claus');
        clear();
        let result = adminAuthRegister('santaclaus@gmail.com', 'S@nta23!', 'Santa', 'Claus');
        expect(result).toEqual(expect.any(Number));
    });
    
    test('Clear database test 2', () => {
        adminAuthRegister('santaclaus@gmail.com', 'S@nta23!', 'Santa', 'Claus');
        adminAuthRegister('patel@gmail.com', 'Abcd123!', 'Pranav', 'Patel');
        adminAuthLogin('patel@gmail.com', 'Abcd123!');
        clear();
        let result = getData();
        expect(result).toStrictEqual({});
    });
});

describe('Testing clear return value', () => {
    test('Clear return value test', () => {        
        expect(clear()).toStrictEqual({});
    });
});
