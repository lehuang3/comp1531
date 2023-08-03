import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizTrashEmpty, requestAdminQuizRemove, requestAdminQuizTrash } from './other';
let token1: string;

let quiz1: number;
// Runs before each test
beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quiz1', 'Descritpion').body.quizId;
});

test('Check for invalid token structure', () => {
  const invalidToken = requestAdminAuthRegister('Minh@gmail.com', '', 'Minh', 'Le').body.token;
  const response = requestAdminQuizTrashEmpty(invalidToken, `[${quiz1}]`);
  expect(response.body).toStrictEqual({
    error: 'Invalid token structure',
  });
  expect(response.status).toStrictEqual(401);
});

test('Check for invalid session', () => {
  const wrongToken = (parseInt(token1) + 1).toString();

  // right structure, but there's no token like this in the tokens array
  const response = requestAdminQuizTrashEmpty(wrongToken, `[${quiz1}]`);
  expect(response.body).toStrictEqual({
    error: 'Not a valid session'
  });
  expect(response.status).toStrictEqual(403);
});

test('1 x quiz in the trash, quizId is invalid', () => {
  requestAdminQuizRemove(token1, quiz1);
  const response = requestAdminQuizTrashEmpty(token1, `[${quiz1 + 1}]`);
  expect(response.body).toStrictEqual({
    error: 'One or more of the quizzes is not a valid quiz'
  });
  expect(response.status).toStrictEqual(400);
});

test('2 x quiz in the trash, delete both but 1 x quizId is invalid', () => {
  const quiz2 = requestAdminQuizCreate(token1, 'quiz2', 'Descritpion').body.quizId;
  requestAdminQuizRemove(token1, quiz1);
  requestAdminQuizRemove(token1, quiz2);
  const response = requestAdminQuizTrashEmpty(token1, `[${quiz1}, ${quiz2 + 1}]`);
  expect(response.body).toStrictEqual({
    error: 'One or more of the quizzes is not a valid quiz'
  });
  expect(response.status).toStrictEqual(400);
});

test('1 x quiz in the trash, quizId is of another quiz that token1 cannot access', () => {
  const token2 = requestAdminAuthRegister('Le@gmail.com', '1234abcd', 'Le', 'Huang').body.token;
  requestAdminQuizRemove(token1, quiz1);
  const response = requestAdminQuizTrashEmpty(token2, `[${quiz1}]`);
  expect(response.body).toStrictEqual({
    error: 'One or more of the quizzes refers to a quiz that this current user does not own'
  });
  expect(response.status).toStrictEqual(400);
});

test('2 x quiz in the trash, remove both but 1 x quizId is of another quiz that token1 cannot access', () => {
  const token2 = requestAdminAuthRegister('Le@gmail.com', '1234abcd', 'Le', 'Huang').body.token;
  const quiz2 = requestAdminQuizCreate(token2, 'quiz2', 'Descritpion').body.quizId;
  requestAdminQuizRemove(token1, quiz1);
  requestAdminQuizRemove(token2, quiz2);
  const response = requestAdminQuizTrashEmpty(token2, `[${quiz1}, ${quiz2}]`);
  expect(response.body).toStrictEqual({
    error: 'One or more of the quizzes refers to a quiz that this current user does not own'
  });
  expect(response.status).toStrictEqual(400);
});

test('trash is empty', () => {
  const response = requestAdminQuizTrashEmpty(token1, '[]');
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
});

test('trash is empty, remove 1 x quiz not in the trash', () => {
  const response = requestAdminQuizTrashEmpty(token1, `[${quiz1}]`);
  expect(response.body).toStrictEqual({
    error: 'One or more of the quizzes is not currently in the trash'
  });
  expect(response.status).toStrictEqual(400);
});

test('trash has 1 quiz, remove no quiz', () => {
  requestAdminQuizRemove(token1, quiz1);
  const response = requestAdminQuizTrashEmpty(token1, '[]');
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);

  const trash = requestAdminQuizTrash(token1).body;
  expect(trash).toStrictEqual({
    quizzes: [
      {
        quizId: quiz1,
        name: expect.any(String)
      }
    ]
  });
});

test('trash has 1 quiz, remove 1 quiz', () => {
  requestAdminQuizRemove(token1, quiz1);
  const response = requestAdminQuizTrashEmpty(token1, `[${quiz1}]`);
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);

  const trash = requestAdminQuizTrash(token1).body;
  expect(trash).toStrictEqual({
    quizzes: []
  });
});

test('trash has 2 quizzes, remove 2 quiz', () => {
  const quiz2 = requestAdminQuizCreate(token1, 'quiz2', 'Descritpion').body.quizId;
  requestAdminQuizRemove(token1, quiz1);
  requestAdminQuizRemove(token1, quiz2);
  let trash = requestAdminQuizTrash(token1).body;
  expect(trash).toStrictEqual({
    quizzes: [
      {
        quizId: quiz1,
        name: expect.any(String)
      },
      {
        quizId: quiz2,
        name: expect.any(String)
      }
    ]
  });
  const response = requestAdminQuizTrashEmpty(token1, `[${quiz1}, ${quiz2}]`);
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);

  trash = requestAdminQuizTrash(token1).body;
  expect(trash).toStrictEqual({
    quizzes: []
  });
});
