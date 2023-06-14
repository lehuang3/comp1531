import { adminQuizCreate,adminQuizRemove } from './quiz.js';
import { adminAuthRegister } from './auth.js';
import { clear } from './other.js';

// Runs before each test
beforeEach(() => {
  clear();
});

test('Invalide User ID', () => {
  adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
  adminQuizCreate(0, 'Sina',"descruiption");
  expect(adminQuizRemove(1,0)).toStrictEqual({ error: expect.any(String) });
});

test('Invalide quiz ID', () => {
  adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
  adminQuizCreate(0, 'Sina',"descruiption");
  expect(adminQuizRemove(0,1)).toStrictEqual({ error: expect.any(String) });
});

test('Valid entry', () => {
	adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
  adminQuizCreate(0, 'Sina',"descruiption");
	adminQuizCreate(0, 'Sina1',"descruiption");
  expect(adminQuizRemove(0,0)).toStrictEqual({});
});