import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizTransfer, requestAdminQuizList } from './other';
let token1: string;
let token2: string;
let quiz1: number;

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  token2 = requestAdminAuthRegister('Le@gmail.com', '1234abcd', 'Le', 'Huang').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quiz', '').body.quizId;
});

test('Check for invalid token structure', () => {
  // console.log(token1);
  const invalidToken = requestAdminAuthRegister('Minh@gmail.com', '', 'Minh', 'Le').body.token;
  const response = requestAdminQuizTransfer(invalidToken, quiz1, 'Le@gmail.com');
  expect(response.body).toStrictEqual({
    error: 'Invalid token structure',
  });
  expect(response.status).toStrictEqual(401);
});

test('Check for invalid session', () => {
  const wrongToken = (parseInt(token1) + 2).toString();

  // right structure, but there's no token like this in the tokens array
  const response = requestAdminQuizTransfer(wrongToken, quiz1, 'Le@gmail.com');
  expect(response.body).toStrictEqual({
    error: 'Not a valid session'
  });
  expect(response.status).toStrictEqual(403);
});

test('No permission to view quiz', () => {
  const response = requestAdminQuizTransfer(token2, quiz1, 'Le@gmail.com');
  expect(response.body).toStrictEqual({ error: 'You do not have access to this quiz.' });
  expect(response.status).toStrictEqual(400);
});

test('Invalid quizId', () => {
  const response = requestAdminQuizTransfer(token1, quiz1 + 1, 'Le@gmail.com');
  expect(response.body).toStrictEqual({ error: 'Quiz does not exist.' });
  expect(response.status).toStrictEqual(400);
});

test('Target user does not exist', () => {
  const response = requestAdminQuizTransfer(token1, quiz1, 'Sina@gmail.com');
  expect(response.body).toStrictEqual({ error: 'Target user does not exist' });
  expect(response.status).toStrictEqual(400);
});

test('Target user is original user', () => {
  const response = requestAdminQuizTransfer(token1, quiz1, 'Minh@gmail.com');
  expect(response.body).toStrictEqual({ error: 'Target user is also original user' });
  expect(response.status).toStrictEqual(400);
});

test('test success: Minh => Le', () => {
  const response = requestAdminQuizTransfer(token1, quiz1, 'Le@gmail.com');
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
  const leQuizzes = requestAdminQuizList(token2).body;
  const minhQuizzes = requestAdminQuizList(token1).body;
  expect(leQuizzes.quizzes).toStrictEqual([{
    quizId: quiz1,
    name: expect.any(String),
  }]);
  expect(minhQuizzes.quizzes).toStrictEqual([]);
});

test('test success: Minh => Le then Le => Minh', () => {
  let response = requestAdminQuizTransfer(token1, quiz1, 'Le@gmail.com');
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
  let leQuizzes = requestAdminQuizList(token2).body;
  expect(leQuizzes.quizzes).toStrictEqual([{
    quizId: quiz1,
    name: expect.any(String),
  }]);
  let minhQuizzes = requestAdminQuizList(token1).body;
  expect(minhQuizzes.quizzes).toStrictEqual([]);

  response = requestAdminQuizTransfer(token2, quiz1, 'Minh@gmail.com');
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
  leQuizzes = requestAdminQuizList(token2).body;
  expect(leQuizzes.quizzes).toStrictEqual([]);
  minhQuizzes = requestAdminQuizList(token1).body;
  expect(minhQuizzes.quizzes).toStrictEqual([{
    quizId: quiz1,
    name: expect.any(String),
  }]);
});
