import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizRemove } from './other';
import HTTPError from 'http-errors';
let token1: string;

let quiz: any;
// Runs before each test
beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  quiz = requestAdminQuizCreate(token1, 'quiz1', 'Descritpion').body;
});

test('Invalide User ID', () => {
  const token2 = requestAdminAuthRegister('hayden.hafezimasoomi@gmail.com', '1234abcd', 'hayden', 'Hafezi').body.token;
  expect(() => requestAdminQuizRemove(token2, quiz.quizId)).toThrow(HTTPError[400]);
});

test('Invalide quiz ID', () => {
  const quiz2 = {
    quizId: quiz.quizId + 1,
  };
  expect(() => requestAdminQuizRemove(token1, quiz2.quizId)).toThrow(HTTPError[400]);
});

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body.token;
  expect(() => requestAdminQuizRemove(token4, quiz.quizId)).toThrow(HTTPError[401]);
});

test('Check for invalid session', () => {
  const token2 = (parseInt(token1) + 1).toString();
  expect(() => requestAdminQuizRemove(token2, quiz.quizId)).toThrow(HTTPError[403]);
});

test('Valid entry', () => {
  const response = requestAdminQuizRemove(token1, quiz.quizId);
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
});
