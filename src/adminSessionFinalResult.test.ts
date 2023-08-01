import { requestAdminQuizCreate, requestAdminAuthRegister, requestClear, requestQuizSessionPlayerJoin, requestPlayerAnswerSubmit, requestAdminQuizSessionStateUpdate, requestAdminSessionFinalResult, requestAdminQuizSessionStart, requestQuizQuestionCreate, getAverageAnswerTime, changeState } from './other';
import  { State } from './interfaces'
let token1: any;
let quiz1: any;
let player1: any;
let player2: any;
let player3: any;
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
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quiz', 'quiz1').body.quizId;
  requestQuizQuestionCreate(token1, quiz1, quiz1Question1.questionBody);
  //requestQuizQuestionCreate(token1.body.token, quiz1.body.quizId, quiz1Question2.questionBody);
  session = requestAdminQuizSessionStart(token1, quiz1, 2).body.sessionId;
  player1 = requestQuizSessionPlayerJoin(session, 'Player').body.playerId;
  player2 = requestQuizSessionPlayerJoin(session, 'Coolguy').body.playerId;
  //player3 = requestQuizSessionPlayerJoin(session.body.sessionId, 'Coolerguy');
});

describe.only('Passing cases', () => {
  test('User 1 enters correct information', async() => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    requestPlayerAnswerSubmit(player1, 1, [0])
    requestPlayerAnswerSubmit(player2, 1, [0, 1])
    //requestPlayerAnswerSubmit(player3.body.playerId, 1, [0,1,2])
    // requestAdminQuizSessionStateUpdate(token1.body.token, quiz1.body.quizId, session.body.sessionId, 'GO_TO_ANSWER')
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_ANSWER')
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'NEXT_QUESTION')
    await new Promise((resolve) => setTimeout(resolve, 1000));
    requestPlayerAnswerSubmit(player1, 2, [0])
    requestPlayerAnswerSubmit(player2, 2, [0, 1])
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_ANSWER')
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_FINAL_RESULTS')
    expect(requestAdminSessionFinalResult(player1).body).toStrictEqual({ 
      usersRankedByScore: [
        {
          name: 'Player',
          score: expect.any(Number)
        }
      ],
      questionResults: [
        {
        questionId: expect.any(Number),
        questionCorrectBreakdown: [
          {
            answerId: 0,
            playersCorrect: [
              'Player'
            ]
          }
        ],
        averageAnswerTime: expect.any(Number),
        percentCorrect: expect.any(Number)
        }
      ]
    })
  });
});

describe('PlayerId not valid', () => {
  test('Negative playerId', () => {
    changeState(session, State.FINAL_RESULTS)
    requestPlayerAnswerSubmit(player1, 1, [0])
    // requestAdminQuizSessionStateUpdate(token1.body.token, quiz1.body.quizId, session.body.sessionId, 'GO_TO_ANSWER')
    changeState(session, State.ANSWER_SHOW)
    expect(requestAdminSessionFinalResult(-1).body).toStrictEqual({ error: 'Player does not exist.' });
  });
});

describe('Session not in FINAL_RESULTS state', () => {
  test('Not FINAL_RESULTS state', () => {

    requestPlayerAnswerSubmit(player1, 1, [0])
    requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'NEXT_QUESTION')
    expect(requestAdminSessionFinalResult(player1).body).toStrictEqual({ error: 'Answers cannot be shown right now.' });
  });
});
