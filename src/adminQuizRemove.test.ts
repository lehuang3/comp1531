import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizRemove, v1requestAdminQuizRemove } from './other';

let token1: string;

let quiz: number;
// Runs before each test
beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  quiz = requestAdminQuizCreate(token1, 'quiz1', 'Descritpion').body.quizId;
});

test('Invalide quiz ID', () => {
  const quiz2 = {
    quizId: quiz + 1,
  };
  const response = v1requestAdminQuizRemove(token1, quiz2.quizId);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Invalide User ID', () => {
  const token2 = requestAdminAuthRegister('hayden.hafezimasoomi@gmail.com', '1234abcd', 'hayden', 'Hafezi').body.token;

  const response = requestAdminQuizRemove(token2, quiz);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Invalide quiz ID', () => {
  const quiz2 = {
    quizId: quiz + 1,
  };
  const response = requestAdminQuizRemove(token1, quiz2.quizId);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body.token;
  const response = requestAdminQuizRemove(token4, quiz);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(401);
});

test('Check for invalid session', () => {
  const token2 = (parseInt(token1) + 1).toString();

  const response = requestAdminQuizRemove(token2, quiz);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(403);
});

test('Valid entry', () => {
  const response = requestAdminQuizRemove(token1, quiz);
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
});
