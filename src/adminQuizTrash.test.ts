import { requestClear, requestAdminAuthRegister, requestAdminQuizRemove, requestAdminQuizCreate, requestAdminQuizTrash } from './other';
let token1: string;
let quiz1: any;

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quiz', '').body;
});

test('Check for invalid token structure', () => {
  // console.log(token1);
  const token2 = requestAdminAuthRegister('Minh@gmail.com', '', 'Minh', 'Le').body.token;
  const response = requestAdminQuizTrash(token2);
  expect(response.body).toStrictEqual({
    error: 'Invalid token structure',
  });
  expect(response.status).toStrictEqual(401);
});

test('Check for invalid session', () => {
  const token2 = (parseInt(token1) + 1).toString();

  const response = requestAdminQuizTrash(token2);
  expect(response.body).toStrictEqual({
    error: 'Not a valid session'
  });
  expect(response.status).toStrictEqual(403);
});

test('1 quiz in trash', () => {
  requestAdminQuizRemove(token1, quiz1.quizId);
  const response = requestAdminQuizTrash(token1);
  expect(response.body).toStrictEqual({
    quizzes: [
      {
        quizId: quiz1.quizId,
        name: 'quiz',
      }
    ]
  });
  expect(response.status).toStrictEqual(200);
});

test('1 quiz in trash but wrong user', () => {
  const token2 = requestAdminAuthRegister('Le@gmail.com', '1234abcd', 'Le', 'Huang').body.token;
  requestAdminQuizRemove(token1, quiz1.quizId);
  const response = requestAdminQuizTrash(token2);
  expect(response.body).toStrictEqual({
    quizzes: []
  });
  expect(response.status).toStrictEqual(200);
});

test('empty trash', () => {
  const response = requestAdminQuizTrash(token1);
  expect(response.body).toStrictEqual({
    quizzes: [],
  });
  expect(response.status).toStrictEqual(200);
});

test('2 quizzes in trash', () => {
  const quiz2 = requestAdminQuizCreate(token1, 'another quiz', '').body;
  requestAdminQuizRemove(token1, quiz1.quizId);
  requestAdminQuizRemove(token1, quiz2.quizId);
  const response = requestAdminQuizTrash(token1);
  expect(response.body).toStrictEqual({
    quizzes: [
      {
        quizId: quiz1.quizId,
        name: 'quiz',
      },
      {
        quizId: quiz2.quizId,
        name: 'another quiz',
      }
    ]
  });
  expect(response.status).toStrictEqual(200);
});

test('2 quizzes in trash, user owns 1 of them', () => {
  const token2 = requestAdminAuthRegister('Le@gmail.com', '1234abcd', 'Le', 'Huang').body.token;
  const quiz2 = requestAdminQuizCreate(token2, 'another quiz', '').body;
  requestAdminQuizRemove(token1, quiz1.quizId);
  requestAdminQuizRemove(token2, quiz2.quizId);
  const response = requestAdminQuizTrash(token1);
  expect(response.body).toStrictEqual({
    quizzes: [
      {
        quizId: quiz1.quizId,
        name: 'quiz',
      }
    ]
  });
  expect(response.status).toStrictEqual(200);
});
