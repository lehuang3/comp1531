import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestQuizQuestionCreate, requestAdminQuizQuestionDelete } from './other';

let token1: any;
let quiz1: any;
let token1Quiz1Question1Id: any;

const quiz1Question1 = {
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

    ]
  }
};

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
  quiz1 = requestAdminQuizCreate(token1.body.token, 'captials', 'quiz1');
  token1Quiz1Question1Id = requestQuizQuestionCreate(token1.body.token, quiz1.body.quizId, quiz1Question1.questionBody);
});

describe('Passing cases', () => {
  test('User 1 enters correct information', () => {
    expect(requestAdminQuizQuestionDelete(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId).body).toStrictEqual({ });
  });
});

describe('Invalid quizId', () => {
  test('Negative quizId', () => {
    expect(requestAdminQuizQuestionDelete(token1.body.token, -1, token1Quiz1Question1Id).body).toStrictEqual({ error: 'Quiz does not exist.' });
  });
});

describe('Quiz not owned', () => {
  test('User 1 trying to delete question of user 2', () => {
    const token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test');
    const quiz2 = requestAdminQuizCreate(token2.body.token, 'quiz', 'quiz1');
    const token2Quiz2Question1Id = requestQuizQuestionCreate(token2.body.token, quiz2.body.quizId, quiz1Question1.questionBody);
    expect(requestAdminQuizQuestionDelete(token1.body.token, quiz2.body.quizId, token2Quiz2Question1Id.body.questionId).body).toStrictEqual({ error: 'You do not have access to this quiz.' });
  });
});

describe('Invalid questionId', () => {
  test('Negative questionId', () => {
    expect(requestAdminQuizQuestionDelete(token1.body.token, quiz1.body.quizId, -1).body).toStrictEqual({ error: 'Question does not exist.' });
  });
});

describe('Invalid session', () => {
  test('Invalid token', () => {
    const brokenToken = '-1';

    expect(requestAdminQuizQuestionDelete(brokenToken, quiz1.body.quizId, token1Quiz1Question1Id).body).toStrictEqual({ error: 'Not a valid session' });
  });
});

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy');
    expect(requestAdminQuizQuestionDelete(invalidToken.body.token, quiz1.body.quizId, token1Quiz1Question1Id).body).toStrictEqual({ error: 'Invalid token structure' });
  });
});
