import { adminQuizNameUpdate, adminQuizCreate } from './quiz.js'
import { adminAuthLogin, adminAuthRegister } from './auth.js'
import { requestClear, requestGetAdminUserDetails, requestAdminAuthRegister, requestAdminQuizNameUpdate, requestAdminQuizCreate} from './other'

let token1: any;
let quiz1: any;
let token2: any;
let quiz2: any;
let token3: any;
let quiz3: any;

beforeEach(() => {
  requestClear()
  const token = requestAdminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test')
  const quiz = requestAdminQuizCreate(token.authUserId, 'quizhello', 'quiz1number')
  const quiz1 = requestAdminQuizCreate(token.authUserId, 'quiz123', 'quizname')
  const quiz2 = requestAdminQuizCreate(token.authUserId, 'test', 'A simple quiz')
  
})

describe('Valid inputs, test pass', () => {
  test('Test 1 correct inputs', () => {
    const token = requestAdminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test')
    const quiz = requestAdminQuizCreate(token.authUserId, 'quizhello', 'quiz1number')
    const quiz1 = requestAdminQuizCreate(token.authUserId, 'quiz123', 'quizname')
    const quiz2 = requestAdminQuizCreate(token.authUserId, 'test', 'A simple quiz')
    expect(requestAdminQuizInfo(token.authUserId, quiz.quizId).body).toMatchObject({
      quizId: expect.any(Number),
      name: 'quizhello',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz1number'
    })
    expect(requestAdminQuizInfo(token.authUserId, quiz1.quizId).body).toMatchObject({
      quizId: expect.any(Number),
      name: 'quiz123',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quizname'
    })
    expect(requestAdminQuizInfo(token.authUserId, quiz2.quizId).body).toMatchObject({
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
    expect(requestAdminQuizInfo(token1.authUserId, quiz.quizId).body).toMatchObject({
      quizId: expect.any(Number),
      name: 'quizname1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz123'
    })
    expect(requestAdminQuizInfo(token1.authUserId, quiz1.quizId).body).toMatchObject({
      quizId: expect.any(Number),
      name: 'quizname',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz456'
    })
    expect(requestAdminQuizInfo(token1.authUserId, quiz2.quizId).body).toMatchObject({
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
    expect(requestAdminQuizInfo(-1, quiz.quizId).body).toStrictEqual({ error: 'Not a valid user.' })
    expect(requestAdminQuizInfo(-1, quiz1.quizId).body).toStrictEqual({ error: 'Not a valid user.' })
  })
  test('Test 2 invalid authUserId', () => {
    const token1 = requestAdminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test')
    const quiz = requestAdminQuizCreate(token1.authUserId, 'quizname1', 'quiz123')
    const quiz1 = requestAdminQuizCreate(token1.authUserId, 'quizname', 'quiz456')
    expect(requestAdminQuizInfo(-2, quiz.quizId).body).toStrictEqual({ error: 'Not a valid user.' })
    expect(requestAdminQuizInfo(-2, quiz1.quizId).body).toStrictEqual({ error: 'Not a valid user.' })
  })
})

describe('Invalid quizId', () => {
  test('Test 1 invalid quizId', () => {
    const token = requestAdminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test')
    const quiz = requestAdminQuizCreate(token.authUserId, 'quizhello', 'quiz1number')
    const quiz1 = requestAdminQuizCreate(token.authUserId, 'quiz123', 'quizname')
    expect(requestAdminQuizInfo(token.authUserId, -1).body).toStrictEqual({ error: 'Quiz does not exist.' })
    expect(requestAdminQuizInfo(token.authUserId, -1).body).toStrictEqual({ error: 'Quiz does not exist.' })
  })
  test('Test 2 invalid quizId', () => {
    const token1 = requestAdminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test')
    const quiz = requestAdminQuizCreate(token1.authUserId, 'quizname1', 'quiz123')
    const quiz1 = requestAdminQuizCreate(token1.authUserId, 'quizname', 'quiz456')
    expect(requestAdminQuizInfo(token1.authUserId, -2).body).toStrictEqual({ error: 'Quiz does not exist.' })
    expect(requestAdminQuizInfo(token1.authUserId, -2).body).toStrictEqual({ error: 'Quiz does not exist.' })
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
    expect(requestAdminQuizInfo(token.authUserId, quiz2.quizId).body).toStrictEqual({ error: 'You do not have access to this quiz.' })
    expect(requestAdminQuizInfo(token.authUserId, quiz3.quizId).body).toStrictEqual({ error: 'You do not have access to this quiz.' })
    expect(requestAdminQuizInfo(token1.authUserId, quiz1.quizId).body).toStrictEqual({ error: 'You do not have access to this quiz.' })
    expect(requestAdminQuizInfo(token1.authUserId, quiz.quizId).body).toStrictEqual({ error: 'You do not have access to this quiz.' })
  })
})
