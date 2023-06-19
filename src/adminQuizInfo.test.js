import { adminQuizInfo, adminQuizCreate } from './quiz.js';
import { clear } from './other.js';
import { adminAuthLogin, adminAuthRegister } from './auth.js'

beforeEach(() => {
  clear();
})

test ('simple test pass', () => {
  adminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123adjakjfhgaA')
  let quiz = adminQuizCreate(user.authUserId, 'quiz', 'quiz1');
  
  expect(adminQuizInfo(user.authUserId, quiz.quizId)).toStrictEqual(adminQuizInfo(user.authUserId, quiz.quizId))
}) 

test ('authUserId is not valid', () => {
  adminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123adjakjfhgaA')
  let quiz = adminQuizCreate(user.authUserId, 'quiz', 'quiz1');
  
  expect(adminQuizInfo((user.authUserId)+1, quiz.quizId)).toStrictEqual({ error: 'Not a valid user.'})
}) 

test ('quizId is not valid', () => {
  adminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123adjakjfhgaA')
  let quiz = adminQuizCreate(user.authUserId, 'quiz', 'quiz1');
  
  expect(adminQuizInfo(user.authUserId, (quiz.quizId)+1)).toStrictEqual({ error: 'Quiz does not exist.'})
}) 

test ('no permission to use quiz', () => {
  adminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123adjakjfhgaA')
  let quiz = adminQuizCreate(user.authUserId, 'quiz', 'quiz1');
  adminAuthRegister('1234@email.com', '123adjakjfhgaA', 'david', 'best');
  let user2 = adminAuthLogin('1234@email.com', '123adjakjfhgaA')
  let quiz2 = adminQuizCreate(user2.authUserId, 'quiz2', 'quiz2');
  
  
  expect(adminQuizInfo(user.authUserId, quiz2.quizId)).toStrictEqual({ error: 'You do not have access to this quiz.'})
}) 

