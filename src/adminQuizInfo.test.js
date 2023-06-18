import { adminQuizInfo, adminQuizCreate } from './quiz.js';
import { clear } from './other.js';
import { adminAuthLogin, adminAuthRegister } from './auth.js'

// beforeEach(() => {
//   clear();
// })

test ('simple test pass', () => {
  adminAuthRegister('123@email.com', '123', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123')
  let quiz = adminQuizCreate(user, 'quiz', 'quiz1');
  
  expect(adminQuizInfo(user, quiz)).toStrictEqual(adminQuizInfo(user, quiz))
}) 

test ('authUserId is not valid', () => {
  adminAuthRegister('123@email.com', '123', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123')
  let quiz = adminQuizCreate(user, 'quiz', 'quiz1');
  
  expect(adminQuizInfo(user+1, quiz)).toStrictEqual({ error: 'Not a valid user.'})
}) 

test ('quizId is not valid', () => {
  adminAuthRegister('123@email.com', '123', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123')
  let quiz = adminQuizCreate(user, 'quiz', 'quiz1');
  
  expect(adminQuizInfo(user, quiz+1)).toStrictEqual({ error: 'Quiz does not exist.'})
}) 

test ('no permission to use quiz', () => {
  adminAuthRegister('123@email.com', '123', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123')
  let quiz = adminQuizCreate(user, 'quiz', 'quiz1');
  adminAuthRegister('1234@email.com', '1234', 'david', 'best');
  let user2 = adminAuthLogin('1234@email.com', '1234')
  let quiz2 = adminQuizCreate(user2, 'quiz2', 'quiz2');
  
  
  expect(adminQuizInfo(user, quiz2)).toStrictEqual({ error: 'You do not have access to this quiz.'})
}) 

