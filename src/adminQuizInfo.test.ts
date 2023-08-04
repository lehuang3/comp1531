import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizInfo, v1requestAdminQuizInfo } from './request';

let token1: string;
let quiz1: number;

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quizhello', 'quiz1number').body.quizId;
});
// v1
test('Test 1 correct inputs', () => {
  expect(v1requestAdminQuizInfo(token1, quiz1).body).toMatchObject({
    quizId: expect.any(Number),
    name: 'quizhello',
    timeCreated: expect.any(Number),
    timeLastEdited: expect.any(Number),
    description: 'quiz1number'
  });
});

describe('Invalid session', () => {
  test('Test 1 invalid authUserId', () => {
    const tokenInvalid = '-1';

    expect(v1requestAdminQuizInfo(tokenInvalid, quiz1).body).toStrictEqual({ error: 'Not a valid session' });
  });
});

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken1 = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy').body.token;
    expect(v1requestAdminQuizInfo(invalidToken1, quiz1).body).toStrictEqual({ error: 'Invalid token structure' });
  });
});

describe('Invalid quizId', () => {
  test('Test 1 invalid quizId', () => {
    expect(v1requestAdminQuizInfo(token1, -1).body).toStrictEqual({ error: 'Quiz does not exist' });
  });
});

// v2
describe('Valid inputs, test pass', () => {
  test('Test 1 correct inputs', () => {
    expect(requestAdminQuizInfo(token1, quiz1).body).toMatchObject({
      quizId: expect.any(Number),
      name: 'quizhello',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz1number'
    });
  });
});

describe('Invalid session', () => {
  test('Test 1 invalid authUserId', () => {
    const tokenInvalid = '-1';

    expect(requestAdminQuizInfo(tokenInvalid, quiz1).body).toStrictEqual({ error: 'Not a valid session' });
  });
});

describe('Invalid quizId', () => {
  test('Test 1 invalid quizId', () => {
    expect(requestAdminQuizInfo(token1, -1).body).toStrictEqual({ error: 'Quiz does not exist' });
  });
});

describe('No permission to view quiz', () => {
  test('Test 1, two users trying to access quizzes they do not own', () => {
    const token2 = requestAdminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test').body.token;
    const quiz3 = requestAdminQuizCreate(token2, 'quizname1', 'quiz123').body.quizId;
    expect(requestAdminQuizInfo(token1, quiz3).body).toStrictEqual({ error: 'You do not have access to this quiz.' });
  });
});

describe('Invalid session', () => {
  test('Test 1 invalid authUserId', () => {
    const tokenInvalid = '-1';

    expect(requestAdminQuizInfo(tokenInvalid, quiz1).body).toStrictEqual({ error: 'Not a valid session' });
  });
});

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken1 = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy').body.token;
    expect(requestAdminQuizInfo(invalidToken1, quiz1).body).toStrictEqual({ error: 'Invalid token structure' });
  });
});
