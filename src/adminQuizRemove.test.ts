import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestadminQuizRemove } from './other'
import { TokenParameter } from './interfaces';
//import { token } from 'morgan';
let token1: TokenParameter;

let quiz: any;
// Runs before each test
beforeEach(() => {
  requestClear()
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body;
  quiz = requestAdminQuizCreate(token1, 'quiz1', 'Descritpion').body;
  
})

test('Invalide User ID', () => {
  console.log(quiz.quizId);
})

test('Invalide User ID', () => {
  let token2 = requestAdminAuthRegister('hayden.hafezimasoomi@gmail.com', 'hayden', 'hayden', 'Hafezi').body;
  const response = requestadminQuizRemove(token2, quiz.quizId)
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})
/*
test('Invalide quiz ID', () => {
  const quiz2 = {
    quizId: (parseInt(quiz.quizId) + 1).toString(),
  }
  const response = requestadminQuizRemove(token1, quiz.quizId)
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body;
  const response = requestadminQuizRemove(token4, quiz.quizId)
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(401);
})

test('Check for invalid session', () => {
  let token2 = {
    token: (parseInt(token1.token) + 1).toString(),
  }
  const response = requestadminQuizRemove(token2, quiz.quizId);
  expect(response.body).toStrictEqual({error: expect.any(String)});
  expect(response.status).toStrictEqual(403);
})



test('Valid entry', () => {

  let quiz2 = requestAdminQuizCreate(token1, 'quiz1', 'Descritpion').body;

  const response = requestadminQuizRemove(token1, quiz.quizId);
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
})
*/