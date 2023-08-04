import { requestClear, requestQuizQuestionCreate, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizQuestionMove, requestAdminQuizRemove,requestAdminQuizQuestionMoveV1 } from './request';

let token1: string;
let quiz: number;
let quizQuestion;
let quizQuestion2;
let quizQuestion3;
let questionId3: number;

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  quiz = requestAdminQuizCreate(token1, 'quiz1', 'Descritpion').body.quizId;
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

      ],
      thumbnailUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg'
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

      ],
      thumbnailUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg'
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

      ],
      thumbnailUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg'
    }
  };

  requestQuizQuestionCreate(token1, quiz, quizQuestion.questionBody);
  requestQuizQuestionCreate(token1, quiz, quizQuestion2.questionBody);
  questionId3 = requestQuizQuestionCreate(token1, quiz, quizQuestion3.questionBody).body.questionId;
});

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body.token;
  const newPosition = 0;
  const response = requestAdminQuizQuestionMove(quiz, questionId3, token4, newPosition);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(401);
});

test('Check for invalid session', () => {
  const token2 = (parseInt(token1) + 1).toString();

  const newPosition = 0;
  const response = requestAdminQuizQuestionMove(quiz, questionId3, token2, newPosition);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(403);
});

test('Invalide User ID ie not owner', () => {
  const token2 = requestAdminAuthRegister('hayden.hafezimasoomi@gmail.com', '1234abcd', 'hayden', 'Hafezi').body.token;
  const newPosition = 0;
  const response = requestAdminQuizQuestionMove(quiz, questionId3, token2, newPosition);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Invalide quiz ID', () => {
  const quiz2 = {
    quizId: quiz + 1,
  };
  const newPosition = 0;
  const response = requestAdminQuizQuestionMove(quiz2.quizId, questionId3, token1, newPosition);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Invalide question ID', () => {
  const questionId4 = {
    questionId: questionId3 + 1,
  };
  const newPosition = 0;
  const response = requestAdminQuizQuestionMove(quiz, questionId4.questionId, token1, newPosition);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('position > n-1', () => {
  const newPosition = 3;
  const response = requestAdminQuizQuestionMove(quiz, questionId3, token1, newPosition);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Position < 0', () => {
  const newPosition = -1;
  const response = requestAdminQuizQuestionMove(quiz, questionId3, token1, newPosition);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Same Position as before', () => {
  const newPosition = 2;
  const response = requestAdminQuizQuestionMove(quiz, questionId3, token1, newPosition);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Valid entry', () => {
  const newPosition = 0;
  const response = requestAdminQuizQuestionMove(quiz, questionId3, token1, newPosition);

  expect(response.body).toStrictEqual({ });
  expect(response.status).toStrictEqual(200);
});

test('Quiz in trash', () => {
  const newPosition = 0;
  requestAdminQuizRemove(token1, quiz);
  const response = requestAdminQuizQuestionMove(quiz, questionId3, token1, newPosition);

  expect(response.body).toStrictEqual({ error: 'Quiz is in trash.' });
  expect(response.status).toStrictEqual(400);
});

//V1 ROUTES
test('Same Position as before', () => {
  const newPosition = 2;
  const response = requestAdminQuizQuestionMoveV1(quiz, questionId3, token1, newPosition);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Valid entry', () => {
  const newPosition = 0;
  const response = requestAdminQuizQuestionMoveV1(quiz, questionId3, token1, newPosition);

  expect(response.body).toStrictEqual({ });
  expect(response.status).toStrictEqual(200);
});

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body.token;
  const newPosition = 0;
  const response = requestAdminQuizQuestionMoveV1(quiz, questionId3, token4, newPosition);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(401);
});

test('Check for invalid session', () => {
  const token2 = (parseInt(token1) + 1).toString();

  const newPosition = 0;
  const response = requestAdminQuizQuestionMoveV1(quiz, questionId3, token2, newPosition);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(403);
});
