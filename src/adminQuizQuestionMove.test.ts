import { requestClear, requestQuizQuestionCreate, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizQuestionMove } from './other';
import HTTPError from 'http-errors';
let token1: string;
let quiz: any;
let quizQuestion: any;
let quizQuestion2: any;
let quizQuestion3: any;
let questionId3: any;

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  quiz = requestAdminQuizCreate(token1, 'quiz1', 'Descritpion').body;
  quizQuestion = {
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

      ]
    }
  };

  quizQuestion2 = {
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

      ]
    }
  };

  quizQuestion3 = {
    questionBody: {
      question: 'What is capital of Russia?',
      duration: 5,
      points: 5,
      answers: [
        {
          answer: 'MOscows',
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

      ]
    }
  };

  requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion.questionBody);
  requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2.questionBody);
  questionId3 = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion3.questionBody).body;
});

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body.token;
  const newPosition = 0;

  expect(() => requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token4, newPosition)).toThrow(HTTPError[401]);
});

test('Check for invalid session', () => {
  const token2 = (parseInt(token1) + 1).toString();
  const newPosition = 0;

  expect(() => requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token2, newPosition)).toThrow(HTTPError[403]);
});

test('Invalide User ID ie not owner', () => {
  const token2 = requestAdminAuthRegister('hayden.hafezimasoomi@gmail.com', '1234abcd', 'hayden', 'Hafezi').body.token;
  const newPosition = 0;

  expect(() => requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token2, newPosition)).toThrow(HTTPError[400]);
});

test('Invalide quiz ID', () => {
  const quiz2 = {
    quizId: quiz.quizId + 1,
  };
  const newPosition = 0;

  expect(() => requestAdminQuizQuestionMove(quiz2.quizId, questionId3.questionId, token1, newPosition)).toThrow(HTTPError[400]);
});

test('Invalide question ID', () => {
  const questionId4 = {
    questionId: questionId3.questionId + 1,
  };
  const newPosition = 0;

  expect(() => requestAdminQuizQuestionMove(quiz.quizId, questionId4.questionId, token1, newPosition)).toThrow(HTTPError[400]);
});

test('position > n-1', () => {
  const newPosition = 3;

  expect(() => requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token1, newPosition)).toThrow(HTTPError[400]);
});

test('Position < 0', () => {
  const newPosition = -1;

  expect(() => requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token1, newPosition)).toThrow(HTTPError[400]);
});

test('Same Position as before', () => {
  const newPosition = 2;

  expect(() => requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token1, newPosition)).toThrow(HTTPError[400]);
});

test('Valid entry', () => {
  const newPosition = 0;
  const response = requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token1, newPosition);

  expect(response.body).toStrictEqual({ });
  expect(response.status).toStrictEqual(200);
});
