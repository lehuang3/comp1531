import { adminQuizNameUpdate, adminQuizCreate } from './quiz.js'
import { adminAuthLogin, adminAuthRegister } from './auth.js'
import { requestClear, requestGetAdminUserDetails, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizInfo} from './other'

let token1: any;
let quiz1: any;

beforeEach(() => {
  requestClear()
  token1 = requestAdminAuthRegister('123@email.com', '123adjakjfhgaA', 'david', 'test')
  quiz1 = requestAdminQuizCreate(token1.body.token, 'quizhello', 'quiz1number')
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
  })
})

describe('Invalid session', () => {
  test('Test 1 invalid authUserId', () => {
    const tokenInvalid = '-1';
    
    expect(requestAdminQuizInfo(tokenInvalid, quiz1.body.quizId).body).toStrictEqual({ error: 'Not a valid session' })
  })
})

describe('Invalid quizId', () => {
  test('Test 1 invalid quizId', () => {
    expect(requestAdminQuizInfo(token1.body.token, -1).body).toStrictEqual({ error: 'Quiz does not exist.' })
  })
})

describe('No permission to view quiz', () => {
  test('Test 1, two users trying to access quizzes they do not own', () => {
    const token2 = requestAdminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test')
    const quiz3 = requestAdminQuizCreate(token2.body.token, 'quizname1', 'quiz123')
    expect(requestAdminQuizInfo(token1.body.token, quiz3.body.quizId).body).toStrictEqual({ error: 'You do not have access to this quiz.' })
  })
})

describe('Invalid session', () => {
  test('Test 1 invalid authUserId', () => {
    const tokenInvalid = '-1';
    
    expect(requestAdminQuizInfo(tokenInvalid, quiz1.body.quizId).body).toStrictEqual({ error: 'Not a valid session' })
  })
})

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken1 = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy');
    expect(requestAdminQuizInfo(invalidToken1.body.token, quiz1.body.quizId).body).toStrictEqual({ error: 'Invalid token structure' })
  })
})