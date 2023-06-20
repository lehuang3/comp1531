import { adminQuizCreate, adminQuizRemove, adminQuizList } from './quiz.js'
import { adminAuthRegister } from './auth.js'
import { clear } from './other.js'

// Runs before each test
beforeEach(() => {
  clear()
})

test('Invalide User ID', () => {
  adminAuthRegister('Sina.hafezimasoomi@gmail.com', 'Sina12356789', 'Sina', 'Hafezi')
  adminQuizCreate(0, 'Sina', 'descruiption')
  expect(adminQuizRemove(1, 0)).toStrictEqual({ error: expect.any(String) })
})

test('Invalide quiz ID', () => {
  adminAuthRegister('Sina.hafezimasoomi@gmail.com', 'Sina12356789', 'Sina', 'Hafezi')
  adminAuthRegister('hayden.hafezimasoomi@gmail.com', 'hayden', 'hayden', 'Hafezi')
  adminQuizCreate(0, 'Sina', 'descruiption')
  adminQuizCreate(1, 'hayden', 'descruiption')
  expect(adminQuizRemove(1, 0)).toStrictEqual({ error: expect.any(String) })
})

test('Invalide User ID', () => {
  adminAuthRegister('Sina.hafezimasoomi@gmail.com', 'Sina12356789', 'Sina', 'Hafezi')
  adminQuizCreate(0, 'Sina', 'descruiption')
  expect(adminQuizRemove(1, 0)).toStrictEqual({ error: expect.any(String) })
})

test('Valid entry', () => {
  adminAuthRegister('Sina.hafezimasoomi@gmail.com', 'Sina12356789', 'Sina', 'Hafezi')
  adminQuizCreate(0, 'Sina', 'descruiption')
  adminQuizCreate(0, 'Sina1', 'descruiption')
  expect(adminQuizList(0)).toStrictEqual({
    quizzes: [
      {
        quizId: expect.any(Number),
        name: expect.any(String)
      },
      {
        quizId: expect.any(Number),
        name: expect.any(String)
      }
  	]
  })
})

test('Removed in user datastore', () => {
  adminAuthRegister('Sina.hafezimasoomi@gmail.com', 'Sina12356789', 'Sina', 'Hafezi')
  adminQuizCreate(0, 'quiz1', 'descruiption')
  adminQuizCreate(0, 'quiz2', 'descruiption')
  adminQuizCreate(0, 'quiz3', 'descruiption')
  adminQuizRemove(0, 1)
  expect(adminQuizRemove(0, 0)).toStrictEqual({})
})
