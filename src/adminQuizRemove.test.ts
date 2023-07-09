import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizRemove } from './other'
import { token } from 'morgan';
let token1: string;

let quiz: any;
// Runs before each test
beforeEach(() => {
  requestClear()
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  quiz = requestAdminQuizCreate(token1, 'quiz1', 'Descritpion').body;
  
})



test('Invalide User ID', () => {
  let token2 = requestAdminAuthRegister('hayden.hafezimasoomi@gmail.com', '1234abcd', 'hayden', 'Hafezi').body.token;
  
  const response = requestAdminQuizRemove(token2, quiz.quizId)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Invalide quiz ID', () => {
  const quiz2 = {
    quizId: quiz.quizId + 1,
  }
  const response = requestAdminQuizRemove(token1, quiz2.quizId)

  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body.token;
  const response = requestAdminQuizRemove(token4, quiz.quizId)
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(401);
})

test('Check for invalid session', () => {
  let token2 = (parseInt(token1) + 1).toString();
  
  const response = requestAdminQuizRemove(token2, quiz.quizId);
  expect(response.body).toStrictEqual({error: expect.any(String)});
  expect(response.status).toStrictEqual(403);
})



test('Valid entry', () => {

  let quiz2 = requestAdminQuizCreate(token1, 'quiz1', 'Descritpion').body.token;

  const response = requestAdminQuizRemove(token1, quiz.quizId);
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
})
