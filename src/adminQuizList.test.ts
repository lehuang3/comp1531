import { adminQuizCreate, adminQuizList } from './quiz.js'
import { adminAuthRegister } from './auth.js'
import { clear } from './other.js'
// Runs before each test
beforeEach(() => {
  clear()
})

test('Invalid User ID', () => {
  adminAuthRegister('Sina.hafezimasoomi@gmail.com', 'Sina12356789', 'Sina', 'Hafezi')
  adminQuizCreate(0, 'Sina', 'descruiption')
  expect(adminQuizList(2)).toStrictEqual({ error: expect.any(String) })
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
