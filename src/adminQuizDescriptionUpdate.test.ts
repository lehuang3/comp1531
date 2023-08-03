import { requestClear, requestAdminAuthRegister, requestAdminQuizDescriptionUpdate, requestAdminQuizCreate, v1requestAdminQuizDescriptionUpdate, requestAdminQuizRemove } from './request';
let token1: string;
let quiz1: number;

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quiz', '').body.quizId;
});

test('Check for valid quiz - description with moderate length', () => {
  const response = v1requestAdminQuizDescriptionUpdate(token1, quiz1, 'this quiz now has description');
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
});

test('Check for invalid token structure', () => {
  // console.log(token1);
  const token2 = requestAdminAuthRegister('Minh@gmail.com', '', 'Minh', 'Le').body.token;
  const response = requestAdminQuizDescriptionUpdate(token2, quiz1, '');
  expect(response.body).toStrictEqual({
    error: 'Invalid token structure',
  });
  expect(response.status).toStrictEqual(401);
});

test('Check for invalid session', () => {
  const token2 = (parseInt(token1) + 1).toString();

  const response = requestAdminQuizDescriptionUpdate(token2, quiz1, '');
  expect(response.body).toStrictEqual({
    error: 'Not a valid session'
  });
  expect(response.status).toStrictEqual(403);
});

test('Check for length of description', () => {
  const response = requestAdminQuizDescriptionUpdate(token1, quiz1, '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
  expect(response.body).toStrictEqual({
    error: 'Description is too long'
  });
  expect(response.status).toStrictEqual(400);
});

test('Check for invalid quiz', () => {
  const response = requestAdminQuizDescriptionUpdate(token1, quiz1 + 1, 'this quiz now has description');
  expect(response.body).toStrictEqual({
    error: 'Not a valid quiz'
  });
  expect(response.status).toStrictEqual(400);
});

test('Check for ownership', () => {
  const token2 = requestAdminAuthRegister('Le@gmail.com', '1234abcd', 'Le', 'Huang').body.token;
  const response = requestAdminQuizDescriptionUpdate(token2, quiz1, 'this quiz now has description');
  expect(response.body).toStrictEqual({
    error: 'This quiz is owned by another user'
  });
  expect(response.status).toStrictEqual(400);
});

describe('Check for valid quiz', () => {
  test('Check for valid quiz - description with moderate length', () => {
    const response = requestAdminQuizDescriptionUpdate(token1, quiz1, 'this quiz now has description');
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
  });

  test('Check for valid quiz - empty description', () => {
    const response = requestAdminQuizDescriptionUpdate(token1, quiz1, '');
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
  });
});

test('Quiz in trash', () => {
  requestAdminQuizRemove(token1, quiz1)
  const response = requestAdminQuizDescriptionUpdate(token1, quiz1, '');
  expect(response.body).toStrictEqual({error: 'Quiz is in trash.'});
  expect(response.status).toStrictEqual(400);
});