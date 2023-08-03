import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestQuizQuestionCreate, requestAdminQuizSessionStart } from './request';

let token1: string;
let quiz1: number;
let autoStartNum: number;
beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quizhello', 'quiz1number').body.quizId;
  requestQuizQuestionCreate(token1, quiz1,
    {
      question: 'What is capital of sydney?',
      duration: 5,
      points: 5,
      answers: [
        {
          answer: 'sydney',
          correct: true
        },
        {
          answer: 'Melbourne',
          correct: false
        },
        {
          answer: 'Camberra',
          correct: false
        }

      ],
      thumbnailUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg'
    });
  autoStartNum = 1;
});

test('Check for invalid token structure', () => {
  const token2 = requestAdminAuthRegister('Minh@gmail.com', '', 'Minh', 'Le').body.token;
  const response = requestAdminQuizSessionStart(token2, quiz1, autoStartNum);
  expect(response.body).toStrictEqual({
    error: 'Invalid token structure',
  });
  expect(response.status).toStrictEqual(401);
});

test('Check for invalid session', () => {
  const token2 = (parseInt(token1) + 1).toString();

  const response = requestAdminQuizSessionStart(token2, quiz1, autoStartNum);
  expect(response.body).toStrictEqual({
    error: 'Not a valid session'
  });
  expect(response.status).toStrictEqual(403);
});

test('Invalid quizId', () => {
  const response = requestAdminQuizSessionStart(token1, quiz1 + 1, autoStartNum);
  expect(response.body).toStrictEqual({
    error: 'Quiz does not exist',
  });
  expect(response.status).toStrictEqual(400);
});

test('No permission to view quiz', () => {
  const token2 = requestAdminAuthRegister('Le@gmail.com', '1234abcd', 'Le', 'Huang').body.token;
  const response = requestAdminQuizSessionStart(token2, quiz1, autoStartNum);
  expect(response.body).toStrictEqual({ error: 'You do not have access to this quiz' });
  expect(response.status).toStrictEqual(400);
});

test('autoStartNum > 50', () => {
  autoStartNum = 51;
  const response = requestAdminQuizSessionStart(token1, quiz1, autoStartNum);
  expect(response.body).toStrictEqual({ error: 'Maximum number of users is 50' });
  expect(response.status).toStrictEqual(400);
});

test('Success', () => {
  const response = requestAdminQuizSessionStart(token1, quiz1, autoStartNum);
  expect(response.body).toStrictEqual({
    sessionId: expect.any(Number),
  });
  expect(response.status).toStrictEqual(200);
});

test("Create an 11th session that's not in END state", () => {
  requestAdminQuizSessionStart(token1, quiz1, autoStartNum);
  requestAdminQuizSessionStart(token1, quiz1, autoStartNum);
  requestAdminQuizSessionStart(token1, quiz1, autoStartNum);
  requestAdminQuizSessionStart(token1, quiz1, autoStartNum);
  requestAdminQuizSessionStart(token1, quiz1, autoStartNum);
  requestAdminQuizSessionStart(token1, quiz1, autoStartNum);
  requestAdminQuizSessionStart(token1, quiz1, autoStartNum);
  requestAdminQuizSessionStart(token1, quiz1, autoStartNum);
  requestAdminQuizSessionStart(token1, quiz1, autoStartNum);
  requestAdminQuizSessionStart(token1, quiz1, autoStartNum);
  const response = requestAdminQuizSessionStart(token1, quiz1, autoStartNum);
  expect(response.body).toStrictEqual({ error: 'Exceeded maxinum number of active sessions' });
  expect(response.status).toStrictEqual(400);
});

test('Quiz does not have question', () => {
  const quiz2 = requestAdminQuizCreate(token1, 'quizhello2', 'quiz1number2').body.quizId;
  const response = requestAdminQuizSessionStart(token1, quiz2, autoStartNum);
  expect(response.body).toStrictEqual({ error: 'Quiz does not have any question' });
  expect(response.status).toStrictEqual(400);
});
