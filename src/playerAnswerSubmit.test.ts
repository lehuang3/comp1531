import {
  requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestQuizQuestionCreate, requestAdminQuizSessionStart,
  requestAdminQuizSessionStateUpdate, requestQuizSessionPlayerJoin, requestPlayerAnswerSubmit, changeState
} from './other';
import { State } from './interfaces';
let token1: string;
let quiz1: number;
let autoStartNum: number;
let session1: any;
let player1: any;
beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quizhello', 'quiz1number').body.quizId;
  requestQuizQuestionCreate(token1, quiz1,
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
    });
  requestQuizQuestionCreate(token1, quiz1,
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
    });
  autoStartNum = 1;
  session1 = requestAdminQuizSessionStart(token1, quiz1, autoStartNum).body.sessionId;
  player1 = requestQuizSessionPlayerJoin(session1, 'Minh').body.playerId;
});

test('Invalid playerId', () => {
  const response = requestPlayerAnswerSubmit(player1 + 1, 1, [0]);
  expect(response.body).toStrictEqual({
    error: 'Player does not exist',
  });
  expect(response.status).toStrictEqual(400);
});

test('Invalid question position', () => {
  const response = requestPlayerAnswerSubmit(player1, -1, [0]);
  expect(response.body).toStrictEqual({
    error: 'Question is not valid for this session',
  });
  expect(response.status).toStrictEqual(400);
});
describe('Session not in QUESTION_OPEN state', () => {
  test('Not in QUESTION_OPEN state - QUESTION_COUNTDOWN', () => {
    const response = requestPlayerAnswerSubmit(player1, 1, [0]);
    expect(response.body).toStrictEqual({
      error: 'Question is not open',
    });
    expect(response.status).toStrictEqual(400);
  });

  test('Not in QUESTION_OPEN state - QUESTION_CLOSE', async () => {
    changeState(session1, State.QUESTION_CLOSE);
    const response = requestPlayerAnswerSubmit(player1, 1, [0]);
    expect(response.body).toStrictEqual({
      error: 'Question is not open',
    });
    expect(response.status).toStrictEqual(400);
  });

  test('Not in QUESTION_OPEN state - ANSWER_SHOW', () => {
    changeState(session1, State.ANSWER_SHOW);
    const response = requestPlayerAnswerSubmit(player1, 1, [0]);
    expect(response.body).toStrictEqual({
      error: 'Question is not open',
    });
    expect(response.status).toStrictEqual(400);
  });

  test('Not in QUESTION_OPEN state - END', () => {
    changeState(session1, State.END);
    requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'END');
    const response = requestPlayerAnswerSubmit(player1, 1, [0]);
    expect(response.body).toStrictEqual({
      error: 'Question is not open',
    });
    expect(response.status).toStrictEqual(400);
  });
});

test('Session is not up to this question yet', () => {
  changeState(session1, State.QUESTION_OPEN);
  const response = requestPlayerAnswerSubmit(player1, 2, [0]);
  expect(response.body).toStrictEqual({
    error: 'Session is not up to this question yet',
  });
  expect(response.status).toStrictEqual(400);
});

test('Invalid answerId', () => {
  requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
  requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
  const response = requestPlayerAnswerSubmit(player1, 2, [2]);
  expect(response.body).toStrictEqual({
    error: 'At least 1 answer is invalid',
  });
  expect(response.status).toStrictEqual(400);
});

test('Duplicate answerId', () => {
  changeState(session1, State.QUESTION_OPEN);
  const response = requestPlayerAnswerSubmit(player1, 1, [0, 0]);
  expect(response.body).toStrictEqual({
    error: 'Answer(s) has duplicate(s)',
  });
  expect(response.status).toStrictEqual(400);
});

test('No answerId', () => {
  changeState(session1, State.QUESTION_OPEN);
  const response = requestPlayerAnswerSubmit(player1, 1, []);
  expect(response.body).toStrictEqual({
    error: 'No answer submitted',
  });
  expect(response.status).toStrictEqual(400);
});

test.each([
  [1, [0]], // correct
  [1, [0, 1]] // incorrect
])(' Success question 1', (question, answers) => {
  changeState(session1, State.QUESTION_OPEN);
  const response = requestPlayerAnswerSubmit(player1, question, answers);
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
});
test.each([
  [2, [0]], // incorrect
  [2, [1]], // incorrect
  [2, [0, 1]], // correct
])(' Success question 2', (question, answers) => {
  requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
  requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
  const response = requestPlayerAnswerSubmit(player1, question, answers);
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
});

test('right answer -> wrong answer', () => {
  changeState(session1, State.QUESTION_OPEN);
  requestPlayerAnswerSubmit(player1, 1, [0]);
  const response = requestPlayerAnswerSubmit(player1, 1, [0, 1]);
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
});