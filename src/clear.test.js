import { adminAuthRegister, adminAuthLogin } from './auth.js'
import { clear } from './other.js'

// Test if the clear function is clearing the data values i.e. if we call adminAuthLogin then clear, we should be able to login again as a different user.
describe('Testing clear is resetting database', () => {
    beforeEach(() => {
        adminAuthRegister('santaclaus@gmail.com', 'S@nta23!', 'Santa', 'Claus');
        clear();
    });
    
    test('Clear database test 1', () => {
        let result = adminAuthRegister('santaclaus@gmail.com', 'S@nta23!', 'Santa', 'Claus');
        expect(result).toEqual(expect.any(Number));
    });
    
    test('Clear database test 2', () => {
        adminAuthRegister('patel@gmail.com', 'Abcd123!', 'Pranav', 'Patel');
        let result = adminAuthLogin('santaclaus@gmail.com', 'S@nta23!');
        expect(result).toStrictEqual({error: 'email is invalid'});
    });
});

describe('Testing clear return value', () => {
    test('Clear return value test', () => {        
        expect(clear()).toStrictEqual({});
    });
});
