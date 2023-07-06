import { adminQuizNameUpdate, adminQuizCreate } from './quiz.js'
import { adminAuthLogin, adminAuthRegister } from './auth.js'
import { requestClear, requestGetAdminUserDetails, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizInfo, requestAdminQuizQuestionUpdate, requestQuizQuestionCreate } from './other'
import { QuizQuestion } from './interfaces'

let token1: any;
let quiz1: any;
let token1Quiz1Question1Id: any;

let quiz1Question1: QuizQuestion = {
  questionBody: {
    question: "What is capital of USA?",
    duration: 4,
    points: 1,
    answers: [
      {
        answer: "Washington DC",
        correct: true
      },
      {
        answer: "NYC",
        correct: false
      },
      {
        answer: "Los Angeles",
        correct: false
      }

    ]
  }
};

let quiz1Question2: QuizQuestion = {
  questionBody: {
    question: "What is capital of NSW?",
    duration: 5,
    points: 5,
    answers: [
      {
        answer: "Sydney",
        correct: true
      },
      {
        answer: "Melbourne",
        correct: false
      },
      {
        answer: "Canberra",
        correct: false
      }

    ]
  }
}


beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
  quiz1 = requestAdminQuizCreate(token1.body, 'quiz', 'quiz1')
  token1Quiz1Question1Id = requestQuizQuestionCreate(token1.body, quiz1.body.quizId, quiz1Question1);
})

describe('Passing cases', () => {
  test('User 1 enters correct information', () => {    
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, quiz1Question2).body).toStrictEqual({ })
  })
});

describe('Invalid quizId', () => {
  test('Negative quizId', () => {
    expect(requestAdminQuizQuestionUpdate(token1.body, -1, token1Quiz1Question1Id.body.questionId, quiz1Question2).body).toStrictEqual({ error: 'Quiz does not exist.' })
  })
});

describe('Quiz not owned', () => {
  test('User 1 tries to update User 2 quiz questions', () => {
    const token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test');
    const quiz2 = requestAdminQuizCreate(token2.body, 'quiz', 'quiz1')
    const token2Quiz2Question1Id = requestQuizQuestionCreate(token2.body, quiz2.body.quizId, quiz1Question1);
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz2.body.quizId, token1Quiz1Question1Id.body.questionId, quiz1Question2).body).toStrictEqual({ error: 'You do not have access to this quiz.' })
  })
});

describe('Invalid questionId', () => {
  test('Negative questionId', () => {
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, -1, quiz1Question2).body).toStrictEqual({ error: 'This question does not exist.' })
  })
});

describe('Question too short/long', () => {
  test('Question too long', () => {
    let longQuestion = {
      questionBody: {
        question: "Why would you ever want a question which is more than fifty characters long you crazy guy",
        duration: 4,
        points: 1,
        answers: [
          {
            answer: "I am dumb",
            correct: true
          },
          {
            answer: "I am smart",
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, longQuestion).body).toStrictEqual({ error: 'Question must be greater than 4 characters and less than 51 characters.' })
  })
  test('Question too short', () => {
    let shortQuestion = {
      questionBody: {
        question: "Why",
        duration: 4,
        points: 1,
        answers: [
          {
            answer: "Because",
            correct: true
          },
          {
            answer: "I am smart",
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, shortQuestion).body).toStrictEqual({ error: 'Question must be greater than 4 characters and less than 51 characters.' })
  })
});

describe('Too many/little answers', () => {
  test('Too many answers', () => {
    let aLotOfAnswers = {
      questionBody: {
        question: "Question",
        duration: 4,
        points: 1,
        answers: [
          {
            answer: "Because",
            correct: true
          },
          {
            answer: "I",
            correct: false
          },
          {
            answer: "Am",
            correct: false
          },
          {
            answer: "Not",
            correct: false
          },
          {
            answer: "A",
            correct: false
          },
          {
            answer: "Smart",
            correct: false
          },
          {
            answer: "Apple",
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, aLotOfAnswers).body).toStrictEqual({ error: 'Must have more than one answer and less than 7 answers.' })
  })
  test('Too little answers', () => {
    let notEnoughAnswers = {
      questionBody: {
        question: "Question",
        duration: 4,
        points: 1,
        answers: [
          {
            answer: "Because",
            correct: true
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, notEnoughAnswers).body).toStrictEqual({error: 'Must have more than one answer and less than 7 answers.' })
  })
});

describe('Invalid timer', () => {
  test('Negative time', () => {
    let invalidTime1 = {
      questionBody: {
        question: "Why so serious",
        duration: -1,
        points: 1,
        answers: [
          {
            answer: "Because",
            correct: true
          },
          {
            answer: "I am smart",
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, invalidTime1).body).toStrictEqual({ error: 'Time allowed must be a postive number.' })
  })
  test('Zero time', () => {
    let invalidTime2 = {
      questionBody: {
        question: "Why so serious",
        duration: 0,
        points: 1,
        answers: [
          {
            answer: "Because",
            correct: true
          },
          {
            answer: "I am smart",
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, invalidTime2).body).toStrictEqual({ error: 'Time allowed must be a postive number.' })
  })
});

describe('Quiz total duration > 3minutes', () => {
  test('New quiz time too long', () => {
    let timeTooLong = {
      questionBody: {
        question: "Why so serious",
        duration: 181,
        points: 1,
        answers: [
          {
            answer: "Because",
            correct: true
          },
          {
            answer: "I am smart",
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, timeTooLong).body).toStrictEqual({ error: 'Quiz duration longer than 3 minutes.' })
  })
});

describe('Question awards too little/much points', () => {
  test('Quiz awards too much points', () => {
    let points = {
      questionBody: {
        question: "Why so serious",
        duration: 10,
        points: 11,
        answers: [
          {
            answer: "Because",
            correct: true
          },
          {
            answer: "I am smart",
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, points).body).toStrictEqual({ error: 'Question must award at least one point and no more than 10 points.' })
  })
  test('Quiz awards too little points', () => {
    let point = {
      questionBody: {
        question: "Why so serious",
        duration: 10,
        points: 0,
        answers: [
          {
            answer: "Because",
            correct: true
          },
          {
            answer: "I am smart",
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, point).body).toStrictEqual({ error: 'Question must award at least one point and no more than 10 points.' })
  })
});

describe('Answer too long/short', () => {
  test('Long answer', () => {
    let longAnswer = {
      questionBody: {
        question: "Why so serious",
        duration: 10,
        points: 1,
        answers: [
          {
            answer: "This is one very loooooooooooonnnnnnnnnnng answer",
            correct: true
          },
          {
            answer: "I am smart",
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, longAnswer).body).toStrictEqual({ error: 'Answer must be greater than 0 characters and less than 31 characters long.' })
  })
  test('Short answer', () => {
    let shortAnswer = {
      questionBody: {
        question: "Why so serious",
        duration: 10,
        points: 1,
        answers: [
          {
            answer: "",
            correct: true
          },
          {
            answer: "I am smart",
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, shortAnswer).body).toStrictEqual({ error: 'Answer must be greater than 0 characters and less than 31 characters long.' })
  })
});

describe('Two or more answers in question are the same', () => {
  test('Two same answers', () => {
    let sameAnswer = {
      questionBody: {
        question: "Why so serious",
        duration: 10,
        points: 1,
        answers: [
          {
            answer: "I am smart",
            correct: true
          },
          {
            answer: "I am smart",
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, sameAnswer).body).toStrictEqual({ error: 'Cannot have same answers for one question.' })
  })
});

describe('No correct answers', () => {
  test('No answers', () => {
    let noAnswer = {
      questionBody: {
        question: "Why so serious",
        duration: 10,
        points: 1,
        answers: [
          {
            answer: "I am dumb",
            correct: false
          },
          {
            answer: "I am smart",
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, noAnswer).body).toStrictEqual({ error: 'There are no correct answers.' })
  })
});

describe('Invalid session', () => {
  test('Invalid token', () => {
    const brokenToken = {
      token: '-1'
    }
    expect(requestAdminQuizQuestionUpdate(brokenToken, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, quiz1Question2).body).toStrictEqual({ error: 'Not a valid session' })
  })
});

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy');
    expect(requestAdminQuizQuestionUpdate(invalidToken.body, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, quiz1Question2).body).toStrictEqual({ error: 'Invalid token structure' })
  })
});



