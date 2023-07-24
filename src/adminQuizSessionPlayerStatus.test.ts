import { Console } from 'console';
import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestQuizQuestionCreate, requestAdminQuizSessionStart,requestQuizSessionPlayerJoin,requestQuizSessionPlayerStatus } from './other';

let token1: string;
let quiz1: number;
let autoStartNum: number;
let sessionId:number;
let sessionId2:number;
let playerId:number;
let playerId2:number;
let playerId3:number;
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
  sessionId2 = requestAdminQuizSessionStart(token1, quiz1, autoStartNum).body.sessionId;
  playerId = requestQuizSessionPlayerJoin(sessionId, "HaydenSmitch").body.playerId;
  playerId2 = requestQuizSessionPlayerJoin(sessionId2, "HaydenSmitch").body.playerId;
  playerId3 = requestQuizSessionPlayerJoin(sessionId2, "jeff").body.playerId;
  
});

test('PlaerIDdoesnt exits', () => { 
	const playerId4 = playerId3 + 1;
	const response = requestQuizSessionPlayerStatus(playerId4);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Succes', () => {
	const response = requestQuizSessionPlayerStatus(playerId3);
  expect(response.body).toStrictEqual({ 
		state:expect.any(String),
		numQuestions:expect.any(Number),
		atQuestion:expect.any(Number)
	 });
  expect(response.status).toStrictEqual(200);
});

