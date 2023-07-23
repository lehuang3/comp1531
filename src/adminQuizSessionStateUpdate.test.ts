import {
  requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestQuizQuestionCreate, requestAdminQuizSessionStart,
  requestAdminQuizSessionStateUpdate
} from './other';

let token1: string;
let quiz1: number;
let autoStartNum: number;
let session1: any;
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
  session1 = requestAdminQuizSessionStart(token1, quiz1, autoStartNum).body.sessionId;
});

test('Check for invalid token structure', () => {
  const token2 = requestAdminAuthRegister('Minh@gmail.com', '', 'Minh', 'Le').body.token;
  const response = requestAdminQuizSessionStateUpdate(token2, quiz1, session1, 'NEXT_QUESTION');
  expect(response.body).toStrictEqual({
    error: 'Invalid token structure',
  });
  expect(response.status).toStrictEqual(401);
});

test('Check for invalid session', () => {
  const token2 = (parseInt(token1) + 1).toString();

  const response = requestAdminQuizSessionStateUpdate(token2, quiz1, session1, 'NEXT_QUESTION');
  expect(response.body).toStrictEqual({
    error: 'Not a valid session'
  });
  expect(response.status).toStrictEqual(403);
});

test('Invalid quizId', () => {
  const response = requestAdminQuizSessionStateUpdate(token1, quiz1 + 1, session1, 'NEXT_QUESTION');
  expect(response.body).toStrictEqual({
    error: 'Quiz does not exist',
  });
  expect(response.status).toStrictEqual(400);
});

test('No permission to view quiz', () => {
  const token2 = requestAdminAuthRegister('Le@gmail.com', '1234abcd', 'Le', 'Huang').body.token;
  const response = requestAdminQuizSessionStateUpdate(token2, quiz1, session1, 'NEXT_QUESTION');
  expect(response.body).toStrictEqual({ error: 'You do not have access to this quiz' });
  expect(response.status).toStrictEqual(400);
});

describe('sessionId tests', () => {
  test('session from another quiz', () => {
    const quiz2 = requestAdminQuizCreate(token1, 'quizhello1', 'quiz1number').body.quizId;
    requestQuizQuestionCreate(token1, quiz2,
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
    const response = requestAdminQuizSessionStateUpdate(token1, quiz2, session1, 'NEXT_QUESTION');
    expect(response.body).toStrictEqual({ error: 'Session is not valid' });
    expect(response.status).toStrictEqual(400);
  });
});

test('session not in any quiz', () => {
  const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1 + 1, 'NEXT_QUESTION');
  expect(response.body).toStrictEqual({ error: 'Session is not valid' });
  expect(response.status).toStrictEqual(400);
});

test('Invalid Action enum', () => {
  const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'WRONG_ACTION');
  expect(response.body).toStrictEqual({ error: 'Invalid Action enum' });
  expect(response.status).toStrictEqual(400);
});

describe('LOBBY', () => {
  test('GO_TO_FINAL_RESULTS', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_FINAL_RESULTS');
    expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
    expect(response.status).toStrictEqual(400);
  });
  test('GO_TO_ANSWER', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_ANSWER');
    expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
    expect(response.status).toStrictEqual(400);
  });
  test('NEXT_QUESTION', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
  });
  test('END', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'END');
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
  });
});

// describe('QUESTION_COUNTDOWN', () => {
//   // set the state for session to be QUESTION_COUNTDOWN
//   beforeEach(() => {
//     requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
//   });
//   test('GO_TO_FINAL_RESULTS', () => {
//     const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_FINAL_RESULTS');
//     expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
//     expect(response.status).toStrictEqual(400);
//   });
//   test('GO_TO_ANSWER', () => {
//     const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_ANSWER');
//     expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
//     expect(response.status).toStrictEqual(400);
//   });
//   test('NEXT_QUESTION', () => {
//     const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
//     expect(response.body).toStrictEqual({});
//     expect(response.status).toStrictEqual(200);
//   });
//   test('END', () => {
//     const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'END');
//     expect(response.body).toStrictEqual({});
//     expect(response.status).toStrictEqual(200);
//   });
// });

// describe('QUESTION_OPEN', () => {
//   beforeEach(() => {
//     requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
//   });
//   test('GO_TO_FINAL_RESULTS', () => {
//     const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_FINAL_RESULTS');
//     expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
//     expect(response.status).toStrictEqual(400);
//   });
//   test('GO_TO_ANSWER', () => {
//     const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_ANSWER');
//     expect(response.body).toStrictEqual({});
//     expect(response.status).toStrictEqual(200);
//   });
//   test('NEXT_QUESTION', () => {
//     const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
//     expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
//     expect(response.status).toStrictEqual(400);
//   });
//   test('END', () => {
//     const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'END');
//     expect(response.body).toStrictEqual({});
//     expect(response.status).toStrictEqual(200);
//   });
// });

// describe('QUESTION_CLOSE', () => {
//   test('GO_TO_FINAL_RESULTS', () => {
//     const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_FINAL_RESULTS');
//     expect(response.body).toStrictEqual({});
//     expect(response.status).toStrictEqual(200);
//   });
//   test('GO_TO_ANSWER', () => {
//     const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_ANSWER');
//     expect(response.body).toStrictEqual({});
//     expect(response.status).toStrictEqual(200);
//   });
//   test('NEXT_QUESTION', () => {
//     const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
//     expect(response.body).toStrictEqual({});
//     expect(response.status).toStrictEqual(200);
//   });
//   test('END', () => {
//     const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'END');
//     expect(response.body).toStrictEqual({});
//     expect(response.status).toStrictEqual(200);
//   });
// });

describe('FINAL_RESULTS', () => {
  beforeEach(() => {
    requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
    requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'ANSWER_SHOW');
    requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_FINAL_RESULTS');
  });
  test('GO_TO_FINAL_RESULTS', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_FINAL_RESULTS');
    expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
    expect(response.status).toStrictEqual(400);
  });
  test('GO_TO_ANSWER', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_ANSWER');
    expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
    expect(response.status).toStrictEqual(400);
  });
  test('NEXT_QUESTION', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
    expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
    expect(response.status).toStrictEqual(400);
  });
  test('END', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'END');
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
  });
});

describe('ANSWER_SHOW', () => {
  beforeEach(() => {
    requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
    requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'ANSWER_SHOW');
  });
  test('GO_TO_FINAL_RESULTS', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_FINAL_RESULTS');
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
  });
  test('GO_TO_ANSWER', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_ANSWER');
    expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
    expect(response.status).toStrictEqual(400);
  });
  test('NEXT_QUESTION', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
  });
  test('END', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'END');
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
  });
});

describe('END', () => {
  beforeEach(() => {
    requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'END');
  });
  test('GO_TO_FINAL_RESULTS', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_FINAL_RESULTS');
    expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
    expect(response.status).toStrictEqual(400);
  });
  test('GO_TO_ANSWER', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'GO_TO_ANSWER');
    expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
    expect(response.status).toStrictEqual(400);
  });
  test('NEXT_QUESTION', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'NEXT_QUESTION');
    expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
    expect(response.status).toStrictEqual(400);
  });
  test('END', () => {
    const response = requestAdminQuizSessionStateUpdate(token1, quiz1, session1, 'END');
    expect(response.body).toStrictEqual({ error: 'Action is not applicable' });
    expect(response.status).toStrictEqual(400);
  });
});
