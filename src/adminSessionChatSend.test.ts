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
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quiz', 'quiz1').body.quizId;
  requestQuizQuestionCreate(token1, quiz1, quizQuestion.questionBody);
  session = requestAdminQuizSessionStart(token1, quiz1, 3).body.sessionId;
  player1 = requestQuizSessionPlayerJoin(session, 'Player').body.playerId;
});

describe('Passing case', () => {
  test('User 1 enters correct information', () => {
    expect(requestAdminSessionChatSend(player1, sampleMsg.message.messageBody).body).toStrictEqual({ });
    expect(requestAdminSessionChatSend(player1, 'sampleMsg.message.messageBody').body).toStrictEqual({ });
  });
});

describe('PlayerId wrong', () => {
  test('Negative playerId', () => {
    expect(requestAdminSessionChatSend(-1, sampleMsg.message.messageBody).body).toStrictEqual({ error: 'Player does not exist.' });
  });
});

describe('Message length invalid', () => {
  test('Message short', () => {
    expect(requestAdminSessionChatSend(player1, '').body).toStrictEqual({ error: 'Message length must be greater than 0 and less than 101.' });
  });
  test('Message long', () => {
    expect(requestAdminSessionChatSend(player1, 'ghsjkjdhfaskhjfgakldhjajggahfailkfdhjagfahfdlkhafgjhaghfakjhfbkahfgjaffsafsffaskhjrlkjhkhjabfnsbnvaaa').body).toStrictEqual({ error: 'Message length must be greater than 0 and less than 101.' });
  });
});
