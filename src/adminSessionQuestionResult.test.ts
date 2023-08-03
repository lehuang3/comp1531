import { requestAdminQuizCreate, requestAdminAuthRegister, requestClear, requestQuizSessionPlayerJoin, requestPlayerAnswerSubmit, requestAdminQuizSessionStateUpdate, requestAdminSessioQuestionResult, requestAdminQuizSessionStart, requestQuizQuestionCreate } from './other';

let token1: string;
let quiz1: number;
let player1: number;
let player2: number;
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
        correct: false
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
  session = requestAdminQuizSessionStart(token1, quiz1, 2).body.sessionId;
  player1 = requestQuizSessionPlayerJoin(session, 'Player').body.playerId;
  player2 = requestQuizSessionPlayerJoin(session, 'Coolguy').body.playerId;
  // player3 = requestQuizSessionPlayerJoin(session.body.sessionId, 'Coolerguy');
});

describe('Passing cases', () => {
  test('User 1 enters correct information', async() => {
    // const data = read()
    // console.log(data.sessions[0].state)
    await new Promise((resolve) => setTimeout(resolve, 100));
    requestPlayerAnswerSubmit(player1, 1, [0]);
    requestPlayerAnswerSubmit(player2, 1, [0]);
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_ANSWER');
    expect(requestAdminSessioQuestionResult(player1, 1).body).toStrictEqual({
      questionId: expect.any(Number),
      questionCorrectBreakdown: [
        {
          answerId: 0,
          playersCorrect: [
            'Player',
            'Coolguy'
          ]
        }
      ],
      averageAnswerTime: expect.any(Number),
      percentCorrect: expect.any(Number)
    });
  });
  test('No errors but no one answered correctly', async() => {
    // const data = read()
    // console.log(data.sessions[0].state)
    await new Promise((resolve) => setTimeout(resolve, 100));
    requestPlayerAnswerSubmit(player1, 1, [0, 1]);
    requestPlayerAnswerSubmit(player2, 1, [0, 1]);
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_ANSWER');
    expect(requestAdminSessioQuestionResult(player1, 1).status).toStrictEqual(200);
  });
});

describe('PlayerId not valid', () => {
  test('Negative playerId', async() => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    requestPlayerAnswerSubmit(player1, 1, [0]);
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_ANSWER');
    expect(requestAdminSessioQuestionResult(-1, 1).body).toStrictEqual({ error: 'Player does not exist.' });
  });
});

describe('Question position not valid', () => {
  test('Negative question position', async() => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    requestPlayerAnswerSubmit(player1, 1, [0]);
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_ANSWER');
    expect(requestAdminSessioQuestionResult(player1, -1).body).toStrictEqual({ error: 'Question does not exist.' });
  });
  test('Question position greater than num of qs', async() => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    requestPlayerAnswerSubmit(player1, 10, [0]);
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_ANSWER');
    expect(requestAdminSessioQuestionResult(player1, -1).body).toStrictEqual({ error: 'Question does not exist.' });
  });
});

describe('Session not in ANSWER_SHOW state', () => {
  test('Not ANSWER_SHOW state', async() => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    requestPlayerAnswerSubmit(player1, 1, [0]);
    expect(requestAdminSessioQuestionResult(player1, 1).body).toStrictEqual({ error: 'Answers cannot be shown right now.' });
  });
});

describe('Session is not up to question position', () => {
  test('In question 1 trying to access question 2', async() => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    requestPlayerAnswerSubmit(player1, 1, [0]);
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_ANSWER');
    expect(requestAdminSessioQuestionResult(player1, 2).body).toStrictEqual({ error: 'Session is not up to question yet.' });
  });
});
