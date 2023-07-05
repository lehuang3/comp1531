import { requestClear, requestQuizQuestionCreate, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizRemove, requestAdminQuizList, requestAdminQuizQuestionMove } from './other'
import { TokenParameter, QuizQuestion,Answer } from './interfaces';
import { token } from 'morgan';
let token1: TokenParameter;

let quiz: any;
let quizQuestion: QuizQuestion;
let quizQuestion2: QuizQuestion;
let quizQuestion3: QuizQuestion;
let questionId3: any;
// Runs before each test
beforeEach(() => {
  requestClear()
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body;
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

	quizQuestion2 = {
		questionBody: {
			question: "What is capital of USA?",
			duration: 5,
			points: 5,
			answers: [
				{
					answer: "NYC",
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

	quizQuestion3 = {
		questionBody: {
			question: "What is capital of Russia?",
			duration: 5,
			points: 5,
			answers: [
				{
					answer: "MOscows",
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

	requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion)
	requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion2)
	questionId3 = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion3).body

})

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body;
	let newPosition = 0
  const response = requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token4, newPosition)

  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(401);
})

test('Check for invalid session', () => {
  let token2 = {
    token: (parseInt(token1.token) + 1).toString(),
  }
  let newPosition = 0
  const response = requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token2, newPosition)

  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(403);
})

test('Invalide User ID ie not owner', () => {
  
	let token2 = requestAdminAuthRegister('hayden.hafezimasoomi@gmail.com', '1234abcd', 'hayden', 'Hafezi').body;
  let newPosition = 0
  const response = requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token2, newPosition)

  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})


test('Invalide quiz ID', () => {
	const quiz2 = {
		quizId: quiz.quizId + 1,
	}
	let newPosition = 0
  const response = requestAdminQuizQuestionMove(quiz2.quizId, questionId3.questionId, token1, newPosition)
	
	expect(response.body).toStrictEqual({ error: expect.any(String) })
	expect(response.status).toStrictEqual(400);
})

test('Invalide question ID', () => {
	const questionId4 = {
		questionId: questionId3.questionId + 1,
	}
	let newPosition = 0
  const response = requestAdminQuizQuestionMove(quiz.quizId, questionId4.questionId, token1, newPosition)
	
	expect(response.body).toStrictEqual({ error: expect.any(String) })
	expect(response.status).toStrictEqual(400);
})

test('position > n-1', () => {
  
  let newPosition = 3
  const response = requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token1, newPosition)
 
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Position < 0', () => {
  
  let newPosition = -1
  const response = requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token1, newPosition)

  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Same Position as before', () => {
  
  let newPosition = 2
  const response = requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token1, newPosition)

  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Valid entry', () => {
 
  let newPosition = 0
  const response = requestAdminQuizQuestionMove(quiz.quizId, questionId3.questionId, token1, newPosition)

  expect(response.body).toStrictEqual({ })
  expect(response.status).toStrictEqual(200);
})