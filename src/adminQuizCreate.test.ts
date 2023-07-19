import { requestClear, requestAdminAuthRegister, requestAdminQuizCreate } from './other';
import HTTPError from 'http-errors';
let token1: string;

beforeEach(() => {
  requestClear();
  token1 = requestAdminAuthRegister('Minh@gmail.com', '1234abcd', 'Minh', 'Le').body.token;
});

test('Empty name', () => {
  expect(() => requestAdminQuizCreate(token1, '', 'descruiption')).toThrow(HTTPError[400]);
});

test('name < 3', () => {
  expect(() => requestAdminQuizCreate(token1, 'fg', 'descruiption')).toThrow(HTTPError[400]);
});

test('name > 30', () => {
  expect(() => requestAdminQuizCreate(token1, 'WhisperingMoonlitMysteries1235649', 'descruiption')).toThrow(HTTPError[400]);
});

test('name only has !', () => {
  expect(() => requestAdminQuizCreate(token1, '!', 'descruiption')).toThrow(HTTPError[400]);
});

test('name only has space', () => {
  expect(() => requestAdminQuizCreate(token1, ' ', 'descruiption')).toThrow(HTTPError[400]);
});

test('name with space', () => {
  const response = requestAdminQuizCreate(token1, 'Hellow world', 'descruiption');

  expect(response.body).toStrictEqual({ quizId: expect.any(Number) });
  expect(response.status).toStrictEqual(200);
});

test('name in use', () => {
  requestAdminQuizCreate(token1, 'quiz1', 'descruiption');
  expect(() => requestAdminQuizCreate(token1, 'quiz1', 'descruiption')).toThrow(HTTPError[400]);
});

test('Invalid sessions', () => {
  const token2 = (parseInt(token1) + 1).toString();
  expect(() => requestAdminQuizCreate(token2, 'Hellow world', 'descruiption')).toThrow(HTTPError[403]);
});

test('Invalid token struct', () => {
  const token4 = requestAdminAuthRegister('jeffbezoz@gmail.com', '', 'Minh', 'Le').body.token;
  expect(() => requestAdminQuizCreate(token4, 'Hellow world', 'descruiption')).toThrow(HTTPError[401]);
});

test('Description > 100', () => {
  expect(() => requestAdminQuizCreate(token1, 'quiz1', 'EnigmaticUniverseSparklingWithInfinitePossibilities1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')).toThrow(HTTPError[400]);
});

test('Valid entry', () => {
  const response = requestAdminQuizCreate(token1, 'quiz1', 'Descritpion');

  expect(response.body).toStrictEqual({ quizId: expect.any(Number) });
  expect(response.status).toStrictEqual(200);
});
