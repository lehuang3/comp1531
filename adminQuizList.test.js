import { adminQuizCreate } from './quiz.js';
import { adminAuthRegister } from './auth.js';

// Runs before each test
beforeEach(() => {
  clear();
});

test('Invalide User ID', () => {
  adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
  adminQuizCreate(0, 'Sina',"descruiption");
  expect(adminQuizList(2)).toStrictEqual({ error: expect.any(String) });
});

test('Valid entry', () => {
	adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
  adminQuizCreate(0, 'Sina',"descruiption");
	adminQuizCreate(0, 'Sina1',"descruiption");
  expect(adminQuizList(1)).toStrictEqual({ 
		quizzes: [
			{
				quizId: expect.any(String),
				name: expect.any(Number),
			},
			{
				quizId: expect.any(String),
				name: expect.any(Number),
			}
  	]
	});
});