import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizList } from './other';
let token1: string;

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  requestAdminQuizCreate(token1, 'quiz1', 'Descritpion');
});

test('Not current sessions', () => {
  const token2 = (parseInt(token1) + 1).toString();

  const response = requestAdminQuizList(token2);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(403);
});

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body.token;
  const response = requestAdminQuizList(token4);
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(401);
});

test('Valid entry', () => {
  requestAdminQuizCreate(token1, 'quiz2', 'Descritpion');
  const response = requestAdminQuizList(token1);
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
  });
});
