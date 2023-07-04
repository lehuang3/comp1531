import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizRemove, requestAdminQuizList } from './other'
import { TokenParameter } from './interfaces';
import { token } from 'morgan';
let token1: TokenParameter;

let quiz: any;
// Runs before each test
beforeEach(() => {
  requestClear()
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body;
  quiz = requestAdminQuizCreate(token1, 'quiz1', 'Descritpion').body;
  
})


test('Not current sessions', () => {
  const token2 = {
    token: (parseInt(token1.token) + 1).toString(),
  }
  const response = requestAdminQuizList(token2)
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(403);
})

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body;
  const response = requestAdminQuizList(token4)
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(401);
})


test('Valid entry', () => {
  
  requestAdminQuizCreate(token1, 'quiz2', 'Descritpion').body;
  const response = requestAdminQuizList(token1)
  expect(response.body).toStrictEqual({
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
