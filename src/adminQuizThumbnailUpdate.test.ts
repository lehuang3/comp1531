import { requestAdminQuizCreate, requestAdminAuthRegister, requestClear, requestAdminQuizThumbnailUpdate, requestAdminAuthLogout } from './other';

let token1: string;
let quiz1: number;
const imageUrl = {
  imgUrl: 'https://code.org/images/fill-480x360/tutorials/hoc2022/mee_estate.jpg'
};

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('123@email.com', '123dfsjkfsA', 'david', 'test').body.token;
  quiz1 = requestAdminQuizCreate(token1, 'quiz', 'quiz1').body.quizId;
});

describe('Passing case', () => {
  test('User 1 enters correct information', () => {
    expect(requestAdminQuizThumbnailUpdate(token1, quiz1, imageUrl.imgUrl).body).toStrictEqual({ });
  });
});

describe('Quiz Id not valid', () => {
  test('Negative quizId', () => {
    expect(requestAdminQuizThumbnailUpdate(token1, -1, imageUrl.imgUrl).body).toStrictEqual({ error: 'Quiz does not exist.' });
  });
});

describe('Quiz not owned', () => {
  test('User 1 trys to change user 2 quiz', () => {
    const token2 = requestAdminAuthRegister('12345@email.com', '123dfsjkfsA', 'david', 'man').body.token;
    const quiz2 = requestAdminQuizCreate(token2, 'quiz', 'quiz1').body.quizId;
    expect(requestAdminQuizThumbnailUpdate(token1, quiz2, imageUrl.imgUrl).body).toStrictEqual({ error: 'You do not have access to this quiz.' });
  });
});

describe('Url is not valid', () => {
  test('Negative quizId', () => {
    expect(requestAdminQuizThumbnailUpdate(token1, quiz1, 'imageUrl.imgUrl').body).toStrictEqual({ error: 'Not a valid url.' });
  });
});

describe('Url is not an image', () => {
  test('Negative quizId', () => {
    expect(requestAdminQuizThumbnailUpdate(token1, quiz1, 'https://www.youtube.com/').body).toStrictEqual({ error: 'Url is not an image.' });
  });
});

describe('Invalid token', () => {
  test('Invalid token created from invalid email', () => {
    const invalidToken = requestAdminAuthRegister('', 'happy123', 'tommy', 'bommy').body.token;
    expect(requestAdminQuizThumbnailUpdate(invalidToken, quiz1, imageUrl.imgUrl).body).toStrictEqual({ error: 'Invalid token structure' });
  });
});

describe('Invalid session', () => {
  test('Token is logged out', () => {
    requestAdminAuthLogout(token1);
    expect(requestAdminQuizThumbnailUpdate(token1, quiz1, imageUrl.imgUrl).body).toStrictEqual({ error: 'Not a valid session' });
  });
});
