import { requestAdminQuizInfo, requestAdminQuizCreate } from './quiz.js'
import { requestClear, requestGetAdminUserDetails, requestAdminAuthRegister } from './other';
import { requestAdminAuthRegister } from './auth.js'

beforeEach(() => {
  clear()
})

describe('Valid inputs, test pass', () => {
  test('Test 1 correct inputs', () => {
    const token = requestAdminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test')
    const quiz = requestAdminQuizCreate(token.authUserId, 'quizhello', 'quiz1number')
    const quiz1 = requestAdminQuizCreate(token.authUserId, 'quiz123', 'quizname')
    const quiz2 = requestAdminQuizCreate(token.authUserId, 'test', 'A simple quiz')
    expect(requestAdminQuizInfo(token.authUserId, quiz.quizId)).toMatchObject({
      quizId: expect.any(Number),
      name: 'quizhello',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz1number'
    })
    expect(requestAdminQuizInfo(token.authUserId, quiz1.quizId)).toMatchObject({
      quizId: expect.any(Number),
      name: 'quiz123',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quizname'
    })
    expect(requestAdminQuizInfo(token.authUserId, quiz2.quizId)).toMatchObject({
      quizId: expect.any(Number),
      name: 'test',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'A simple quiz'
    })
  })
  test('Test 2 correct inputs', () => {
    const token1 = requestAdminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test')
    const quiz = requestAdminQuizCreate(token1.authUserId, 'quizname1', 'quiz123')
    const quiz1 = requestAdminQuizCreate(token1.authUserId, 'quizname', 'quiz456')
    const quiz2 = requestAdminQuizCreate(token1.authUserId, 'withspechar', 'difficulty 3 *')
    expect(requestAdminQuizInfo(token1.authUserId, quiz.quizId)).toMatchObject({
      quizId: expect.any(Number),
      name: 'quizname1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz123'
    })
    expect(requestAdminQuizInfo(token1.authUserId, quiz1.quizId)).toMatchObject({
      quizId: expect.any(Number),
      name: 'quizname',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz456'
    })
    expect(requestAdminQuizInfo(token1.authUserId, quiz2.quizId)).toMatchObject({
      quizId: expect.any(Number),
      name: 'withspechar',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'difficulty 3 *'
    })
  })
})

describe('Invalid authUserId', () => {
  test('Test 1 invalid authUserId', () => {
    const token = requestAdminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test')
    const quiz = requestAdminQuizCreate(token.authUserId, 'quizhello', 'quiz1number')
    const quiz1 = requestAdminQuizCreate(token.authUserId, 'quiz123', 'quizname')
    expect(requestAdminQuizInfo(-1, quiz.quizId)).toStrictEqual({ error: 'Not a valid user.' })
    expect(requestAdminQuizInfo(-1, quiz1.quizId)).toStrictEqual({ error: 'Not a valid user.' })
  })
  test('Test 2 invalid authUserId', () => {
    const token1 = requestAdminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test')
    const quiz = requestAdminQuizCreate(token1.authUserId, 'quizname1', 'quiz123')
    const quiz1 = requestAdminQuizCreate(token1.authUserId, 'quizname', 'quiz456')
    expect(requestAdminQuizInfo(-2, quiz.quizId)).toStrictEqual({ error: 'Not a valid user.' })
    expect(requestAdminQuizInfo(-2, quiz1.quizId)).toStrictEqual({ error: 'Not a valid user.' })
  })
})

describe('Invalid quizId', () => {
  test('Test 1 invalid quizId', () => {
    const token = requestAdminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test')
    const quiz = requestAdminQuizCreate(token.authUserId, 'quizhello', 'quiz1number')
    const quiz1 = requestAdminQuizCreate(token.authUserId, 'quiz123', 'quizname')
    expect(requestAdminQuizInfo(token.authUserId, -1)).toStrictEqual({ error: 'Quiz does not exist.' })
    expect(requestAdminQuizInfo(token.authUserId, -1)).toStrictEqual({ error: 'Quiz does not exist.' })
  })
  test('Test 2 invalid quizId', () => {
    const token1 = requestAdminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test')
    const quiz = requestAdminQuizCreate(token1.authUserId, 'quizname1', 'quiz123')
    const quiz1 = requestAdminQuizCreate(token1.authUserId, 'quizname', 'quiz456')
    expect(requestAdminQuizInfo(token1.authUserId, -2)).toStrictEqual({ error: 'Quiz does not exist.' })
    expect(requestAdminQuizInfo(token1.authUserId, -2)).toStrictEqual({ error: 'Quiz does not exist.' })
  })
})

describe('No permission to view quiz', () => {
  test('Test two users trying to access quizzes they do not own', () => {
    const token = requestAdminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test')
    const quiz = requestAdminQuizCreate(token.authUserId, 'quizhello', 'quiz1number')
    const quiz1 = requestAdminQuizCreate(token.authUserId, 'quiz123', 'quizname')
    const token1 = requestAdminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test')
    const quiz2 = requestAdminQuizCreate(token1.authUserId, 'quizname1', 'quiz123')
    const quiz3 = requestAdminQuizCreate(token1.authUserId, 'quizname', 'quiz456')
    expect(requestAdminQuizInfo(token.authUserId, quiz2.quizId)).toStrictEqual({ error: 'You do not have access to this quiz.' })
    expect(requestAdminQuizInfo(token.authUserId, quiz3.quizId)).toStrictEqual({ error: 'You do not have access to this quiz.' })
    expect(requestAdminQuizInfo(token1.authUserId, quiz1.quizId)).toStrictEqual({ error: 'You do not have access to this quiz.' })
    expect(requestAdminQuizInfo(token1.authUserId, quiz.quizId)).toStrictEqual({ error: 'You do not have access to this quiz.' })
  })
})
