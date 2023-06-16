import { adminQuizNameUpdate } from './quiz.js'

test ('simple test pass', () => {
  adminAuthRegister();
  adminAuthLogin();
  adminQuizCreate();
  
  expect(adminQuizNameUpdate()).toStrictEqual()
}) 

test ('userId not valid', () => {
  adminAuthRegister();
  adminAuthLogin();
  adminQuizCreate();
  
  expect(adminQuizNameUpdate()).toStrictEqual({ error: ''})
}) 

test ('quizId not valid', () => {
  adminAuthRegister();
  adminAuthLogin();
  adminQuizCreate();
  
  expect(adminQuizNameUpdate()).toStrictEqual({ error: 'Quiz does not exist.'})
}) 

test ('quiz name not valid', () => {
  adminAuthRegister();
  adminAuthLogin();
  adminQuizCreate();
  
  expect(adminQuizNameUpdate()).toStrictEqual({ error: 'Quiz name cannot have spaces and special characers.'})
}) 

test ('quiz name too short', () => {
  adminAuthRegister();
  adminAuthLogin();
  adminQuizCreate();
  
  expect(adminQuizNameUpdate()).toStrictEqual({ error: 'Quiz name must be greater or equal to 2 chartacters and less than or equal to 30.'})
}) 

test ('quiz name too long', () => {
  adminAuthRegister();
  adminAuthLogin();
  adminQuizCreate();
  
  expect(adminQuizNameUpdate()).toStrictEqual({ error: 'Quiz name must be greater or equal to 2 chartacters and less than or equal to 30.'})
}) 

test ('quiz name already used', () => {
  adminAuthRegister();
  adminAuthLogin();
  adminQuizCreate();
  
  expect(adminQuizNameUpdate()).toStrictEqual({ error: 'Quiz name already exists.'})
}) 
