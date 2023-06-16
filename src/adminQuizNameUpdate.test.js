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
  
  expect(adminQuizNameUpdate()).toStrictEqual()
}) 

test ('quizId not valid', () => {
  adminAuthRegister();
  adminAuthLogin();
  adminQuizCreate();
  
  expect(adminQuizNameUpdate()).toStrictEqual()
}) 

test ('quiz name not valid', () => {
  adminAuthRegister();
  adminAuthLogin();
  adminQuizCreate();
  
  expect(adminQuizNameUpdate()).toStrictEqual()
}) 

test ('quiz name too short', () => {
  adminAuthRegister();
  adminAuthLogin();
  adminQuizCreate();
  
  expect(adminQuizNameUpdate()).toStrictEqual()
}) 

test ('quiz name too long', () => {
  adminAuthRegister();
  adminAuthLogin();
  adminQuizCreate();
  
  expect(adminQuizNameUpdate()).toStrictEqual()
}) 

test ('quiz name already used', () => {
  adminAuthRegister();
  adminAuthLogin();
  adminQuizCreate();
  
  expect(adminQuizNameUpdate()).toStrictEqual()
}) 
