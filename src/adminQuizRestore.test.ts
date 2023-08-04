import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizRemove, requestAdminQuizRestore, v1requestAdminQuizRestore } from './request';

let token1: string;
let quiz1: number;

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quizhello', 'quiz1number').body.quizId;
  requestAdminQuizRemove(token1, quiz1);
});

// v1
test('Correct params', () => {
  expect(v1requestAdminQuizRestore(token1, quiz1).body).toStrictEqual({ });
});

describe('QuizId is not valid', () => {
  test('negative quizId', () => {
    expect(v1requestAdminQuizRestore(token1, -1).body).toStrictEqual({ error: 'Not a valid quiz' });
  });
});

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken1 = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy').body.token;
    expect(v1requestAdminQuizRestore(invalidToken1, quiz1).body).toStrictEqual({ error: 'Invalid token structure' });
  });
});

describe('Invalid session', () => {
  test('Test 1 invalid authUserId', () => {
    const tokenInvalid = '-1';

    expect(v1requestAdminQuizRestore(tokenInvalid, quiz1).body).toStrictEqual({ error: 'Not a valid session' });
  });
});

// v2
describe('Passing cases', () => {
  test('Correct params', () => {
    expect(requestAdminQuizRestore(token1, quiz1).body).toStrictEqual({ });
  });
});

describe('QuizId is not valid', () => {
  test('negative quizId', () => {
    expect(requestAdminQuizRestore(token1, -1).body).toStrictEqual({ error: 'Not a valid quiz' });
  });
});

describe('No ownership of quiz', () => {
  test('token1 attempts to restore quiz owned by 2', () => {
    const token2 = requestAdminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test').body.token;
    const quiz2 = requestAdminQuizCreate(token2, 'quizname1', 'quiz123').body.quizId;
    requestAdminQuizRemove(token2, quiz2);
    expect(requestAdminQuizRestore(token1, quiz2).body).toStrictEqual({ error: 'You do not have access to this quiz.' });
  });
});

describe('Quiz not in trash', () => {
  test('quiz 2 not in trash', () => {
    const quiz2 = requestAdminQuizCreate(token1, 'quiz123', 'quizname').body.quizId;
    expect(requestAdminQuizRestore(token1, quiz2).body).toStrictEqual({ error: 'Quiz not in trash.' });
  });
});

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken1 = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy').body.token;
    expect(requestAdminQuizRestore(invalidToken1, quiz1).body).toStrictEqual({ error: 'Invalid token structure' });
  });
});

describe('Invalid session', () => {
  test('Test 1 invalid authUserId', () => {
    const tokenInvalid = '-1';

    expect(requestAdminQuizRestore(tokenInvalid, quiz1).body).toStrictEqual({ error: 'Not a valid session' });
  });
});
