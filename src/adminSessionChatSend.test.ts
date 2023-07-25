import { requestAdminQuizCreate, requestAdminAuthRegister, requestClear, requestAdminSessionChatSend, requestQuizSessionPlayerJoin, requestAdminQuizSessionStart, requestQuizQuestionCreate } from './other';

let token1: any;
let quiz1: any;
let player1: any;
let session: any;

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
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
  quiz1 = requestAdminQuizCreate(token1.body.token, 'quiz', 'quiz1');
  requestQuizQuestionCreate(token1.body.token, quiz1.body.quizId, quizQuestion.questionBody);
  session = requestAdminQuizSessionStart(token1.body.token, quiz1.body.quizId, 3);
  player1 = requestQuizSessionPlayerJoin(session.body.sessionId, 'Player');
});

describe('Passing case', () => {
  test('User 1 enters correct information', () => {
    expect(requestAdminSessionChatSend(player1.body.playerId, sampleMsg.message.messageBody).body).toStrictEqual({ });
    expect(requestAdminSessionChatSend(player1.body.playerId, 'sampleMsg.message.messageBody').body).toStrictEqual({ });
  });
});

describe('PlayerId wrong', () => {
  test('Negative playerId', () => {
    expect(requestAdminSessionChatSend(-1, sampleMsg.message.messageBody).body).toStrictEqual({ error: 'Player does not exist.' });
  });
});

describe('Message length invalid', () => {
  test('Message short', () => {
    expect(requestAdminSessionChatSend(player1.body.playerId, '').body).toStrictEqual({ error: 'Message length must be greater than 0 and less than 101.' });
  });
  test('Message long', () => {
    expect(requestAdminSessionChatSend(player1.body.playerId, 'ghsjkjdhfaskhjfgakldhjajggahfailkfdhjagfahfdlkhafgjhaghfakjhfbkahfgjaffsafsffaskhjrlkjhkhjabfnsbnvaaa').body).toStrictEqual({ error: 'Message length must be greater than 0 and less than 101.' });
  });
});