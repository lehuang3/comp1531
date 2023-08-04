import {
  requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestQuizQuestionCreate, requestAdminQuizSessionStart,
  requestAdminQuizSessionStateUpdate, requestAdminQuizSessionsView
} from './request';

let token1: string;
let quiz1: number;
let autoStartNum: number;
let session1: number;

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
  autoStartNum = 1;
  session1 = requestAdminQuizSessionStart(token1, quiz1, autoStartNum).body.sessionId;
});

// test('Check for invalid token structure', () => {
//   const token2 = requestAdminAuthRegister('Minh@gmail.com', '', 'Minh', 'Le').body.token;
//   const response = requestAdminQuizSessionsView(token2, quiz1);
//   expect(response.body).toStrictEqual({
//     error: 'Invalid token structure',
//   });
//   expect(response.status).toStrictEqual(401);
// });

// test('Check for invalid session', () => {
//   const token2 = (parseInt(token1) + 1).toString();

//   const response = requestAdminQuizSessionsView(token2, quiz1);
//   expect(response.body).toStrictEqual({
//     error: 'Not a valid session'
//   });
//   expect(response.status).toStrictEqual(403);
// });

test('1 session: active', () => {
  const response = requestAdminQuizSessionsView(token1, quiz1);
  expect(response.body).toStrictEqual({
    activeSessions: [
      session1
    ],
    inactiveSessions: [

    ]
  });
});

test('1 session: inactive', () => {
  requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'END');
  const response = requestAdminQuizSessionsView(token1, quiz1);
  expect(response.body).toStrictEqual({
    activeSessions: [

    ],
    inactiveSessions: [
      session1
    ]
  });
});

test('4 sessions: 2 x active, 2 x inactive', () => {
  const session2 = requestAdminQuizSessionStart(token1, quiz1, autoStartNum).body.sessionId;
  const session3 = requestAdminQuizSessionStart(token1, quiz1, autoStartNum).body.sessionId;
  const session4 = requestAdminQuizSessionStart(token1, quiz1, autoStartNum).body.sessionId;
  requestAdminQuizSessionStateUpdate(token1, quiz1, session3, 'END');
  requestAdminQuizSessionStateUpdate(token1, quiz1, session4, 'END');
  const response = requestAdminQuizSessionsView(token1, quiz1);
  expect(response.body.activeSessions).toContain(session1);
  expect(response.body.activeSessions).toContain(session2);
  expect(response.body.inactiveSessions).toContain(session3);
  expect(response.body.inactiveSessions).toContain(session4);
});
