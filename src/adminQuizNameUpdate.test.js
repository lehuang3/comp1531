import { adminQuizNameUpdate, adminQuizCreate } from './quiz.js'
import { adminAuthLogin, adminAuthRegister } from './auth.js'
import { clear } from './other.js'

describe('Passing cases', () => {
  clear()
  adminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test')
  const user = adminAuthLogin('123@email.com', '123dfsjkfsA')
  const quiz = adminQuizCreate(user.authUserId, 'quiz', 'quiz1')
  adminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test')
  const user2 = adminAuthLogin('1234@email.com', '123dfsjkfsA')
  const quiz2 = adminQuizCreate(user2.authUserId, 'quiz', 'quiz1')
  adminAuthRegister('12345@email.com', '123dfsjkfsA', 'maple', 'syrup')
  const user3 = adminAuthLogin('12345@email.com', '123dfsjkfsA')
  const quiz3 = adminQuizCreate(user3.authUserId, 'quiz', 'quiz1')

  test('User 1 changes quiz name to valid quiz name 1', () => {
    expect(adminQuizNameUpdate(user.authUserId, quiz.quizId, 'quiz2')).toStrictEqual({ })
  })
  test('User 1 changes quiz name to valid quiz name 2', () => {
    expect(adminQuizNameUpdate(user.authUserId, quiz.quizId, 'abcdefghijklmnopqrstuvwxyz1234')).toStrictEqual({ })
  })
  test('User 2 changes quiz name to valid quiz name 1', () => {
    expect(adminQuizNameUpdate(user2.authUserId, quiz2.quizId, 'abc')).toStrictEqual({ })
  })
  test('User 2 changes quiz name to valid quiz name 2', () => {
    expect(adminQuizNameUpdate(user2.authUserId, quiz2.quizId, 'hello')).toStrictEqual({ })
  })
  test('User 3 changes quiz name to valid quiz name 1', () => {
    expect(adminQuizNameUpdate(user3.authUserId, quiz3.quizId, 'quiz with spaces')).toStrictEqual({ })
  })
  test('User 3 changes quiz name to valid quiz name 2', () => {
    expect(adminQuizNameUpdate(user3.authUserId, quiz3.quizId, 'QuIz wiTh SpaceS')).toStrictEqual({ })
  })
})

describe('authUserId is not valid', () => {
  clear()
  adminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test')
  const user = adminAuthLogin('123@email.com', '123dfsjkfsA')
  const quiz = adminQuizCreate(user.authUserId, 'quiz', 'quiz1')
  adminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test')
  const user2 = adminAuthLogin('1234@email.com', '123dfsjkfsA')
  const quiz2 = adminQuizCreate(user2.authUserId, 'quiz', 'quiz1')
  adminAuthRegister('12345@email.com', '123dfsjkfsA', 'maple', 'syrup')
  const user3 = adminAuthLogin('12345@email.com', '123dfsjkfsA')
  const quiz3 = adminQuizCreate(user3.authUserId, 'quiz', 'quiz1')

  test('User 1 tries to change user 2 quiz name', () => {
    expect(adminQuizNameUpdate(user.authUserId, quiz2.quizId, 'quiz2')).toStrictEqual({ error: 'You do not have access to this quiz.' })
  })
  test('User 2 tries to change user 1 quiz name', () => {
    expect(adminQuizNameUpdate(user2.authUserId, quiz.quizId, 'quiz2')).toStrictEqual({ error: 'You do not have access to this quiz.' })
  })
  test('User 2 tries to change user 3 quiz name', () => {
    expect(adminQuizNameUpdate(user2.authUserId, quiz3.quizId, 'quiz2')).toStrictEqual({ error: 'You do not have access to this quiz.' })
  })
  test('User 3 tries to change user 1 quiz name', () => {
    expect(adminQuizNameUpdate(user3.authUserId, quiz.quizId, 'quiz2')).toStrictEqual({ error: 'You do not have access to this quiz.' })
  })
})

describe('quizId is not valid', () => {
  clear()
  adminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test')
  const user = adminAuthLogin('123@email.com', '123dfsjkfsA')
  const quiz = adminQuizCreate(user.authUserId, 'quiz', 'quiz1')
  adminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test')
  const user2 = adminAuthLogin('1234@email.com', '123dfsjkfsA')
  const quiz2 = adminQuizCreate(user2.authUserId, 'quiz', 'quiz1')
  adminAuthRegister('12345@email.com', '123dfsjkfsA', 'maple', 'syrup')
  const user3 = adminAuthLogin('12345@email.com', '123dfsjkfsA')
  const quiz3 = adminQuizCreate(user3.authUserId, 'quiz', 'quiz1')

  test('User 1 negative quizId not valid', () => {
    expect(adminQuizNameUpdate(user.authUserId, -1, 'quiz2')).toStrictEqual({ error: 'Quiz does not exist.' })
  })
  test('User 2 negative quizId not valid', () => {
    expect(adminQuizNameUpdate(user2.authUserId, -2, 'quiz2')).toStrictEqual({ error: 'Quiz does not exist.' })
  })
  test('User 3 negative quizId not valid', () => {
    expect(adminQuizNameUpdate(user3.authUserId, -3, 'quiz2')).toStrictEqual({ error: 'Quiz does not exist.' })
  })
})

describe ('Quiz name is not valid', () => {
  clear();
  adminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
  let user = adminAuthLogin('123@email.com', '123dfsjkfsA')
  let quiz = adminQuizCreate(user.authUserId, 'quiz', 'quiz1');
  adminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test');
  let user2 = adminAuthLogin('1234@email.com', '123dfsjkfsA')
  let quiz2 = adminQuizCreate(user2.authUserId, 'quiz', 'quiz1');
  adminAuthRegister('12345@email.com', '123dfsjkfsA', 'maple', 'syrup');
  let user3 = adminAuthLogin('12345@email.com', '123dfsjkfsA')
  let quiz3 = adminQuizCreate(user3.authUserId, 'quiz', 'quiz1');

  test ('User 1 quiz name not valid', () => {
    expect(adminQuizNameUpdate(user.authUserId, quiz.quizId, 'quiz#')).toStrictEqual({ error: 'Quiz name cannot have special characters.'})
  })
  test ('User 2 quiz name not valid', () => {
    expect(adminQuizNameUpdate(user2.authUserId, quiz2.quizId, 'ad12_131')).toStrictEqual({ error: 'Quiz name cannot have special characters.'})
  })
  test ('User 3 quiz name not valid', () => {
    expect(adminQuizNameUpdate(user3.authUserId, quiz3.quizId, 'Quiz-')).toStrictEqual({ error: 'Quiz name cannot have special characters.'})
  })
})

describe('Quiz name too long or short', () => {
  clear()
  adminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test')
  const user = adminAuthLogin('123@email.com', '123dfsjkfsA')
  const quiz = adminQuizCreate(user.authUserId, 'quiz', 'quiz1')
  adminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test')
  const user2 = adminAuthLogin('1234@email.com', '123dfsjkfsA')
  const quiz2 = adminQuizCreate(user2.authUserId, 'quiz', 'quiz1')
  adminAuthRegister('12345@email.com', '123dfsjkfsA', 'maple', 'syrup')
  const user3 = adminAuthLogin('12345@email.com', '123dfsjkfsA')
  const quiz3 = adminQuizCreate(user3.authUserId, 'quiz', 'quiz1')

  test('User 1 quiz too short', () => {
    expect(adminQuizNameUpdate(user.authUserId, quiz.quizId, 'q1')).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' })
  })
  test('User 1 quiz too long', () => {
    expect(adminQuizNameUpdate(user.authUserId, quiz.quizId, 'fsjhfkjhakhjgkhjajhlahfdoiohasgfhjhasdjkfh1234')).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' })
  })
  test('User 2 quiz too short', () => {
    expect(adminQuizNameUpdate(user2.authUserId, quiz2.quizId, '')).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' })
  })
  test('User 2 quiz too long', () => {
    expect(adminQuizNameUpdate(user2.authUserId, quiz2.quizId, '1231245523414535234115234541352562134265afasf')).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' })
  })
  test('User 3 quiz too short', () => {
    expect(adminQuizNameUpdate(user3.authUserId, quiz3.quizId, '1')).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' })
  })
  test('User 2 quiz too long', () => {
    expect(adminQuizNameUpdate(user3.authUserId, quiz3.quizId, 'dfaslkjhk2j3h45khjfhaksfhjhfk2rjk345hkjkjafjkhhjk52')).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' })
  })
})

describe('Quiz name already used', () => {
  clear()
  adminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test')
  const user = adminAuthLogin('123@email.com', '123dfsjkfsA')
  const quiz = adminQuizCreate(user.authUserId, 'quiz', 'quiz1')
  adminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test')
  const user2 = adminAuthLogin('1234@email.com', '123dfsjkfsA')
  const quiz2 = adminQuizCreate(user2.authUserId, 'quiz', 'quiz1')
  adminAuthRegister('12345@email.com', '123dfsjkfsA', 'maple', 'syrup')
  const user3 = adminAuthLogin('12345@email.com', '123dfsjkfsA')
  const quiz3 = adminQuizCreate(user3.authUserId, 'quiz', 'quiz1')

  adminQuizCreate(user.authUserId, 'newquiz', 'quiz1')
  adminQuizCreate(user2.authUserId, 'newquiz1', 'quiz1')
  adminQuizCreate(user3.authUserId, 'newquiz2', 'quiz1')
  test('User 1 quiz name already used', () => {
    expect(adminQuizNameUpdate(user.authUserId, quiz.quizId, 'newquiz')).toStrictEqual({ error: 'Quiz name already exists.' })
  })
  test('User 2 quiz name already used', () => {
    expect(adminQuizNameUpdate(user2.authUserId, quiz2.quizId, 'newquiz1')).toStrictEqual({ error: 'Quiz name already exists.' })
  })
  test('User 3 quiz name already used', () => {
    expect(adminQuizNameUpdate(user3.authUserId, quiz3.quizId, 'newquiz2')).toStrictEqual({ error: 'Quiz name already exists.' })
  })
})
