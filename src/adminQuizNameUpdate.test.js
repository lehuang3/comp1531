import { adminQuizNameUpdate, adminQuizCreate } from './quiz.js'
import { adminAuthLogin, adminAuthRegister } from './auth.js'
import { clear } from './other.js'

beforeEach(() => {
  clear();
  // adminAuthRegister('123@email.com', '123', 'david', 'test');
  // let user = adminAuthLogin('123@email.com', '123')
  // let quiz = adminQuizCreate(user.authUserId, 'quiz', 'quiz1');
  // let user2 = adminAuthRegister('1234@email.com', '123', 'jack', 'test');
  // adminAuthLogin('123@email.com', '123')
  // let quiz2 = adminQuizCreate(user2.authUserId, 'quiz', 'quiz1');
});

test ('simple test pass', () => {
  adminAuthRegister('123@email.com', '123', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123')
  let quiz = adminQuizCreate(user, 'quiz', 'quiz1');
  
  expect(adminQuizNameUpdate(user, quiz, 'quiz2')).toStrictEqual({ })
}) 

test ('userId not valid', () => {
  adminAuthRegister('123@email.com', '123', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123')
  let quiz = adminQuizCreate(user, 'quiz', 'quiz1');
  let user2 = adminAuthRegister('1234@email.com', '123', 'jack', 'test');
  
  expect(adminQuizNameUpdate(user2, quiz, 'quiz2')).toStrictEqual({ error: 'You do not have access to this quiz.'})
}) 

test ('quizId not valid', () => {
  adminAuthRegister('123@email.com', '123', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123')
  let quiz = adminQuizCreate(user, 'quiz', 'quiz1');
  let user2 = adminAuthRegister('1234@email.com', '123', 'jack', 'test');
  adminAuthLogin('123@email.com', '123')
  let quiz2 = adminQuizCreate(user2, 'quiz', 'quiz1');

  expect(adminQuizNameUpdate(user2, quiz2, 'quiz2')).toStrictEqual({ error: 'Quiz does not exist.'})
}) 

test ('quiz name not valid', () => {
  adminAuthRegister('123@email.com', '123', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123')
  let quiz = adminQuizCreate(user, 'quiz', 'quiz1');
  
  expect(adminQuizNameUpdate(user, quiz, 'quiz#')).toStrictEqual({ error: 'Quiz name cannot have spaces and special characters.'})
  expect(adminQuizNameUpdate(user, quiz, 'quiz 1')).toStrictEqual({ error: 'Quiz name cannot have spaces and special characters.'})
}) 

test ('quiz name too long or short', () => {
  adminAuthRegister('123@email.com', '123', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123')
  let quiz = adminQuizCreate(user, 'quiz', 'quiz1');
  
  expect(adminQuizNameUpdate(user, quiz, 'q1')).toStrictEqual({ error: 'Quiz name must be greater or equal to 2 chartacters and less than or equal to 30.'})
  expect(adminQuizNameUpdate(user, quiz, 'qdhjfasjkhfjasjhfkasghjdhfjasbgasdg')).toStrictEqual({ error: 'Quiz name must be greater or equal to 2 chartacters and less than or equal to 30.'})
}) 


test ('quiz name already used', () => {
  adminAuthRegister('123@email.com', '123', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123')
  let quiz = adminQuizCreate(user, 'quiz', 'quiz1');
  adminQuizCreate(user, 'quiz', 'quiz2');
  
  expect(adminQuizNameUpdate(user, quiz, 'quiz2')).toStrictEqual({ error: 'Quiz name already exists.'})
}) 
