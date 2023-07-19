import { requestClear, requestQuizQuestionCreate, requestAdminAuthRegister, requestAdminQuizCreate } from './other';
import HTTPError from 'http-errors';
let token1: string;
let quiz: any;
let quizQuestion: any;

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

      ],
      thumbnailUrl: "https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg"
    }
  };
  
});

test('Invalide quiz ID', () => {
  const quiz2 = {
    quizId: quiz.quizId + 1,
  };

  expect(() => requestQuizQuestionCreate(token1, quiz2.quizId, quizQuestion.questionBody)).toThrow(HTTPError[400]);
});

test('Invalide User ID', () => {
  const token2 = requestAdminAuthRegister('hayden.hafezimasoomi@gmail.com', '1234abcd', 'hayden', 'Hafezi').body.token;

  expect(() => requestQuizQuestionCreate(token2, quiz.quizId, quizQuestion.questionBody)).toThrow(HTTPError[400]);
});

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body.token;

  expect(() => requestQuizQuestionCreate(token4, quiz.quizId, quizQuestion.questionBody)).toThrow(HTTPError[401]);
});

test('Check for invalid session', () => {
  const token2 = (parseInt(token1) + 1).toString();

  expect(() => requestQuizQuestionCreate(token2, quiz.quizId, quizQuestion.questionBody)).toThrow(HTTPError[403]);
});

test('Invalid question length > 50', () => {
  const quizQuestion2 = {
    questionBody: {
      question: 'What is capital of sydney?hiusaf ailhfah afihadhfa hyduiahyd aidhfauihd uiahdf',
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
      thumbnailUrl: "https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg"
    }
  };

  expect(() => requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2.questionBody)).toThrow(HTTPError[400]);
});

test('Invalid question length < 50', () => {
  const quizQuestion2 = {
    questionBody: {
      question: '',
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
      thumbnailUrl: "https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg"
    }
  };

  expect(() => requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2.questionBody)).toThrow(HTTPError[400]);
});

test('Answer > 6', () => {
  const quizQuestion2 = {
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
        },
        {
          answer: 'sydney',
          correct: true
        },
        {
          answer: 'sydney',
          correct: true
        },
        {
          answer: 'sydney',
          correct: true
        },
        {
          answer: 'sydney',
          correct: true
        }

      ],
      thumbnailUrl: "https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg"
    }
  };

  expect(() => requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2.questionBody)).toThrow(HTTPError[400]);
});

test('Answer < 2', () => {
  const quizQuestion2 = {
    questionBody: {
      question: 'What is capital of sydney?',
      duration: 5,
      points: 5,
      answers: [
        {
          answer: 'sydney',
          correct: true
        }
      ]
    }
  };

  expect(() => requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2.questionBody)).toThrow(HTTPError[400]);
});



test('duration < 0', () => {
  const quizQuestion2 = {
    questionBody: {
      question: 'What is capital of sydney?',
      duration: -5,
      points: 5,
      answers: [
        {
          answer: 'sydney',
          correct: true
        },
        {
          answer: 'melbourne',
          correct: false
        },
        {
          answer: 'canberaa',
          correct: false
        },
      ],
      thumbnailUrl: "https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg"
    }
  };

  expect(() => requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2.questionBody)).toThrow(HTTPError[400]);
});

test('duration > 180', () => {
  const quizQuestion2 = {
    questionBody: {
      question: 'What is capital of USA?',
      duration: 500,
      points: 5,
      answers: [
        {
          answer: 'NYC',
          correct: true
        },
        {
          answer: 'SANFRACIO',
          correct: false
        },
        {
          answer: 'Los ANgleds',
          correct: false
        }

      ],
      thumbnailUrl: "https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg"
    }
  };

  requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion.questionBody);

  expect(() => requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2.questionBody)).toThrow(HTTPError[400]);
});

test('Point < 1', () => {
  const quizQuestion2 = {
    questionBody: {
      question: 'What is capital of USA?',
      duration: 5,
      points: -1,
      answers: [
        {
          answer: 'NYC',
          correct: true
        },
        {
          answer: 'SANFRACIO',
          correct: false
        },
        {
          answer: 'Los ANgleds',
          correct: false
        }

      ],
      thumbnailUrl: "https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg"
    }
  };

  expect(() => requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2.questionBody)).toThrow(HTTPError[400]);
});

test('Point > 10', () => {
  const quizQuestion2 = {
    questionBody: {
      question: 'What is capital of USA?',
      duration: 5,
      points: 11,
      answers: [
        {
          answer: 'NYC',
          correct: true
        },
        {
          answer: 'SANFRACIO',
          correct: false
        },
        {
          answer: 'Los ANgleds',
          correct: false
        }

      ],
      thumbnailUrl: "https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg"
    }
  };

  expect(() => requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2.questionBody)).toThrow(HTTPError[400]);
});

test('answer length < 1', () => {
  const quizQuestion2 = {
    questionBody: {
      question: 'What is capital of USA?',
      duration: 4,
      points: 1,
      answers: [
        {
          answer: '',
          correct: true
        },
        {
          answer: 'SANFRACIO',
          correct: false
        },
        {
          answer: 'Los ANgleds',
          correct: false
        }

      ],
      thumbnailUrl: "https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg"
    }
  };

  expect(() => requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2.questionBody)).toThrow(HTTPError[400]);
});

test('answer length > 30', () => {
  const quizQuestion2 = {
    questionBody: {
      question: 'What is capital of USA?',
      duration: 4,
      points: 1,
      answers: [
        {
          answer: 'ndjafhdaj;ofhadfhndajfnadjfdnajfkdafdnajikdfanjadkf',
          correct: true
        },
        {
          answer: 'SANFRACIO',
          correct: false
        },
        {
          answer: 'Los ANgleds',
          correct: false
        }

      ],
      thumbnailUrl: "https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg"
    }
  };

  expect(() => requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2.questionBody)).toThrow(HTTPError[400]);
});

test('Duplicate asnwer', () => {
  const quizQuestion2 = {
    questionBody: {
      question: 'What is capital of USA?',
      duration: 4,
      points: 1,
      answers: [
        {
          answer: 'SANFRACIO',
          correct: true
        },
        {
          answer: 'SANFRACIO',
          correct: false
        },
        {
          answer: 'Los ANgleds',
          correct: false
        }

      ],
      thumbnailUrl: "https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg"
    }
  };

  expect(() => requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2.questionBody)).toThrow(HTTPError[400]);
});

test('No correct asnwer', () => {
  const quizQuestion2 = {
    questionBody: {
      question: 'What is capital of USA?',
      duration: 4,
      points: 1,
      answers: [
        {
          answer: 'NYC',
          correct: false
        },
        {
          answer: 'SANFRACIO',
          correct: false
        },
        {
          answer: 'Los ANgleds',
          correct: false
        }

      ],
      thumbnailUrl: "https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg"
    }
  };

  expect(() => requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2.questionBody)).toThrow(HTTPError[400]);
});

test('Valid entry', () => {
  const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion.questionBody);

  expect(response.body).toStrictEqual({ questionId: expect.any(Number) });
  expect(response.status).toStrictEqual(200);
});

test('Bad Image', () => {

  let quizQuestion5 = {
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
      thumbnailUrl: "https://nw-syd-gitlab.cseunsw.tech/COMP1531/23T2/groups/M17D_EGGS/project-backend/-/blob/master/swagger.yaml"
    }
  };

  expect(() => requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion5.questionBody)).toThrow(HTTPError[400]);
});
