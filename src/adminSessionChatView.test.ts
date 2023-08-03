import { requestAdminQuizCreate, requestAdminAuthRegister, requestClear, requestAdminSessionChatView, requestAdminSessionChatSend, requestQuizSessionPlayerJoin, requestAdminQuizSessionStart, requestQuizQuestionCreate } from './request';

let token1: string;
let quiz1: number;
let player1: number;
let session: number;

const quizQuestion = {
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
const sampleMsg = {
  message: {
    messageBody: 'hello'
  }
};

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quiz', 'quiz1').body.quizId;
  requestQuizQuestionCreate(token1, quiz1, quizQuestion.questionBody);
  session = requestAdminQuizSessionStart(token1, quiz1, 3).body.sessionId;
  player1 = requestQuizSessionPlayerJoin(session, 'Player').body.playerId;
  const player2 = requestQuizSessionPlayerJoin(session, 'Not player');
  requestAdminSessionChatSend(player1, sampleMsg.message.messageBody);
});

describe('Passing case', () => {
  test('User 1 enters correct information', () => {
    expect(requestAdminSessionChatView(player1).body).toStrictEqual({
      messages: [
        {
          messageBody: sampleMsg.message.messageBody,
          playerId: player1,
          playerName: 'Player',
          timeSent: expect.any(Number)
        }
      ]
    });
  });
});

describe('PlayerId wrong', () => {
  test('Negative playerId', () => {
    expect(requestAdminSessionChatView(-1).body).toStrictEqual({ error: 'Player does not exist.' });
  });
});
