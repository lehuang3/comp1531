import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizInfo, requestAdminQuizQuestionUpdate, requestQuizQuestionCreate } from './other';

let token1: any;
let quiz1: any;
let token1Quiz1Question1Id: any;

const quiz1Question1: any = {
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

const quiz1Question2: any = {
  questionBody: {
    question: 'What is capital of NSW?',
    duration: 5,
    points: 5,
    answers: [
      {
        answer: 'Sydney',
        correct: true
      },
      {
        answer: 'Melbourne',
        correct: false
      },
      {
        answer: 'Canberra',
        correct: false
      }

    ]
  }
};

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
  quiz1 = requestAdminQuizCreate(token1.body.token, 'quiz', 'quiz1');
  token1Quiz1Question1Id = requestQuizQuestionCreate(token1.body.token, quiz1.body.quizId, quiz1Question1.questionBody);
});

describe('Passing cases', () => {
  test('User 1 enters correct information', () => {
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, quiz1Question2.questionBody).body).toStrictEqual({ });
  });
});

describe('Invalid quizId', () => {
  test('Negative quizId', () => {
    expect(requestAdminQuizQuestionUpdate(token1.body.token, -1, token1Quiz1Question1Id.body.questionId, quiz1Question2.questionBody).body).toStrictEqual({ error: 'Quiz does not exist.' });
  });
});

describe('Quiz not owned', () => {
  test('User 1 tries to update User 2 quiz questions', () => {
    const token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test');
    const quiz2 = requestAdminQuizCreate(token2.body.token, 'quiz', 'quiz1');
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz2.body.quizId, token1Quiz1Question1Id.body.questionId, quiz1Question2.questionBody).body).toStrictEqual({ error: 'You do not have access to this quiz.' });
  });
});

describe('Invalid questionId', () => {
  test('Negative questionId', () => {
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, -1, quiz1Question2.questionBody).body).toStrictEqual({ error: 'This question does not exist.' });
  });
});

describe('Question too short/long', () => {
  test('Question too long', () => {
    const longQuestion = {
      questionBody: {
        question: 'Why would you ever want a question which is more than fifty characters long you crazy guy',
        duration: 4,
        points: 1,
        answers: [
          {
            answer: 'I am dumb',
            correct: true
          },
          {
            answer: 'I am smart',
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, longQuestion.questionBody).body).toStrictEqual({ error: 'Question must be greater than 4 characters and less than 51 characters.' });
  });
  test('Question too short', () => {
    const shortQuestion = {
      questionBody: {
        question: 'Why',
        duration: 4,
        points: 1,
        answers: [
          {
            answer: 'Because',
            correct: true
          },
          {
            answer: 'I am smart',
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, shortQuestion.questionBody).body).toStrictEqual({ error: 'Question must be greater than 4 characters and less than 51 characters.' });
  });
});

describe('Too many/little answers', () => {
  test('Too many answers', () => {
    const aLotOfAnswers = {
      questionBody: {
        question: 'Question',
        duration: 4,
        points: 1,
        answers: [
          {
            answer: 'Because',
            correct: true
          },
          {
            answer: 'I',
            correct: false
          },
          {
            answer: 'Am',
            correct: false
          },
          {
            answer: 'Not',
            correct: false
          },
          {
            answer: 'A',
            correct: false
          },
          {
            answer: 'Smart',
            correct: false
          },
          {
            answer: 'Apple',
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, aLotOfAnswers.questionBody).body).toStrictEqual({ error: 'Must have more than one answer and less than 7 answers.' });
  });
  test('Too little answers', () => {
    const notEnoughAnswers = {
      questionBody: {
        question: 'Question',
        duration: 4,
        points: 1,
        answers: [
          {
            answer: 'Because',
            correct: true
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, notEnoughAnswers.questionBody).body).toStrictEqual({ error: 'Must have more than one answer and less than 7 answers.' });
  });
});

describe('Invalid timer', () => {
  test('Negative time', () => {
    const invalidTime1 = {
      questionBody: {
        question: 'Why so serious',
        duration: -1,
        points: 1,
        answers: [
          {
            answer: 'Because',
            correct: true
          },
          {
            answer: 'I am smart',
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, invalidTime1.questionBody).body).toStrictEqual({ error: 'Time allowed must be a postive number.' });
  });
  test('Zero time', () => {
    const invalidTime2 = {
      questionBody: {
        question: 'Why so serious',
        duration: 0,
        points: 1,
        answers: [
          {
            answer: 'Because',
            correct: true
          },
          {
            answer: 'I am smart',
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, invalidTime2.questionBody).body).toStrictEqual({ error: 'Time allowed must be a postive number.' });
  });
});

describe('Quiz total duration > 3minutes', () => {
  test('New quiz time too long', () => {
    const timeTooLong = {
      questionBody: {
        question: 'Why so serious',
        duration: 181,
        points: 1,
        answers: [
          {
            answer: 'Because',
            correct: true
          },
          {
            answer: 'I am smart',
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, timeTooLong.questionBody).body).toStrictEqual({ error: 'Quiz duration longer than 3 minutes.' });
  });
});

describe('Question awards too little/much points', () => {
  test('Quiz awards too much points', () => {
    const points = {
      questionBody: {
        question: 'Why so serious',
        duration: 10,
        points: 11,
        answers: [
          {
            answer: 'Because',
            correct: true
          },
          {
            answer: 'I am smart',
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, points.questionBody).body).toStrictEqual({ error: 'Question must award at least one point and no more than 10 points.' });
  });
  test('Quiz awards too little points', () => {
    const point = {
      questionBody: {
        question: 'Why so serious',
        duration: 10,
        points: 0,
        answers: [
          {
            answer: 'Because',
            correct: true
          },
          {
            answer: 'I am smart',
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, point.questionBody).body).toStrictEqual({ error: 'Question must award at least one point and no more than 10 points.' });
  });
});

describe('Answer too long/short', () => {
  test('Long answer', () => {
    const longAnswer = {
      questionBody: {
        question: 'Why so serious',
        duration: 10,
        points: 1,
        answers: [
          {
            answer: 'This is one very loooooooooooonnnnnnnnnnng answer',
            correct: true
          },
          {
            answer: 'I am smart',
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, longAnswer.questionBody).body).toStrictEqual({ error: 'Answer must be greater than 0 characters and less than 31 characters long.' });
  });
  test('Short answer', () => {
    const shortAnswer = {
      questionBody: {
        question: 'Why so serious',
        duration: 10,
        points: 1,
        answers: [
          {
            answer: '',
            correct: true
          },
          {
            answer: 'I am smart',
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, shortAnswer.questionBody).body).toStrictEqual({ error: 'Answer must be greater than 0 characters and less than 31 characters long.' });
  });
});

describe('Two or more answers in question are the same', () => {
  test('Two same answers', () => {
    const sameAnswer = {
      questionBody: {
        question: 'Why so serious',
        duration: 10,
        points: 1,
        answers: [
          {
            answer: 'I am smart',
            correct: true
          },
          {
            answer: 'I am smart',
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, sameAnswer.questionBody).body).toStrictEqual({ error: 'Cannot have same answers for one question.' });
  });
});

describe('No correct answers', () => {
  test('No answers', () => {
    const noAnswer = {
      questionBody: {
        question: 'Why so serious',
        duration: 10,
        points: 1,
        answers: [
          {
            answer: 'I am dumb',
            correct: false
          },
          {
            answer: 'I am smart',
            correct: false
          }
        ]
      }
    };
    expect(requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, noAnswer.questionBody).body).toStrictEqual({ error: 'There are no correct answers.' });
  });
});

describe('Invalid session', () => {
  test('Invalid token', () => {
    const brokenToken = '-1';

    expect(requestAdminQuizQuestionUpdate(brokenToken, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, quiz1Question2.questionBody).body).toStrictEqual({ error: 'Not a valid session' });
  });
});

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy');
    expect(requestAdminQuizQuestionUpdate(invalidToken.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, quiz1Question2.questionBody).body).toStrictEqual({ error: 'Invalid token structure' });
  });
});

describe('Time test', () => {
  test('Time edited changes with correct param', async () => {
    const timeInitial = requestAdminQuizInfo(token1.body.token, quiz1.body.quizId).body.timeLastEdited;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await requestAdminQuizQuestionUpdate(token1.body.token, quiz1.body.quizId, token1Quiz1Question1Id.body.questionId, quiz1Question2.questionBody);
    const timeEnd: number = requestAdminQuizInfo(token1.body.token, quiz1.body.quizId).body.timeLastEdited;
    expect(timeEnd - timeInitial).toBeGreaterThanOrEqual(0);
  });
});
