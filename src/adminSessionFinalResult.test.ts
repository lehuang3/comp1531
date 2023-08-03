import { requestAdminQuizCreate, requestAdminAuthRegister, requestClear, requestQuizSessionPlayerJoin, requestPlayerAnswerSubmit, requestAdminQuizSessionStateUpdate, requestAdminSessionFinalResult, requestAdminQuizSessionStart, requestQuizQuestionCreate } from './other';

let token1: string;
let quiz1: number;
let player1: number;
let player2: number;
let player3: number;
let session: number;

const quiz1Question1 = {
  questionBody: {
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
        correct: true
      },
      {
        answer: 'Camberra',
        correct: false
      }

    ],
    thumbnailUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg'
  }
};

const quiz1Question2 = {
  questionBody: {
    question: 'What is capital of USA?',
    duration: 4,
    points: 1,
    answers: [
      {
        answer: 'Washington DC',
        correct: true
      },
      {
        answer: 'NYC',
        correct: false
      },
      {
        answer: 'Los Angeles',
        correct: true
      }

    ],
    thumbnailUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg'
  }
};

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quiz', 'quiz1').body.quizId;
  requestQuizQuestionCreate(token1, quiz1, quiz1Question1.questionBody);
  requestQuizQuestionCreate(token1, quiz1, quiz1Question2.questionBody);
  session = requestAdminQuizSessionStart(token1, quiz1, 3).body.sessionId;
  player1 = requestQuizSessionPlayerJoin(session, 'Player').body.playerId;
  player2 = requestQuizSessionPlayerJoin(session, 'Coolguy').body.playerId;
  player3 = requestQuizSessionPlayerJoin(session, 'Coolerguy').body.playerId;
});

describe('Passing cases', () => {
  test('User 1 enters correct information', async() => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    requestPlayerAnswerSubmit(player1, 1, [0]);
    requestPlayerAnswerSubmit(player2, 1, [0, 1]);
    requestPlayerAnswerSubmit(player3, 1, [0, 1, 2]);
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_ANSWER');
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'NEXT_QUESTION');
    await new Promise((resolve) => setTimeout(resolve, 100));
    requestPlayerAnswerSubmit(player1, 2, [0, 2]);
    requestPlayerAnswerSubmit(player2, 2, [0]);
    requestPlayerAnswerSubmit(player3, 2, [0, 2]);
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_ANSWER');
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_FINAL_RESULTS');
    expect(requestAdminSessionFinalResult(player1).status).toStrictEqual(200);
    expect(requestAdminSessionFinalResult(player2).status).toStrictEqual(200);
    expect(requestAdminSessionFinalResult(player3).status).toStrictEqual(200);
  });
});

describe('PlayerId not valid', () => {
  test('Negative playerId', () => {
    expect(requestAdminSessionFinalResult(-1).body).toStrictEqual({ error: 'Player does not exist.' });
  });
});

describe('Session not in FINAL_RESULTS state', () => {
  test('Not FINAL_RESULTS state', () => {
    requestPlayerAnswerSubmit(player1, 1, [0]);
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'NEXT_QUESTION');
    expect(requestAdminSessionFinalResult(player1).body).toStrictEqual({ error: 'Answers cannot be shown right now.' });
  });
});
