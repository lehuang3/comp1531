import { Console } from 'console';
import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestQuizQuestionCreate, requestAdminQuizSessionStart, requestQuizSessionPlayerJoin, requestAdminQuizSessionState } from './request';
import { string } from 'yaml/dist/schema/common/string';

let token1: string;
let quiz1: number;
let autoStartNum: number;
let sessionId:number;
let sessionId2:number;
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
  autoStartNum = 2;
  sessionId = requestAdminQuizSessionStart(token1, quiz1, autoStartNum).body.sessionId;
  requestQuizSessionPlayerJoin(sessionId, '');
});

test('Not valid quiz', () => {
  const response = requestAdminQuizSessionState(token1, quiz1 + 1, sessionId);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('not a quiz that user owns', () => {
  const token2 = requestAdminAuthRegister('Sinahafezimasoomi@gmail.com', 'Sydneyun2004!', 'Sina', 'Hafezi').body.token;
  const quiz2 = requestAdminQuizCreate(token2, 'quizhello', 'quiz1number').body.quizId;
  const response = requestAdminQuizSessionState(token1, quiz2, sessionId);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('session not in any quiz', () => {
  const response = requestAdminQuizSessionState(token1, quiz1, sessionId + 1);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Success', () => {
  const response = requestAdminQuizSessionState(token1, quiz1, sessionId);
  expect(response.body).toEqual(
    {
      state: expect.any(String),
      atQuestion: expect.any(Number),
      players: expect.any(Array),
      metadata: expect.anything()
    }
  );
  expect(response.status).toStrictEqual(200);
});

test('Invalid token', () => {
  const response = requestAdminQuizSessionState('-1', quiz1, sessionId);
  expect(response.body).toStrictEqual({ error: 'Not a valid session' });
  expect(response.status).toStrictEqual(403);
});

test('Invalid session', () => {
  const invalidToken1 = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy').body.token;
  const response = requestAdminQuizSessionState(invalidToken1, quiz1, sessionId);
  expect(response.body).toStrictEqual({ error: 'Invalid token structure' });
  expect(response.status).toStrictEqual(401);
});