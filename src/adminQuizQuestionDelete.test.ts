import { adminQuizNameUpdate, adminQuizCreate } from './quiz.js'
import { adminAuthLogin, adminAuthRegister } from './auth.js'
import { requestClear, requestGetAdminUserDetails, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizInfo, requestQuizQuestionCreate} from './other'

let token1: any;
let quiz1: any;
let quiz2: any;

let quiz1Question1: QuizQuestion = {
  questionBody: {
    question: "What is capital of USA?",
    duration: 4,
    points: 1,
    answers: [
      {
        answer: "SANFRACIO",
        correct: true
      },
      {
        answer: "SANFRACIO",
        correct: false
      },
      {
        answer: "Los ANgleds",
        correct: false
      }

    ]
  }
};

let quiz1Question2: QuizQuestion = {
  question: "What is capital of sydney?",
  duration: 5,
  points: 5,
  answers: [
    {
      answer: "sydney",
      correct: true
    },
    {
      answer: "Melbourne",
      correct: false
    },
    {
      answer: "Camberra",
      correct: false
    }

  ]
};

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
  quiz1 = requestAdminQuizCreate(token1.body, 'captials', 'quiz1');
  token1Quiz1Question1Id = requestQuizQuestionCreate(token1.body, quiz1.body.quizId, quiz1Question1);
  token1Quiz1Question2Id = requestQuizQuestionCreate(token1.body, quiz1.body.quizId, quiz1Question2);
})

describe('Passing cases', () => {
  test('User 1 enters correct information', () => {
  expect(requestAdminQuizQuestionDelete(token1.body, quiz1.body.quizId, token1Quiz1Question1Id)).toStrictEqual({ })
  })
});

describe('Invalid quizId', () => {
  test('Negative quizId', () => {
    expect(requestAdminQuizQuestionDelete(token1.body, -1, token1Quiz1Question1Id)).toStrictEqual({ error: 'Quiz does not exist.' })
  })
});

describe('Quiz not owned', () => {
  test('User 1 trying to delete question of user 2', () => {
    const token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test');
    const quiz2 = requestAdminQuizCreate(token2.body, 'quiz', 'quiz1')
    token2Quiz2Question1Id = requestQuizQuestionCreate(token1.body, quiz1.body.quizId, quiz1Question1);
    expect(requestAdminQuizQuestionDelete(token1.body, quiz1.body.quizId, token2Quiz2Question1Id)).toStrictEqual({ error: 'You do not have access to this quiz.' })
  })
});

describe('Invalid questionId', () => {
  test('Negative questionId', () => {
    expect(requestAdminQuizQuestionDelete(token1.body, quiz1.body.quizId, -1)).toStrictEqual({ error: 'Question does not exist.' })
  })
});

describe('Invalid session', () => {
  test('', () => {
    const brokenToken = {
      token: '-1'
    }
    expect(requestAdminQuizQuestionDelete(brokenToken, quiz1.body.quizId, -1)).toStrictEqual({ error: 'Not a valid session' })
  })
});

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy');
    expect(requestAdminQuizQuestionDelete(invalidToken, quiz1.body.quizId, -1)).toStrictEqual({ error: 'Invalid token structure' })
  })
});
