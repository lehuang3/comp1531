import {
  requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestQuizQuestionCreate, requestAdminQuizSessionStart,
  requestAdminQuizSessionStateUpdate, requestQuizSessionPlayerJoin, requestPlayerQuestionInfo, changeState
} from './other';
import { State } from './interfaces';

let token1: string;
let quiz1: number;
let autoStartNum: number;
let session1: any;
let player1: any;
let question1: any;
let question2: any;
beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quizhello', 'quiz1number').body.quizId;
  question1 = requestQuizQuestionCreate(token1, quiz1,
    {
      question: 'What is capital of sydney?',
      duration: 2,
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
    }).body.questionId;
  question2 = requestQuizQuestionCreate(token1, quiz1,
    {
      question: 'What is the cutest animal?',
      duration: 2,
      points: 5,
      answers: [
        {
          answer: 'dogs',
          correct: true
        },
        {
          answer: 'cats',
          correct: true
        }

      ],
      thumbnailUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg'
    }).body.questionId;
  autoStartNum = 1;
  session1 = requestAdminQuizSessionStart(token1, quiz1, autoStartNum).body.sessionId;
  player1 = requestQuizSessionPlayerJoin(session1, 'Minh').body.playerId;
});

test('Invalid playerId', () => {
  const response = requestPlayerQuestionInfo(player1 + 1, 1);
  expect(response.body).toStrictEqual({
    error: 'Player does not exist',
  });
  expect(response.status).toStrictEqual(400);
});

test('Invalid question position', () => {
  let response = requestPlayerQuestionInfo(player1, 3);
  expect(response.body).toStrictEqual({
    error: 'Question is not valid for this session',
  });
  expect(response.status).toStrictEqual(400);

  response = requestPlayerQuestionInfo(player1, 0);
  expect(response.body).toStrictEqual({
    error: 'Question is not valid for this session',
  });
  expect(response.status).toStrictEqual(400);
});

test('Session is not up to this question yet', () => {
  let response = requestPlayerQuestionInfo(player1, 2);
  expect(response.body).toStrictEqual({
    error: 'Session is not currently on this question',
  });
  expect(response.status).toStrictEqual(400);
  // increment atQuestion by 1
  requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
  requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
  response = requestPlayerQuestionInfo(player1, 1);
  expect(response.body).toStrictEqual({
    error: 'Session is not currently on this question',
  });
  expect(response.status).toStrictEqual(400);
});

test('Session is in LOBBY or END state', () => {
  changeState(session1, State.LOBBY);
  let response = requestPlayerQuestionInfo(player1, 1);
  expect(response.body).toStrictEqual({
    error: 'Session is in LOBBY or END state',
  });
  expect(response.status).toStrictEqual(400);
  changeState(session1, State.END);
  response = requestPlayerQuestionInfo(player1, 1);
  expect(response.body).toStrictEqual({
    error: 'Session is in LOBBY or END state',
  });
  expect(response.status).toStrictEqual(400);
});

test('success', () => {
  let response = requestPlayerQuestionInfo(player1, 1);
  expect(response.body).toStrictEqual({
    questionId: question1,
    question: 'What is capital of sydney?',
    duration: 2,
    thumbnailUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg',
    points: 5,
    answers: [
      {
        answerId: expect.any(Number),
        answer: 'sydney',
        color: expect.any(String),
      },
      {
        answerId: expect.any(Number),
        answer: 'Melbourne',
        color: expect.any(String),
      },
      {
        answerId: expect.any(Number),
        answer: 'Camberra',
        color: expect.any(String),
      }
    ],
  });
  expect(response.status).toStrictEqual(200);

  // increment atQuestion by 1
  requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
  requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
  response = requestPlayerQuestionInfo(player1, 2);
  expect(response.body).toStrictEqual({
    questionId: question2,
    question: 'What is the cutest animal?',
    duration: 2,
    thumbnailUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg',
    points: 5,
    answers: [
      {
        answerId: expect.any(Number),
        answer: 'dogs',
        color: expect.any(String),
      },
      {
        answerId: expect.any(Number),
        answer: 'cats',
        color: expect.any(String),
      }
    ],
  });
  expect(response.status).toStrictEqual(200);
});