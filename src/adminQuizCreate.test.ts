import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate } from './other'
let token1: string;
// Runs before each test
beforeEach(() => {
  requestClear()
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
})


test('Empty name', () => {
  const response = requestAdminQuizCreate(token1, '', 'descruiption')
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('name < 3', () => {
  const response = requestAdminQuizCreate(token1, 'fg', 'descruiption')
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('name > 30', () => {
  const response = requestAdminQuizCreate(token1, 'WhisperingMoonlitMysteries1235649', 'descruiption')
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('name only has !', () => {
  const response = requestAdminQuizCreate(token1, '!', 'descruiption')
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('name only has space', () => {
  const response = requestAdminQuizCreate(token1, ' ', 'descruiption')
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('name with space', () => {
  const response = requestAdminQuizCreate(token1, 'Hellow world', 'descruiption')
  expect(response.body).toStrictEqual({ quizId: expect.any(Number) })
  expect(response.status).toStrictEqual(200);
})


test('name in use', () => {
  requestAdminQuizCreate(token1, 'quiz1', 'descruiption')
  const response = requestAdminQuizCreate(token1, 'quiz1', 'descruiption')
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Invalid sessions', () => {
  const token2 = (parseInt(token1) + 1).toString();
  
  const response = requestAdminQuizCreate(token2, 'Hellow world', 'descruiption')
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(403);
})


test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body.token;
  const response = requestAdminQuizCreate(token4, 'Hellow world', 'descruiption');
  expect(response.body).toStrictEqual({ error: expect.any(String) });
  expect(response.status).toStrictEqual(401);
})


test('Description > 100', () => {
  const response = requestAdminQuizCreate(token1, 'quiz1', 'EnigmaticUniverseSparklingWithInfinitePossibilities1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
  expect(response.body).toStrictEqual({ error: expect.any(String) })
  expect(response.status).toStrictEqual(400);
})

test('Valid entry', () => {
  const response = requestAdminQuizCreate(token1, 'quiz1', 'Descritpion')
  expect(response.body).toStrictEqual({ quizId: expect.any(Number) })
  expect(response.status).toStrictEqual(200);
})
