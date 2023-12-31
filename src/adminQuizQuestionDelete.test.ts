import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestQuizQuestionCreate, requestAdminQuizQuestionDelete, requestAdminQuizRemove, requestAdminQuizQuestionDeleteV1 } from './request';

let token1: string;
let quiz1: number;
let token1Quiz1Question1Id: number;

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
    ],
    thumbnailUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg'
  }
};

const quizQuestion2 = {
  questionBody: {
    question: 'What is capital of USA?',
    duration: 5,
    points: 5,
    answers: [
      {
        answer: 'NYC',
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

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'captials', 'quiz1').body.quizId;
  token1Quiz1Question1Id = requestQuizQuestionCreate(token1, quiz1, quiz1Question1.questionBody).body.questionId;
});

describe('v2 routes', () => {
  describe('Passing cases', () => {
    test('User 1 enters correct information', () => {
      expect(requestAdminQuizQuestionDelete(token1, quiz1, token1Quiz1Question1Id).body).toStrictEqual({ });
    });
    test('User 1 enters correct information', () => {
      const token1Quiz1Question2Id = requestQuizQuestionCreate(token1, quiz1, quiz1Question1.questionBody).body.questionId;
      expect(requestAdminQuizQuestionDelete(token1, quiz1, token1Quiz1Question2Id).body).toStrictEqual({ });
    });
  });

  describe('Invalid quizId', () => {
    test('Negative quizId', () => {
      expect(requestAdminQuizQuestionDelete(token1, -1, token1Quiz1Question1Id).body).toStrictEqual({ error: 'Quiz does not exist.' });
    });
  });

  describe('Quiz not owned', () => {
    test('User 1 trying to delete question of user 2', () => {
      const token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test').body.token;
      const quiz2 = requestAdminQuizCreate(token2, 'quiz', 'quiz1').body.quizId;
      const token2Quiz2Question1Id = requestQuizQuestionCreate(token2, quiz2, quiz1Question1.questionBody).body.questionId;
      expect(requestAdminQuizQuestionDelete(token1, quiz2, token2Quiz2Question1Id).body).toStrictEqual({ error: 'You do not have access to this quiz.' });
    });
  });

  describe('Invalid questionId', () => {
    test('Negative questionId', () => {
      expect(requestAdminQuizQuestionDelete(token1, quiz1, -1).body).toStrictEqual({ error: 'Question does not exist.' });
    });
  });

  describe('Invalid session', () => {
    test('Invalid token', () => {
      const brokenToken = '-1';

      expect(requestAdminQuizQuestionDelete(brokenToken, quiz1, token1Quiz1Question1Id).body).toStrictEqual({ error: 'Not a valid session' });
    });
  });

  describe('Invalid token', () => {
    test('Invalid token created from invalid email', () => {
      const invalidToken = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy').body.token;
      expect(requestAdminQuizQuestionDelete(invalidToken, quiz1, token1Quiz1Question1Id).body).toStrictEqual({ error: 'Invalid token structure' });
    });
  });

  describe('Quiz in trash', () => {
    test('Quiz is already in trash', () => {
      requestAdminQuizRemove(token1, quiz1);
      expect(requestAdminQuizQuestionDelete(token1, quiz1, token1Quiz1Question1Id).body).toStrictEqual({ error: 'Quiz is in trash.' });
    });
  });
});

// V1 ROUTES
describe('v1 routes', () => {
  describe('Passing cases', () => {
    test('User 1 enters correct information', () => {
      expect(requestAdminQuizQuestionDeleteV1(token1, quiz1, token1Quiz1Question1Id).body).toStrictEqual({ });
    });
    test('User 1 enters correct information', () => {
      const token1Quiz1Question2Id = requestQuizQuestionCreate(token1, quiz1, quiz1Question1.questionBody).body.questionId;
      expect(requestAdminQuizQuestionDeleteV1(token1, quiz1, token1Quiz1Question2Id).body).toStrictEqual({ });
    });
  });

  describe('Invalid quizId', () => {
    test('Negative quizId', () => {
      expect(requestAdminQuizQuestionDeleteV1(token1, -1, token1Quiz1Question1Id).body).toStrictEqual({ error: 'Quiz does not exist.' });
    });
  });

  describe('Quiz not owned', () => {
    test('User 1 trying to delete question of user 2', () => {
      const token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test').body.token;
      const quiz2 = requestAdminQuizCreate(token2, 'quiz', 'quiz1').body.quizId;
      const token2Quiz2Question1Id = requestQuizQuestionCreate(token2, quiz2, quiz1Question1.questionBody).body.questionId;
      expect(requestAdminQuizQuestionDeleteV1(token1, quiz2, token2Quiz2Question1Id).body).toStrictEqual({ error: 'You do not have access to this quiz.' });
    });
  });

  describe('Invalid questionId', () => {
    test('Negative questionId', () => {
      expect(requestAdminQuizQuestionDeleteV1(token1, quiz1, -1).body).toStrictEqual({ error: 'Question does not exist.' });
    });
  });

  describe('Invalid session', () => {
    test('Invalid token', () => {
      const brokenToken = '-1';

      expect(requestAdminQuizQuestionDeleteV1(brokenToken, quiz1, token1Quiz1Question1Id).body).toStrictEqual({ error: 'Not a valid session' });
    });
  });

  describe('Invalid token', () => {
    test('Invalid token created from invalid email', () => {
      const invalidToken = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy').body.token;
      expect(requestAdminQuizQuestionDeleteV1(invalidToken, quiz1, token1Quiz1Question1Id).body).toStrictEqual({ error: 'Invalid token structure' });
    });
  });

  describe('Quiz in trash', () => {
    test('Quiz is already in trash', () => {
      requestAdminQuizRemove(token1, quiz1);
      expect(requestAdminQuizQuestionDeleteV1(token1, quiz1, token1Quiz1Question1Id).body).toStrictEqual({ error: 'Quiz is in trash.' });
    });
  });
});
