import { requestClear, requestQuizQuestionCreate, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizRemove, requestAdminQuizList, requestAdminQuizQuestionDuplicate,requestAdminQuizQuestionMove } from './other'
import { TokenParameter, QuizQuestion,Answer } from './interfaces';
import { token } from 'morgan';
let token1: TokenParameter;

let quiz: any;
let quizQuestion: QuizQuestion;
let questionId: any
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

	questionId = requestQuizQuestionCreate(token1, quiz.quizId, quizQuestion).body
	
})

test('Invalid token struct', () => {
	const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body;
  const response = requestAdminQuizQuestionDuplicate(token4, quiz.quizId, questionId.questionId)
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(401);
})

test('Check for invalid session', () => {
  let token2 = {
    token: (parseInt(token1.token) + 1).toString(),
  }
	const response = requestAdminQuizQuestionDuplicate(token2, quiz.quizId, questionId.questionId)
  expect(response.body).toStrictEqual({error: expect.any(String)});
  expect(response.status).toStrictEqual(403);
})

test('Invalide User ID ie not owner', () => {
  
	let token2 = requestAdminAuthRegister('hayden.hafezimasoomi@gmail.com', '1234abcd', 'hayden', 'Hafezi').body;
  const response = requestAdminQuizQuestionDuplicate(token2, quiz.quizId, questionId.questionId)

  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Invalide quiz ID', () => {
	const quiz2 = {
		quizId: quiz.quizId + 1,
	}

  const response = requestAdminQuizQuestionDuplicate(token1, quiz2.quizId, questionId.questionId)
	expect(response.body).toStrictEqual({ error: expect.any(String) })
	expect(response.status).toStrictEqual(400);
})

test('Invalide question ID', () => {
	const questionId4 = {
		questionId: questionId.questionId + 1,
	}
	
  const response = requestAdminQuizQuestionDuplicate(token1, quiz.quizId, questionId4.questionId)
	expect(response.body).toStrictEqual({ error: expect.any(String) })
	expect(response.status).toStrictEqual(400);
})

test('Valid entry', () => {
  const response = requestAdminQuizQuestionDuplicate(token1, quiz.quizId, questionId.questionId)
	expect(response.body).toStrictEqual({ newQuestionId: expect.any(Number) })
  expect(response.status).toStrictEqual(200);
})