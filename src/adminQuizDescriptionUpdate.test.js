import { adminAuthRegister } from './auth.js';
import { adminQuizCreate, adminQuizDescriptionUpdate } from './quiz.js';
import { clear } from './other.js';

let user1;
let quiz1;

beforeEach(() => {
	clear();
	user1 = adminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le');
	quiz1 = adminQuizCreate(user1.authUserId, 'quiz', '');
});

test('Check for length of description', () => {
  expect(adminQuizDescriptionUpdate(user1.authUserId, quiz1.quizId, '012345678901234567890123456789012345678901234567890123456789012
345678901234567890123456789012345678901234567890123456789')).toStrictEqual({
    error: 'Description is too long',
  });
});

test('Check for invalid auth', () => {
  expect(adminQuizDescriptionUpdate(user1.authUserId + 1, quiz1.quizId, 'this quiz now has description')).toStrictEqual({
    error: 'Not a valid user',
  });
});

test('Check for invalid quiz', () => {
  expect(adminQuizDescriptionUpdate(user1.authUserId, quiz1.quizId + 1, 'this quiz now has description')).toStrictEqual({
    error: 'Not a valid quiz',
  });
});

test('Check for invalid quiz', () => {
	const user2 = adminAuthRegister('Le@gmail.com', '1234abcd', 'Le', 'Huang');
  expect(adminQuizDescriptionUpdate(user2.authUserId, quiz1.quizId, 'this quiz now has description')).toStrictEqual({
    error: 'This quiz is owned by another user',
  });
});

describe('Check for valid quiz', () => {
	test('Check for valid quiz - description with moderate length', () => {
  	expect(adminQuizDescriptionUpdate(user1.authUserId, quiz1.quizId, 'this quiz now has description')).toStrictEqual({});
	});
	
	test('Check for valid quiz - empty description, () => {
  	expect(adminQuizDescriptionUpdate(user1.authUserId, quiz1.quizId, '')).toStrictEqual({});
	});

});


