import { adminQuizNameUpdate, adminQuizCreate } from './quiz.js'
import { adminAuthLogin, adminAuthRegister } from './auth.js'
import { requestClear, requestGetAdminUserDetails, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizInfo} from './other'

let token1: any;
let quiz1: any;
let quiz2: any;
let token2: any;
let quiz3: any;
let quiz4: any;


beforeEach(() => {
  requestClear()
  token1 = requestAdminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test')
  quiz1 = requestAdminQuizCreate(token1.body.token, 'quizhello', 'quiz1number')
  quiz2 = requestAdminQuizCreate(token1.body.token, 'quiz123', 'quizname')
  token2 = requestAdminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test')
  quiz3 = requestAdminQuizCreate(token2.body.token, 'quizname1', 'quiz123')
  quiz4 = requestAdminQuizCreate(token2.body.token, 'quizname', 'quiz456')
  
})

describe('Valid inputs, test pass', () => {
  test('Test 1 correct inputs', () => {
    expect(requestAdminQuizInfo(token1.body.token, quiz1.body.quizId).body).toMatchObject({
      quizId: expect.any(Number),
      name: 'quizhello',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz1number'
    })
    expect(requestAdminQuizInfo(token1.body.token, quiz2.body.quizId).body).toMatchObject({
      quizId: expect.any(Number),
      name: 'quiz123',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quizname'
    })
  })
  test('Test 2 correct inputs', () => {
    expect(requestAdminQuizInfo(token2.body.token, quiz3.body.quizId).body).toMatchObject({
      quizId: expect.any(Number),
      name: 'quizname1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz123'
    })
    expect(requestAdminQuizInfo(token2.body.token, quiz4.body.quizId).body).toMatchObject({
      quizId: expect.any(Number),
      name: 'quizname',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz456'
    })
  })
})

describe('Invalid session', () => {
  test('Test 1 invalid authUserId', () => {
    const tokenInvalid = '-1';
    
    expect(requestAdminQuizInfo(tokenInvalid, quiz1.body.quizId).body).toStrictEqual({ error: 'Not a valid session' })
  })
  test('Test 2 invalid authUserId', () => {
    const tokenInvalid2 = '-2';
    
    expect(requestAdminQuizInfo(tokenInvalid2, quiz1.body.quizId).body).toStrictEqual({ error: 'Not a valid session' })
  })
})

describe('Invalid quizId', () => {
  test('Test 1 invalid quizId', () => {
    expect(requestAdminQuizInfo(token1.body.token, -1).body).toStrictEqual({ error: 'Quiz does not exist.' })
  })
  test('Test 2 invalid quizId', () => {
    expect(requestAdminQuizInfo(token2.body.token, -2).body).toStrictEqual({ error: 'Quiz does not exist.' })
  })
})

describe('No permission to view quiz', () => {
  test('Test 1, two users trying to access quizzes they do not own', () => {
    expect(requestAdminQuizInfo(token1.body.token, quiz3.body.quizId).body).toStrictEqual({ error: 'You do not have access to this quiz.' })
  })
  test('Test 2, two users trying to access quizzes they do not own', () => {
    expect(requestAdminQuizInfo(token1.body.token, quiz4.body.quizId).body).toStrictEqual({ error: 'You do not have access to this quiz.' })
  })
  test('Test 3, two users trying to access quizzes they do not own', () => {
    expect(requestAdminQuizInfo(token2.body.token, quiz1.body.quizId).body).toStrictEqual({ error: 'You do not have access to this quiz.' })
  })
  test('Test 4, two users trying to access quizzes they do not own', () => {
    expect(requestAdminQuizInfo(token2.body.token, quiz2.body.quizId).body).toStrictEqual({ error: 'You do not have access to this quiz.' })
  })
})

describe('Invalid session', () => {
  test('Test 1 invalid authUserId', () => {
    const tokenInvalid = '-1';
    
    expect(requestAdminQuizInfo(tokenInvalid, quiz1.body.quizId).body).toStrictEqual({ error: 'Not a valid session' })
  })
  test('Test 2 invalid authUserId', () => {
    const tokenInvalid = '-2';
    
    expect(requestAdminQuizInfo(tokenInvalid, quiz3.body.quizId).body).toStrictEqual({ error: 'Not a valid session' })
  })
})

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken1 = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy');
    expect(requestAdminQuizInfo(invalidToken1.body.token, quiz1.body.quizId).body).toStrictEqual({ error: 'Invalid token structure' })
  })
  test('Invalid token created from invalid password', () => {
    const invalidToken2 = requestAdminAuthRegister('tommybommy@email.com', '', 'tommy', 'bommy');
    expect(requestAdminQuizInfo(invalidToken2.body.token, quiz1.body.quizId).body).toStrictEqual({ error: 'Invalid token structure' })
  })
})