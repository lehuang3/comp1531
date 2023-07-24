import { requestAdminQuizCreate, requestAdminAuthRegister, requestClear, requestQuizSessionPlayerJoin, requestAdminSessioQuestionResult, requestAdminQuizSessionStart, requestQuizQuestionCreate } from './other';

let token1: any;
let quiz1: any;
let player1: any;
let session: any;

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
        correct: false
      },
      {
        answer: 'Camberra',
        correct: false
      }

    ],
    thumbnailUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg'
  }
};

const quiz1Question2: any = {
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
        correct: false
      }

    ],
    thumbnailUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg'
  }
};

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
  quiz1 = requestAdminQuizCreate(token1.body.token, 'quiz', 'quiz1');
  requestQuizQuestionCreate(token1.body.token, quiz1.body.quizId, quiz1Question1.questionBody);
  requestQuizQuestionCreate(token1.body.token, quiz1.body.quizId, quiz1Question2.questionBody);
  session = requestAdminQuizSessionStart(token1.body.token, quiz1.body.quizId, 3);
  player1 = requestQuizSessionPlayerJoin(session.body.sessionId, 'Player');
});

describe('Passing cases', () => {
  test('User 1 enters correct information', () => {
    expect(requestAdminSessioQuestionResult(player1.body.playerId, 1).body).toStrictEqual({ });
  });
});

describe('PlayerId not valid', () => {
  test('Negative playerId', () => {
    expect(requestAdminSessioQuestionResult(-1, 1).body).toStrictEqual({ });
  });
});

describe('Question position not valid', () => {
  test('Negative question position', () => {
    expect(requestAdminSessioQuestionResult(player1.body.playerId, -1).body).toStrictEqual({ });
  });
});

describe('Session not in ANSWER_SHOW state', () => {
  test('Not ANSWER_SHOW state', () => {
    expect(requestAdminSessioQuestionResult(player1.body.playerId, 1).body).toStrictEqual({ });
  });
});

describe('Session is not up to question position', () => {
  test('In question 1 trying to access question 2', () => {
    expect(requestAdminSessioQuestionResult(player1.body.playerId, 2).body).toStrictEqual({ });
  });
});