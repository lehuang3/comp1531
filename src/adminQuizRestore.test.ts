import { adminQuizNameUpdate, adminQuizCreate } from './quiz.js'
import { adminAuthLogin, adminAuthRegister } from './auth.js'
import { requestClear, requestGetAdminUserDetails, requestAdminAuthRegister, requestAdminQuizNameUpdate, requestAdminQuizCreate, requestAdminQuizRemove, requestAdminQuizRestore} from './other'


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
  requestAdminQuizRemove(token1.body.token, quiz1.body.quizId);
  token2 = requestAdminAuthRegister('12345@email.com', '123adjakjfhgaA', 'david', 'test')
  quiz3 = requestAdminQuizCreate(token2.body.token, 'quizname1', 'quiz123')
  quiz4 = requestAdminQuizCreate(token2.body.token, 'quizname', 'quiz456')
  requestAdminQuizRemove(token2.body.token, quiz3.body.quizId);
})


describe('Passing cases', () => {
  test('Correct params', () => {
    expect(requestAdminQuizRestore(token1.body.token, quiz1.body.quizId).body).toStrictEqual({ });
  })
  test('Correct params 2', () => {
    expect(requestAdminQuizRestore(token2.body.token, quiz3.body.quizId).body).toStrictEqual({ });
  })
})

describe('QuizId is not valid', () => {
  test('negative quizId', () => {
    expect(requestAdminQuizRestore(token1.body.token, -1).body).toStrictEqual({ error: 'Not a valid quiz'})
  })
  test('negative quizId 2', () => {
    expect(requestAdminQuizRestore(token1.body.token, -100).body).toStrictEqual({ error: 'Not a valid quiz'})
  })
})

describe('No ownership of quiz', () => {
  test('token1 attempts to restore quiz owned by 2', () => {
    expect(requestAdminQuizRestore(token1.body.token, quiz3.body.quizId).body).toStrictEqual({ error: 'You do not have access to this quiz.'})
  })
  test('token2 attempts to restore quiz owned by 1', () => {
    expect(requestAdminQuizRestore(token2.body.token, quiz1.body.quizId).body).toStrictEqual({ error: 'You do not have access to this quiz.'})
  })
})

describe('Quiz not in trash', () => {
  test('quiz 2 not in trash', () => {
    expect(requestAdminQuizRestore(token1.body.token, quiz2.body.quizId).body).toStrictEqual({ error: 'Quiz not in trash.'})
  })
  test('quiz 4 not in trash', () => {
    expect(requestAdminQuizRestore(token2.body.token, quiz4.body.quizId).body).toStrictEqual({ error: 'Quiz not in trash.'})
  })
})

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken1 = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy');
    expect(requestAdminQuizRestore(invalidToken1.body.token, quiz1.body.quizId).body).toStrictEqual({ error: 'Invalid token structure' })
  })
  test('Invalid token created from invalid password 2', () => {
    const invalidToken2 = requestAdminAuthRegister('tommybommy@email.com', '', 'tommy', 'bommy');
    expect(requestAdminQuizRestore(invalidToken2.body.token, quiz3.body.quizId).body).toStrictEqual({ error: 'Invalid token structure' })
  })
})

describe('Invalid session', () => {
  test('Test 1 invalid authUserId', () => {
    const tokenInvalid = '-1';
    
    expect(requestAdminQuizRestore(tokenInvalid, quiz1.body.quizId).body).toStrictEqual({ error: 'Not a valid session' })
  })
  test('Test 2 invalid authUserId', () => {
    const tokenInvalid = '-100';
    
    expect(requestAdminQuizRestore(tokenInvalid, quiz3.body.quizId).body).toStrictEqual({ error: 'Not a valid session' })
  })
})