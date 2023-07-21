import { requestClear, requestAdminAuthRegister, requestAdminQuizNameUpdate, requestAdminQuizCreate } from './other';

let token1: any;
let quiz1: any;
let token2: any;
let quiz2: any;

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
  quiz1 = requestAdminQuizCreate(token1.body.token, 'quiz', 'quiz1');
  token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test');
  quiz2 = requestAdminQuizCreate(token2.body.token, 'quiz', 'quiz1');
});

describe('Passing cases', () => {
  test('User 1 changes quiz name to valid quiz name', () => {
    expect(requestAdminQuizNameUpdate(token1.body.token, quiz1.body.quizId, 'quiz2').body).toStrictEqual({ });
  });
  test('User 2 changes quiz name to valid quiz name', () => {
    expect(requestAdminQuizNameUpdate(token2.body.token, quiz2.body.quizId, 'abc').body).toStrictEqual({ });
  });
});

describe('authUserId is not valid', () => {
  test('User 1 tries to change user 2 quiz name', () => {
    expect(requestAdminQuizNameUpdate(token1.body.token, quiz2.body.quizId, 'quiz2').body).toStrictEqual({ error: 'You do not have access to this quiz.' });
  });
  test('User 2 tries to change user 1 quiz name', () => {
    expect(requestAdminQuizNameUpdate(token2.body.token, quiz1.body.quizId, 'quiz2').body).toStrictEqual({ error: 'You do not have access to this quiz.' });
  });
});

describe('quizId is not valid', () => {
  test('User 1 negative quizId not valid', () => {
    expect(requestAdminQuizNameUpdate(token1.body.token, -1, 'quiz2').body).toStrictEqual({ error: 'Quiz does not exist.' });
  });
  test('User 2 negative quizId not valid', () => {
    expect(requestAdminQuizNameUpdate(token2.body.token, -2, 'quiz2').body).toStrictEqual({ error: 'Quiz does not exist.' });
  });
});

describe('Quiz name is not valid', () => {
  test('User 1 quiz name not valid', () => {
    expect(requestAdminQuizNameUpdate(token1.body.token, quiz1.body.quizId, 'quiz#').body).toStrictEqual({ error: 'Quiz name cannot have special characters.' });
  });
  test('User 2 quiz name not valid', () => {
    expect(requestAdminQuizNameUpdate(token2.body.token, quiz2.body.quizId, 'ad12_131').body).toStrictEqual({ error: 'Quiz name cannot have special characters.' });
  });
});

describe('Quiz name too long or short', () => {
  test('User 1 quiz too short', () => {
    expect(requestAdminQuizNameUpdate(token1.body.token, quiz1.body.quizId, 'q1').body).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' });
  });
  test('User 2 quiz too long', () => {
    expect(requestAdminQuizNameUpdate(token2.body.token, quiz2.body.quizId, '1231245523414535234115234541352562134265afasf').body).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' });
  });
});

describe('Quiz name already used', () => {
  test('User 1 quiz name already used', () => {
    requestAdminQuizCreate(token1.body.token, 'newquiz', 'quiz1');
    expect(requestAdminQuizNameUpdate(token1.body.token, quiz1.body.quizId, 'newquiz').body).toStrictEqual({ error: 'Quiz name already exists.' });
  });
  test('User 2 quiz name already used', () => {
    requestAdminQuizCreate(token2.body.token, 'newquiz1', 'quiz1');
    expect(requestAdminQuizNameUpdate(token2.body.token, quiz2.body.quizId, 'newquiz1').body).toStrictEqual({ error: 'Quiz name already exists.' });
  });
});

describe('Invalid session', () => {
  test('Test 1 invalid user', () => {
    const brokenToken = '-1';

    expect(requestAdminQuizNameUpdate(brokenToken, quiz1.body.quzId, 'broken quiz').body).toStrictEqual({ error: 'Not a valid session' });
  });
});

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken1 = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy');
    expect(requestAdminQuizNameUpdate(invalidToken1.body.token, quiz1.body.quizId, 'ghsakgjh').body).toStrictEqual({ error: 'Invalid token structure' });
  });
});
