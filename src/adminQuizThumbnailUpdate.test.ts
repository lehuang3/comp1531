import { requestAdminQuizCreate, requestAdminAuthRegister, requestClear, requestAdminQuizThumbnailUpdate, requestAdminAuthLogout } from "./other";

let token1: any;
let quiz1: any;
const imageUrl = {
  imgUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg' 
}

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test');
  quiz1 = requestAdminQuizCreate(token1.body.token, 'quiz', 'quiz1');
});

describe('Passing case', () => {
  test('User 1 enters correct information', () => {
    expect(requestAdminQuizThumbnailUpdate(token1.body.token, quiz1.body.quizId, imageUrl.imgUrl).body).toStrictEqual({ });
  });
});

describe('Quiz Id not valid', () => {
  test('Negative quizId', () => {
    expect(requestAdminQuizThumbnailUpdate(token1.body.token, -1, imageUrl.imgUrl).body).toStrictEqual({ error: 'Quiz does not exist.' });
  });
});

describe('Quiz not owned', () => {
  test('User 1 trys to change user 2 quiz', () => {
    const token2 = requestAdminAuthRegister('12345@email.com', '123dfsjkfsA', 'david', 'man');
    const quiz2 = requestAdminQuizCreate(token2.body.token, 'quiz', 'quiz1');
    expect(requestAdminQuizThumbnailUpdate(token1.body.token, quiz2.body.quizId, imageUrl.imgUrl).body).toStrictEqual({ error: 'You do not have access to this quiz.' });
  });
});

describe('Url is not valid', () => {
  test('Negative quizId', () => {
    expect(requestAdminQuizThumbnailUpdate(token1.body.token, quiz1.body.quizId, 'imageUrl.imgUrl').body).toStrictEqual({ error: 'Not a valid url.' });
  });
});

describe('Url is not an image', () => {
  test('Negative quizId', () => {
    expect(requestAdminQuizThumbnailUpdate(token1.body.token, quiz1.body.quizId, 'https://www.youtube.com/').body).toStrictEqual({ error: 'Url is not an image.' });
  });
});

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy');
    expect(requestAdminQuizThumbnailUpdate(invalidToken.body.token, quiz1.body.quizId, imageUrl.imgUrl).body).toStrictEqual({ error: 'Invalid token structure' });
  });
});

describe('Invalid session', () => {
  test('Token is logged out', () => {
    requestAdminAuthLogout(token1.body.token);
    expect(requestAdminQuizThumbnailUpdate(token1.body.token, quiz1.body.quizId, imageUrl.imgUrl).body).toStrictEqual({ error: 'Not a valid session' });
  });
});

