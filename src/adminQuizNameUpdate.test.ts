import { requestClear, requestAdminAuthRegister, requestAdminQuizNameUpdate, requestAdminQuizCreate, v1requestAdminQuizNameUpdate, requestAdminQuizRemove } from './request';

let token1: string;
let quiz1: number;
let token2: string;
let quiz2: number;

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quiz', 'quiz1').body.quizId;
  token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test').body.token;
  quiz2 = requestAdminQuizCreate(token2, 'quiz', 'quiz1').body.quizId;
});

// v1
test('User 1 changes quiz name to valid quiz name', () => {
  expect(v1requestAdminQuizNameUpdate(token1, quiz1, 'quiz2').body).toStrictEqual({ });
});
test('User 1 tries to change user 2 quiz name', () => {
  expect(v1requestAdminQuizNameUpdate(token1, quiz2, 'quiz2').body).toStrictEqual({ error: 'You do not have access to this quiz.' });
});

describe('Invalid session', () => {
  test('Test 1 invalid user', () => {
    const brokenToken = '-1';

    expect(v1requestAdminQuizNameUpdate(brokenToken, quiz1, 'broken quiz').body).toStrictEqual({ error: 'Not a valid session' });
  });
});

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken1 = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy').body.token;
    expect(v1requestAdminQuizNameUpdate(invalidToken1, quiz1, 'ghsakgjh').body).toStrictEqual({ error: 'Invalid token structure' });
  });
});

// v2
describe('Passing cases', () => {
  test('User 1 changes quiz name to valid quiz name', () => {
    expect(requestAdminQuizNameUpdate(token1, quiz1, 'quiz2').body).toStrictEqual({ });
  });
  test('User 2 changes quiz name to valid quiz name', () => {
    expect(requestAdminQuizNameUpdate(token2, quiz2, 'abc').body).toStrictEqual({ });
  });
});

describe('authUserId is not valid', () => {
  test('User 1 tries to change user 2 quiz name', () => {
    expect(requestAdminQuizNameUpdate(token1, quiz2, 'quiz2').body).toStrictEqual({ error: 'You do not have access to this quiz.' });
  });
  test('User 2 tries to change user 1 quiz name', () => {
    expect(requestAdminQuizNameUpdate(token2, quiz1, 'quiz2').body).toStrictEqual({ error: 'You do not have access to this quiz.' });
  });
});

describe('quizId is not valid', () => {
  test('User 1 negative quizId not valid', () => {
    expect(requestAdminQuizNameUpdate(token1, -1, 'quiz2').body).toStrictEqual({ error: 'Quiz does not exist.' });
  });
  test('User 2 negative quizId not valid', () => {
    expect(requestAdminQuizNameUpdate(token2, -2, 'quiz2').body).toStrictEqual({ error: 'Quiz does not exist.' });
  });
});

describe('Quiz name is not valid', () => {
  test('User 1 quiz name not valid', () => {
    expect(requestAdminQuizNameUpdate(token1, quiz1, 'quiz#').body).toStrictEqual({ error: 'Quiz name cannot have special characters.' });
  });
  test('User 2 quiz name not valid', () => {
    expect(requestAdminQuizNameUpdate(token2, quiz2, 'ad12_131').body).toStrictEqual({ error: 'Quiz name cannot have special characters.' });
  });
});

describe('Quiz name too long or short', () => {
  test('User 1 quiz too short', () => {
    expect(requestAdminQuizNameUpdate(token1, quiz1, 'q1').body).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' });
  });
  test('User 2 quiz too long', () => {
    expect(requestAdminQuizNameUpdate(token2, quiz2, '1231245523414535234115234541352562134265afasf').body).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' });
  });
});

describe('Quiz name already used', () => {
  test('User 1 quiz name already used', () => {
    requestAdminQuizCreate(token1, 'newquiz', 'quiz1');
    expect(requestAdminQuizNameUpdate(token1, quiz1, 'newquiz').body).toStrictEqual({ error: 'Quiz name already exists.' });
  });
  test('User 2 quiz name already used', () => {
    requestAdminQuizCreate(token2, 'newquiz1', 'quiz1');
    expect(requestAdminQuizNameUpdate(token2, quiz2, 'newquiz1').body).toStrictEqual({ error: 'Quiz name already exists.' });
  });
});

describe('Invalid session', () => {
  test('Test 1 invalid user', () => {
    const brokenToken = '-1';

    expect(requestAdminQuizNameUpdate(brokenToken, quiz1, 'broken quiz').body).toStrictEqual({ error: 'Not a valid session' });
  });
});

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken1 = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy').body.token;
    expect(requestAdminQuizNameUpdate(invalidToken1, quiz1, 'ghsakgjh').body).toStrictEqual({ error: 'Invalid token structure' });
  });
});

describe('Quiz in trash', () => {
  test('User 1 changes quiz name to valid quiz name', () => {
    requestAdminQuizRemove(token1, quiz1)
    expect(requestAdminQuizNameUpdate(token1, quiz1, 'quiz2').body).toStrictEqual({error: 'Quiz is in trash.' });
  });
});