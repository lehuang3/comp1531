import { AdminAuthRegisterReturn } from './interfaces';
import { adminQuizCreate } from './quiz'
import { requestClear, requestAdminAuthRegister, requestAdminQuizDescriptionUpdate } from './other'
import { read, save } from './other';
import { Data } from './interfaces';
import { response } from 'express';
let token1: AdminAuthRegisterReturn;
let quiz1: any;
let authUserId: number;
beforeEach(() => {
  requestClear()
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body;
  const data: Data = read();
  authUserId = data.tokens.find((existingToken) => existingToken.sessionId === parseInt(token1.token)).authUserId;
  quiz1 = adminQuizCreate(authUserId, 'quiz', '');
})

test('Check for invalid token structure', () => {
  //console.log(token1);
  const token2 = requestAdminAuthRegister('Minh@gmail.com', '', 'Minh', 'Le').body;
  const response = requestAdminQuizDescriptionUpdate(token2, quiz1.quizId, '');
  expect(response.body).toStrictEqual({
    error: 'Invalid token structure',
  });
  expect(response.status).toStrictEqual(401);
});

test('Check for invalid session', () => {
  const token2 = {
    token: (parseInt(token1.token) + 1).toString(),
  }
  
  const response = requestAdminQuizDescriptionUpdate(token2, quiz1.quizId, '');
  expect(response.body).toStrictEqual({
    error: 'Not a valid session'
  });
  expect(response.status).toStrictEqual(403);
});

test('Check for length of description', () => {
  const response = requestAdminQuizDescriptionUpdate(token1, quiz1.quizId, '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
  expect(response.body).toStrictEqual({
    error: 'Description is too long'
  });
  expect(response.status).toStrictEqual(400);
})

test('Check for invalid quiz', () => {
  const response = requestAdminQuizDescriptionUpdate(token1, quiz1.quizId + 1, 'this quiz now has description');
  expect(response.body).toStrictEqual({
    error: 'Not a valid quiz'
  });
  expect(response.status).toStrictEqual(400);
})

test('Check for invalid quiz', () => {
  const token2 = requestAdminAuthRegister('Le@gmail.com', '1234abcd', 'Le', 'Huang').body;
  const response = requestAdminQuizDescriptionUpdate(token2, quiz1.quizId, 'this quiz now has description');
  expect(response.body).toStrictEqual({
    error: 'This quiz is owned by another user'
  });
  expect(response.status).toStrictEqual(400);
})

describe('Check for valid quiz', () => {
  test('Check for valid quiz - description with moderate length', () => {
    const response = requestAdminQuizDescriptionUpdate(token1, quiz1.quizId, 'this quiz now has description');
  	expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
  })

  test('Check for valid quiz - empty description', () => {
    const response = requestAdminQuizDescriptionUpdate(token1, quiz1.quizId, '');
  	expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);

  })
})
