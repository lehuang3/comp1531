import { Console } from 'console';
import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestQuizQuestionCreate, requestAdminQuizSessionStart,requestQuizSessionPlayerJoin } from './other';

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
});

test('Name in use', () => {
  console.log(sessionId);
    requestQuizSessionPlayerJoin(sessionId, "HaydenSmitch");
    const response = requestQuizSessionPlayerJoin(sessionId, "HaydenSmitch");
    
    expect(response.body).toStrictEqual({ error: expect.any(String) });
    expect(response.status).toStrictEqual(400);
});

test('Not in lobbay state', () => {
    requestQuizSessionPlayerJoin(sessionId, "HaydenSmitch");
    requestQuizSessionPlayerJoin(sessionId, "Sina Hafezi");
    const response = requestQuizSessionPlayerJoin(sessionId, "Minh Le");
    
    expect(response.body).toStrictEqual({ error: expect.any(String) });
    expect(response.status).toStrictEqual(400);
});

test('Success with user inputed name', () => {
  const response = requestQuizSessionPlayerJoin(sessionId, "HaydenSmitch");
  expect(response.body).toStrictEqual({
    playerId: expect.any(Number),
  });
  expect(response.status).toStrictEqual(200);
});

test('Success without user inputed name', () => {
    const response = requestQuizSessionPlayerJoin(sessionId, "");
    expect(response.body).toStrictEqual({
      playerId: expect.any(Number),
    });
    expect(response.status).toStrictEqual(200);
});

test('2 Success with same name user inputed name', () => {
    requestQuizSessionPlayerJoin(sessionId, "HaydenSmitch");
    
    const sessionId2 = requestAdminQuizSessionStart(token1, quiz1, autoStartNum).body.sessionId;
    console.log(sessionId2);
    const response = requestQuizSessionPlayerJoin(sessionId2, "HaydenSmitch");
    expect(response.body).toStrictEqual({
      playerId: expect.any(Number),
    });
    expect(response.status).toStrictEqual(200);
});
