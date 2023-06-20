import { adminQuizInfo, adminQuizCreate } from './quiz.js';
import { clear } from './other.js';
import { adminAuthLogin, adminAuthRegister } from './auth.js'

beforeEach(() => {
  clear();
});

describe ('Valid inputs, test pass', () => {
  test('Test 1 correct inputs', () => {
    adminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test');
    let user = adminAuthLogin('123@email.com', '123adjakjfhgaA')
    let quiz = adminQuizCreate(user.authUserId, 'quizhello', 'quiz1number');
    let quiz1 = adminQuizCreate(user.authUserId, 'quiz123', 'quizname');
    let quiz2 = adminQuizCreate(user.authUserId, 'test', 'A simple quiz');
    expect(adminQuizInfo(user.authUserId, quiz.quizId)).toMatchObject({
      quizId: expect.any(Number),
      name: 'quizhello',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz1number',
    });
    expect(adminQuizInfo(user.authUserId, quiz1.quizId)).toMatchObject({
      quizId: expect.any(Number),
      name: 'quiz123',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quizname',
    });
    expect(adminQuizInfo(user.authUserId, quiz2.quizId)).toMatchObject({
      quizId: expect.any(Number),
      name: 'test',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'A simple quiz',
    });

  })
  test('Test 2 correct inputs', () => {
    adminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test');
    let user2 = adminAuthLogin('12345@email.com', '123adjakjfhgaA')
    let quiz = adminQuizCreate(user2.authUserId, 'quizname1', 'quiz123');
    let quiz1 = adminQuizCreate(user2.authUserId, 'quizname', 'quiz456');
    let quiz2 = adminQuizCreate(user2.authUserId, 'withspechar', 'difficulty 3 *');
    expect(adminQuizInfo(user2.authUserId, quiz.quizId)).toMatchObject({
      quizId: expect.any(Number),
      name: 'quizname1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz123',
    });
    expect(adminQuizInfo(user2.authUserId, quiz1.quizId)).toMatchObject({
      quizId: expect.any(Number),
      name: 'quizname',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz456',
    });
    expect(adminQuizInfo(user2.authUserId, quiz2.quizId)).toMatchObject({
      quizId: expect.any(Number),
      name: 'withspechar',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'difficulty 3 *',
    });
  })




})

describe ('Invalid authUserId', () => {
  test('Test 1 invalid authUserId', () => {
    adminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test');
    let user = adminAuthLogin('123@email.com', '123adjakjfhgaA')
    let quiz = adminQuizCreate(user.authUserId, 'quizhello', 'quiz1number');
    let quiz1 = adminQuizCreate(user.authUserId, 'quiz123', 'quizname');
    expect(adminQuizInfo(-1, quiz.quizId)).toStrictEqual({ error: 'Not a valid user.'})
    expect(adminQuizInfo(-1, quiz1.quizId)).toStrictEqual({ error: 'Not a valid user.'})
  })
  test('Test 2 invalid authUserId', () => {
    adminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test');
    let user2 = adminAuthLogin('12345@email.com', '123adjakjfhgaA')
    let quiz = adminQuizCreate(user2.authUserId, 'quizname1', 'quiz123');
    let quiz1 = adminQuizCreate(user2.authUserId, 'quizname', 'quiz456');
    expect(adminQuizInfo(-2, quiz.quizId)).toStrictEqual({ error: 'Not a valid user.'})
    expect(adminQuizInfo(-2, quiz1.quizId)).toStrictEqual({ error: 'Not a valid user.'})
  })
})

describe ('Invalid quizId', () => {
  test('Test 1 invalid quizId', () => {
    adminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test');
    let user = adminAuthLogin('123@email.com', '123adjakjfhgaA')
    let quiz = adminQuizCreate(user.authUserId, 'quizhello', 'quiz1number');
    let quiz1 = adminQuizCreate(user.authUserId, 'quiz123', 'quizname');
    expect(adminQuizInfo(user.authUserId, -1)).toStrictEqual({ error: 'Quiz does not exist.'})
    expect(adminQuizInfo(user.authUserId, -1)).toStrictEqual({ error: 'Quiz does not exist.'})
  })
  test('Test 2 invalid quizId', () => {
    adminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test');
    let user2 = adminAuthLogin('12345@email.com', '123adjakjfhgaA')
    let quiz = adminQuizCreate(user2.authUserId, 'quizname1', 'quiz123');
    let quiz1 = adminQuizCreate(user2.authUserId, 'quizname', 'quiz456');
    expect(adminQuizInfo(user2.authUserId, -2)).toStrictEqual({ error: 'Quiz does not exist.'})
    expect(adminQuizInfo(user2.authUserId, -2)).toStrictEqual({ error: 'Quiz does not exist.'})
  })
})

describe ('No permission to view quiz', () => {
  test('Test two users trying to access quizzes they do not own', () => {
    adminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test');
    let user = adminAuthLogin('123@email.com', '123adjakjfhgaA')
    let quiz = adminQuizCreate(user.authUserId, 'quizhello', 'quiz1number');
    let quiz1 = adminQuizCreate(user.authUserId, 'quiz123', 'quizname');
    adminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test');
    let user2 = adminAuthLogin('12345@email.com', '123adjakjfhgaA')
    let quiz2 = adminQuizCreate(user2.authUserId, 'quizname1', 'quiz123');
    let quiz3 = adminQuizCreate(user2.authUserId, 'quizname', 'quiz456');
    expect(adminQuizInfo(user.authUserId, quiz2.quizId)).toStrictEqual({ error: 'You do not have access to this quiz.'})
    expect(adminQuizInfo(user.authUserId, quiz3.quizId)).toStrictEqual({ error: 'You do not have access to this quiz.'})
    expect(adminQuizInfo(user2.authUserId, quiz1.quizId)).toStrictEqual({ error: 'You do not have access to this quiz.'})
    expect(adminQuizInfo(user2.authUserId, quiz.quizId)).toStrictEqual({ error: 'You do not have access to this quiz.'})
  })
})

