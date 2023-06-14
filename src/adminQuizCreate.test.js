import { adminQuizCreate } from './quiz.js';
import { adminAuthRegister } from './auth.js';

// Runs before each test
beforeEach(() => {
  clear();
});

test('Empty name', () => {
	adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
  expect(adminQuizCreate(0, '',"descruiption")).toStrictEqual({ error: expect.any(String) });
});

test('name < 3', () => {
	adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
  expect(adminQuizCreate(0, 'fg',"descruiption")).toStrictEqual({ error: expect.any(String) });
});

test('name > 30', () => {
	adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
  expect(adminQuizCreate(0, 'WhisperingMoonlitMysteries123',"descruiption")).toStrictEqual({ error: expect.any(String) });
});

test('name only has !', () => {
	adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
  expect(adminQuizCreate(0, '!',"descruiption")).toStrictEqual({ error: expect.any(String) });
});

test('name in use', () => {
	adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
	adminQuizCreate(0, 'quiz1',"descruiption")
  expect(adminQuizCreate(0, 'quiz1',"descruiption")).toStrictEqual({ error: expect.any(String) });
});

test('Invalide User ID', () => {
  adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
  expect(adminQuizCreate(2, 'Sina-quiz',"descruiption")).toStrictEqual({ error: expect.any(String) });

});

test('Description > 100', () => {
	adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
  expect(adminQuizCreate(0, 'quiz1',"EnigmaticUniverseSparklingWithInfinitePossibilities1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")).toStrictEqual({ error: expect.any(String) });
});

test('Valid entry', () => {
	adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
  expect(adminQuizCreate(0, 'Sina',"descruiption")).toStrictEqual({ quizId: expect.any(Number) });
});