import { adminQuizNameUpdate, adminQuizCreate } from './quiz.js'
import { adminAuthLogin, adminAuthRegister } from './auth.js'
import { requestClear, requestGetAdminUserDetails, requestAdminAuthRegister, requestAdminQuizNameUpdate, requestAdminQuizCreate} from './other';

// const postRequest = (url: string, data: any) => {
//   const res = request(
//     'POST',
//     url,
//     {
//       json: data,
//     }
//   );
//   const bodyObj = JSON.parse(String(res.getBody()))
//   return bodyObj;
// }

// const getRequest = () => {
//   const res = request(
//     'GET',
//     url,
//     {
//       qs: data,
//     }
//   );
//   const bodyObj = JSON.parse(String(res.getBody()))
//   return bodyObj;
// }

describe('adminQuizNameUpdate tests', () => {
  beforeEach(() => {
    requestClear();
  })

  describe('Passing cases', () => {
    const token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
    const quiz1 = requestAdminQuizCreate(token1.body, 'quiz', 'quiz1')
    const token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test');
    const quiz2 = requestAdminQuizCreate(token2.body, 'quiz', 'quiz1')
    const token3 = requestAdminAuthRegister('12345@email.com', '123dfsjkfsA', 'maple', 'syrup');
    const quiz3 = requestAdminQuizCreate(token3.body, 'quiz', 'quiz1')
    
    // test.each([
    //   [token1.body.authUserId, quiz1.body.quizId, 'quiz2'],
    //   [token1.body.authUserId, quiz1.body.quizId, 'abcdefghijklmnopqrstuvwxyz1234'],
    //   [token2.body.authUserId, quiz2.body.quizId, 'abc'],
    //   [token2.body.authUserId, quiz2.body.quizId, 'hello'],
    //   [token3.body.authUserId, quiz3.body.quizId, 'quiz with spaces'],
    //   [token3.body.authUserId, quiz3.body.quizId, 'QuIz wiTh SpaceS']
    // ])(`Test $# of success`, (a, b, c) => {
    //   expect(requestAdminQuizNameUpdate(token3.body.authUserId, quiz3.body.quizId, 'QuIz wiTh SpaceS').body).toStrictEqual({ })
    // })

    test('User 1 changes quiz name to valid quiz name 1', () => {
      expect(requestAdminQuizNameUpdate(token1.body, quiz1.body.quizId, 'quiz2').body).toStrictEqual({ })
    })
    test('User 1 changes quiz name to valid quiz name 2', () => {
      expect(requestAdminQuizNameUpdate(token1.body, quiz1.body.quizId, 'abcdefghijklmnopqrstuvwxyz1234').body).toStrictEqual({ })
    })
    test('User 2 changes quiz name to valid quiz name 1', () => {
      expect(requestAdminQuizNameUpdate(token2.body, quiz2.body.quizId, 'abc').body).toStrictEqual({ })
    })
    test('User 2 changes quiz name to valid quiz name 2', () => {
      expect(requestAdminQuizNameUpdate(token2.body, quiz2.body.quizId, 'hello').body).toStrictEqual({ })
    })
    test('User 3 changes quiz name to valid quiz name 1', () => {
      expect(requestAdminQuizNameUpdate(token3.body, quiz3.body.quizId, 'quiz with spaces').body).toStrictEqual({ })
    })
    test('User 3 changes quiz name to valid quiz name 2', () => {
      expect(requestAdminQuizNameUpdate(token3.body, quiz3.body.quizId, 'QuIz wiTh SpaceS').body).toStrictEqual({ })
    })
  })
  
  describe('authUserId is not valid', () => {
    const token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
    const quiz1 = requestAdminQuizCreate(token1.body, 'quiz', 'quiz1')
    const token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test');
    const quiz2 = requestAdminQuizCreate(token2.body, 'quiz', 'quiz1')
    const token3 = requestAdminAuthRegister('12345@email.com', '123dfsjkfsA', 'maple', 'syrup');
    const quiz3 = requestAdminQuizCreate(token3.body, 'quiz', 'quiz1')
  
    test('User 1 tries to change user 2 quiz name', () => {
      expect(requestAdminQuizNameUpdate(token1.body, quiz2.body.quizId, 'quiz2').body).toStrictEqual({ error: 'You do not have access to this quiz.' })
    })
    test('User 2 tries to change user 1 quiz name', () => {
      expect(requestAdminQuizNameUpdate(token2.body, quiz1.body.quizId, 'quiz2').body).toStrictEqual({ error: 'You do not have access to this quiz.' })
    })
    test('User 2 tries to change user 3 quiz name', () => {
      expect(requestAdminQuizNameUpdate(token2.body, quiz3.body.quizId, 'quiz2').body).toStrictEqual({ error: 'You do not have access to this quiz.' })
    })
    test('User 3 tries to change user 1 quiz name', () => {
      expect(requestAdminQuizNameUpdate(token3.body, quiz1.body.quizId, 'quiz2').body).toStrictEqual({ error: 'You do not have access to this quiz.' })
    })
  })
  
  describe('quizId is not valid', () => {
    const token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
    const quiz1 = requestAdminQuizCreate(token1.body, 'quiz', 'quiz1')
    const token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test');
    const quiz2 = requestAdminQuizCreate(token2.body, 'quiz', 'quiz1')
    const token3 = requestAdminAuthRegister('12345@email.com', '123dfsjkfsA', 'maple', 'syrup');
    const quiz3 = requestAdminQuizCreate(token3.body, 'quiz', 'quiz1')
  
    test('User 1 negative quizId not valid', () => {
      expect(requestAdminQuizNameUpdate(token1.body, -1, 'quiz2').body).toStrictEqual({ error: 'Quiz does not exist.' })
    })
    test('User 2 negative quizId not valid', () => {
      expect(requestAdminQuizNameUpdate(token2.body, -2, 'quiz2').body).toStrictEqual({ error: 'Quiz does not exist.' })
    })
    test('User 3 negative quizId not valid', () => {
      expect(requestAdminQuizNameUpdate(token3.body, -3, 'quiz2').body).toStrictEqual({ error: 'Quiz does not exist.' })
    })
  })
  
  describe ('Quiz name is not valid', () => {
    const token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
    const quiz1 = requestAdminQuizCreate(token1.body, 'quiz', 'quiz1')
    const token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test');
    const quiz2 = requestAdminQuizCreate(token2.body, 'quiz', 'quiz1')
    const token3 = requestAdminAuthRegister('12345@email.com', '123dfsjkfsA', 'maple', 'syrup');
    const quiz3 = requestAdminQuizCreate(token3.body, 'quiz', 'quiz1')
  
    test ('User 1 quiz name not valid', () => {
      expect(requestAdminQuizNameUpdate(token1.body, quiz1.body.quizId, 'quiz#').body).toStrictEqual({ error: 'Quiz name cannot have special characters.'})
    })
    test ('User 2 quiz name not valid', () => {
      expect(requestAdminQuizNameUpdate(token2.body, quiz2.body.quizId, 'ad12_131').body).toStrictEqual({ error: 'Quiz name cannot have special characters.'})
    })
    test ('User 3 quiz name not valid', () => {
      expect(requestAdminQuizNameUpdate(token3.body, quiz3.body.quizId, 'Quiz-').body).toStrictEqual({ error: 'Quiz name cannot have special characters.'})
    })
  })
  
  describe('Quiz name too long or short', () => {
    const token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
    const quiz1 = requestAdminQuizCreate(token1.body, 'quiz', 'quiz1')
    const token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test');
    const quiz2 = requestAdminQuizCreate(token2.body, 'quiz', 'quiz1')
    const token3 = requestAdminAuthRegister('12345@email.com', '123dfsjkfsA', 'maple', 'syrup');
    const quiz3 = requestAdminQuizCreate(token3.body, 'quiz', 'quiz1')
  
    test('User 1 quiz too short', () => {
      expect(requestAdminQuizNameUpdate(token1.body, quiz1.body.quizId, 'q1').body).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' })
    })
    test('User 1 quiz too long', () => {
      expect(requestAdminQuizNameUpdate(token1.body, quiz1.body.quizId, 'fsjhfkjhakhjgkhjajhlahfdoiohasgfhjhasdjkfh1234').body).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' })
    })
    test('User 2 quiz too short', () => {
      expect(requestAdminQuizNameUpdate(token2.body, quiz2.body.quizId, '').body).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' })
    })
    test('User 2 quiz too long', () => {
      expect(requestAdminQuizNameUpdate(token2.body, quiz2.body.quizId, '1231245523414535234115234541352562134265afasf').body).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' })
    })
    test('User 3 quiz too short', () => {
      expect(requestAdminQuizNameUpdate(token3.body, quiz3.body.quizId, '1').body).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' })
    })
    test('User 2 quiz too long', () => {
      expect(requestAdminQuizNameUpdate(token3.body, quiz3.body.quizId, 'dfaslkjhk2j3h45khjfhaksfhjhfk2rjk345hkjkjafjkhhjk52').body).toStrictEqual({ error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.' })
    })
  })
  
  describe('Quiz name already used', () => {
    const token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
    const quiz1 = requestAdminQuizCreate(token1.body, 'quiz', 'quiz1')
    const token2 = requestAdminAuthRegister('1234@email.com', '123dfsjkfsA', 'jack', 'test');
    const quiz2 = requestAdminQuizCreate(token2.body, 'quiz', 'quiz1')
    const token3 = requestAdminAuthRegister('12345@email.com', '123dfsjkfsA', 'maple', 'syrup');
    const quiz3 = requestAdminQuizCreate(token3.body, 'quiz', 'quiz1')
  
    requestAdminQuizCreate(token1.body, 'newquiz', 'quiz1')
    requestAdminQuizCreate(token2.body, 'newquiz1', 'quiz1')
    requestAdminQuizCreate(token3.body, 'newquiz2', 'quiz1')
    test('User 1 quiz name already used', () => {
      expect(requestAdminQuizNameUpdate(token1.body, quiz1.body.quizId, 'newquiz').body).toStrictEqual({ error: 'Quiz name already exists.' })
    })
    test('User 2 quiz name already used', () => {
      expect(requestAdminQuizNameUpdate(token2.body, quiz2.body.quizId, 'newquiz1').body).toStrictEqual({ error: 'Quiz name already exists.' })
    })
    test('User 3 quiz name already used', () => {
      expect(requestAdminQuizNameUpdate(token3.body, quiz3.body.quizId, 'newquiz2').body).toStrictEqual({ error: 'Quiz name already exists.' })
    })
  })
})

