import { requestAdminQuizCreate, requestAdminAuthRegister, requestClear, requestQuizSessionPlayerJoin, requestPlayerAnswerSubmit, requestAdminQuizSessionStateUpdate, requestAdminSessionFinalResult,requestAdminQuizSessionFinalCsv, requestAdminQuizSessionStart, requestQuizQuestionCreate, getAverageAnswerTime, changeState,requestAdminQuizSessionFinal } from './other';
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

const quiz1Question2 = {
    questionBody: {
      question: 'What is capital of USA?',
      duration: 5,
      points: 5,
      answers: [
        {
          answer: 'New York',
          correct: false
        },
        {
          answer: 'Dc',
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

  const quiz1Question3 = {
    questionBody: {
      question: 'What is capital of Japan?',
      duration: 5,
      points: 5,
      answers: [
        {
          answer: 'Okinawa',
          correct: false
        },
        {
          answer: 'DC',
          correct: false
        },
        {
          answer: 'Tokoyo',
          correct: true
        }
  
      ],
      thumbnailUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg'
    }
  };


beforeEach(() => {
  jest.setTimeout(60000);
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quiz', 'quiz1').body.quizId;

  requestQuizQuestionCreate(token1, quiz1, quiz1Question1.questionBody);
  requestQuizQuestionCreate(token1, quiz1, quiz1Question2.questionBody);
  requestQuizQuestionCreate(token1, quiz1, quiz1Question3.questionBody);
  session = requestAdminQuizSessionStart(token1, quiz1, 3).body.sessionId;
  player1 = requestQuizSessionPlayerJoin(session, 'Sina').body.playerId;
  player2 = requestQuizSessionPlayerJoin(session, 'Minh').body.playerId;
  player3 = requestQuizSessionPlayerJoin(session, 'Le').body.playerId;
});

test('Invalid token struct', () => {
    const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body.token;
    const response = requestAdminQuizSessionFinalCsv(token4, quiz1,session);
    expect(response.body).toStrictEqual({ error: expect.any(String) });
    expect(response.status).toStrictEqual(401);
});
  
test('Check for invalid session', () => {
  const token2 = (parseInt(token1) + 1).toString();
  const response = requestAdminQuizSessionFinalCsv(token2, quiz1, session);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(403);
});

test('Not valid quiz', () => {
  const response = requestAdminQuizSessionFinalCsv(token1, quiz1+1, session);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('not a quiz that user owns', () => {
	let token2 = requestAdminAuthRegister('Sinahafezimasoomi@gmail.com', 'Sydneyun2004!', 'Sina', 'Hafezi').body.token;
  let quiz2 = requestAdminQuizCreate(token2, 'quizhello', 'quiz1number').body.quizId;
  const response = requestAdminQuizSessionFinalCsv(token1, quiz2, session);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('session not in any quiz', () => {
  const response = requestAdminQuizSessionFinalCsv(token1, quiz1, session + 1);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Not FINAL_RESULTS state', async() => {
	await new Promise((resolve) => setTimeout(resolve, 1200));
	requestPlayerAnswerSubmit(player1, 1, [0])
	requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'QUESTION_CLOSE')
  requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_FINAL_RESULTS')
	const response = requestAdminQuizSessionFinalCsv(token1, quiz1, session);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});


test('Quiz played', async() => {

  console.log("first quesiotn")
  await new Promise((resolve) => setTimeout(resolve, 1200));
  requestPlayerAnswerSubmit(player3, 1, [2])
  
  requestPlayerAnswerSubmit(player2, 1, [1])
  
  requestPlayerAnswerSubmit(player1, 1, [0])

  requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_ANSWER');
  requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'NEXT_QUESTION');

  console.log("secound quesiotn")
  await new Promise((resolve) => setTimeout(resolve, 1200));
  requestPlayerAnswerSubmit(player1, 2, [0])
  
  requestPlayerAnswerSubmit(player2, 2, [1])
  
  requestPlayerAnswerSubmit(player3, 2, [2])
  console.log("third quesiotn")

  requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_ANSWER');
  requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'NEXT_QUESTION');

  await new Promise((resolve) => setTimeout(resolve, 1100));
  requestPlayerAnswerSubmit(player1, 3, [2])
  
  requestPlayerAnswerSubmit(player3, 3, [0])
  
  requestPlayerAnswerSubmit(player2,3, [1])

  requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_ANSWER')
  requestAdminQuizSessionStateUpdate(token1, quiz1, session, 'GO_TO_FINAL_RESULTS')
  
  expect(requestAdminQuizSessionFinalCsv(token1, quiz1, session).body).toStrictEqual({ url:expect.any(String)
     
  })
},10000);

