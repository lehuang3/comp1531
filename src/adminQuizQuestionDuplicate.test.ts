import { requestClear, requestQuizQuestionCreate, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizQuestionDuplicate, requestAdminQuizRemove } from './other';
let token1: string;
let quiz: number;
let quizQuestion;
let questionId: number;

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

  questionId = requestQuizQuestionCreate(token1, quiz, quizQuestion.questionBody).body.questionId;
});

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body.token;
  const response = requestAdminQuizQuestionDuplicate(token4, quiz, questionId);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(401);
});

test('Check for invalid session', () => {
  const token2 = (parseInt(token1) + 1).toString();

  const response = requestAdminQuizQuestionDuplicate(token2, quiz, questionId);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(403);
});

test('Invalide User ID ie not owner', () => {
  const token2 = requestAdminAuthRegister('hayden.hafezimasoomi@gmail.com', '1234abcd', 'hayden', 'Hafezi').body.token;
  const response = requestAdminQuizQuestionDuplicate(token2, quiz, questionId);

  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Invalide quiz ID', () => {
  const quiz2 = {
    quizId: quiz + 1,
  };

  const response = requestAdminQuizQuestionDuplicate(token1, quiz2.quizId, questionId);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Invalide question ID', () => {
  const questionId4 = {
    questionId: questionId + 1,
  };

  const response = requestAdminQuizQuestionDuplicate(token1, quiz, questionId4.questionId);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(400);
});

test('Valid entry', () => {
  const response = requestAdminQuizQuestionDuplicate(token1, quiz, questionId);
  expect(response.body).toStrictEqual({ newQuestionId: expect.any(Number) });
  expect(response.status).toStrictEqual(200);
});

test('Quiz in trash', () => {
  requestAdminQuizRemove(token1, quiz)
  const response = requestAdminQuizQuestionDuplicate(token1, quiz, questionId);
  expect(response.body).toStrictEqual({ error: 'Quiz is in trash.' });
  expect(response.status).toStrictEqual(400);
});
