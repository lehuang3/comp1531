import { AdminAuthRegisterReturn } from './interfaces';
import { adminQuizCreate } from './quiz'
import { requestClear, requestAdminAuthRegister, requestAdminQuizDescriptionUpdate } from './other'
import { read, save } from './other';
import { Data } from './dataStore';
let token1: AdminAuthRegisterReturn;
let quiz1: any;
const data: Data = read();
let authUserId: number;
beforeEach(() => {
  requestClear()
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le');
  authUserId = data.tokens.find((existingToken) => existingToken.sessionId === parseInt(token1.token)).authUserId;
  quiz1 = adminQuizCreate(authUserId, 'quiz', '')
})

test('Check for invalid token structure', () => {
  const token2 = requestAdminAuthRegister('Minh@gmail.com', '', 'Minh', 'Le')
  const response = requestAdminQuizDescriptionUpdate(token2, quiz1.quizId, '');
  expect(response).toStrictEqual({
    error: 'Invalid token structure',
  });
})

test('Check for invalid session', () => {
  const token2 = {
    token: (parseInt(token1.token) + 1).toString(),
  }
  const response = requestAdminQuizDescriptionUpdate(token2, quiz1.quizId, '');
  expect(response).toStrictEqual({
    error: 'Not a valid session'
  })
})

test('Check for length of description', () => {
  expect(requestAdminQuizDescriptionUpdate(token1, quiz1.quizId, '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789')).toStrictEqual({
    error: 'Description is too long'
  })
})

test('Check for invalid quiz', () => {
  expect(requestAdminQuizDescriptionUpdate(token1, quiz1.quizId + 1, 'this quiz now has description')).toStrictEqual({
    error: 'Not a valid quiz'
  })
})

test('Check for invalid quiz', () => {
  const token2 = requestAdminAuthRegister('Le@gmail.com', '1234abcd', 'Le', 'Huang')

  expect(requestAdminQuizDescriptionUpdate(token2, quiz1.quizId, 'this quiz now has description')).toStrictEqual({
    error: 'This quiz is owned by another user'
  })
})

describe('Check for valid quiz', () => {
  test('Check for valid quiz - description with moderate length', () => {
  	expect(requestAdminQuizDescriptionUpdate(token1, quiz1.quizId, 'this quiz now has description')).toStrictEqual({})
  })

  test('Check for valid quiz - empty description', () => {
  	expect(requestAdminQuizDescriptionUpdate(token1, quiz1.quizId, '')).toStrictEqual({})
  })
})
