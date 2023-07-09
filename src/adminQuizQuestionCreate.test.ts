import { requestClear, requestQuizQuestionCreate, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizRemove, requestAdminQuizList } from './other'
import { QuizQuestion,Answer } from './interfaces';
import { token } from 'morgan';
let token1: string;

let quiz: any;
let quizQuestion: QuizQuestion;
// Runs before each test
beforeEach(() => {
  requestClear()
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  quiz = requestAdminQuizCreate(token1, 'quiz1', 'Descritpion').body;
  quizQuestion = {
		questionBody: {
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
		}
	}
})


test('Invalide quiz ID', () => {
  const quiz2 = {
    quizId: quiz.quizId + 1,
  }
  const response = requestQuizQuestionCreate(token1, quiz2.quizId, quizQuestion)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})


test('Invalide User ID', () => {
  let token2 = requestAdminAuthRegister('hayden.hafezimasoomi@gmail.com', '1234abcd', 'hayden', 'Hafezi').body.token;
  
  const response = requestQuizQuestionCreate(token2, quiz.quizId, quizQuestion)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body.token;
  const response = requestQuizQuestionCreate(token4, quiz.quizId, quizQuestion)
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(401);
})

test('Check for invalid session', () => {
  let token2 = (parseInt(token1) + 1).toString();
  
  const response = requestQuizQuestionCreate(token2, quiz.quizId, quizQuestion)
  expect(response.body).toStrictEqual({error: expect.any(String)});
  expect(response.status).toStrictEqual(403);
})


test('Invalid question length > 50', () => {
	let quizQuestion2 = {
		questionBody: {
			question: "What is capital of sydney?hiusaf ailhfah afihadhfa hyduiahyd aidhfauihd uiahdf",
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
		}
	}

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Invalid question length < 50', () => {
  let quizQuestion2 = {
		questionBody: {
			question: "",
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
		}
	}

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Answer > 6', () => {
  let quizQuestion2 = {
		questionBody: {
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
				},
				{
					answer: "sydney",
					correct: true
				},
				{
					answer: "sydney",
					correct: true
				},
				{
					answer: "sydney",
					correct: true
				},
				{
					answer: "sydney",
					correct: true
				}

			]
		}
	}

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Answer < 2', () => {
  let quizQuestion2 = {
		questionBody: {
			question: "What is capital of sydney?",
			duration: 5,
			points: 5,
			answers: [
				{
					answer: "sydney",
					correct: true
				}
			]
		}
	}

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Answer < 2', () => {
  let quizQuestion2 = {
		questionBody: {
			question: "What is capital of sydney?",
			duration: 5,
			points: 5,
			answers: [
				{
					answer: "sydney",
					correct: true
				}
			]
		}
	}

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('duration < 0', () => {
  let quizQuestion2 = {
		questionBody: {
			question: "What is capital of sydney?",
			duration: -5,
			points: 5,
			answers: [
				{
					answer: "sydney",
					correct: true
				}, 
				{
					answer: "melbourne",
					correct: false
				}, 
				{
					answer: "canberaa",
					correct: false
				}, 
			]
		}
	}

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})


test('duration > 180', () => {
  let quizQuestion2 = {
		questionBody: {
			question: "What is capital of USA?",
			duration: 500,
			points: 5,
			answers: [
				{
					answer: "NYC",
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
	}

	requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion)
	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Point < 1', () => {
  let quizQuestion2 = {
		questionBody: {
			question: "What is capital of USA?",
			duration: 5,
			points: -1,
			answers: [
				{
					answer: "NYC",
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
	}

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})


test('Point > 10', () => {
  let quizQuestion2 = {
		questionBody: {
			question: "What is capital of USA?",
			duration: 5,
			points: 11,
			answers: [
				{
					answer: "NYC",
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
	}

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Point > 10', () => {
  let quizQuestion2 = {
		questionBody: {
			question: "What is capital of USA?",
			duration: 500,
			points: 11,
			answers: [
				{
					answer: "NYC",
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
	}

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('answer length < 1', () => {
  let quizQuestion2 = {
		questionBody: {
			question: "What is capital of USA?",
			duration: 4,
			points: 1,
			answers: [
				{
					answer: "",
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
	}

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('answer length > 30', () => {
  let quizQuestion2 = {
		questionBody: {
			question: "What is capital of USA?",
			duration: 4,
			points: 1,
			answers: [
				{
					answer: "ndjafhdaj;ofhadfhndajfnadjfdnajfkdafdnajikdfanjadkf",
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
	}

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Duplicate asnwer', () => {
  let quizQuestion2 = {
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
	}

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('No correct asnwer', () => {
  let quizQuestion2 = {
		questionBody: {
			question: "What is capital of USA?",
			duration: 4,
			points: 1,
			answers: [
				{
					answer: "NYC",
					correct: false
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
	}

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
  
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Valid entry', () => {

	const response = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion)
  
  expect(response.body).toStrictEqual({ questionId: expect.any(Number) })
  expect(response.status).toStrictEqual(200);
})
