import { requestClear, requestAdminAuthRegister, requestAdminAuthPasswordUpdate, v1requestAdminAuthPasswordUpdate } from './other';

beforeEach(() => {
  requestClear();
});

test('Simple test pass', () => {
  const res = requestAdminAuthRegister('lain@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
  const response = requestAdminAuthPasswordUpdate(res.body.token, 'Abcd123%', 'ADsd&1929');
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
});

test('Old password wrong', () => {
  const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
  const userLogin = requestAdminAuthPasswordUpdate(response.body.token, 'fasf', 'ADsd&1929');
  expect(userLogin.body).toStrictEqual({ error: 'Old password is incorrect' });
  expect(userLogin.status).toStrictEqual(400);
});

test('New password is used already', () => {
  const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
  requestAdminAuthPasswordUpdate(response.body.token, 'Abcd123%', 'ADsd&1929');
  const userLogin = requestAdminAuthPasswordUpdate(response.body.token, 'ADsd&1929', 'Abcd123%');
  expect(userLogin.body).toStrictEqual({ error: 'Password has been used before' });
  expect(userLogin.status).toStrictEqual(400);
});

test('New password too short', () => {
  const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
  const userLogin = requestAdminAuthPasswordUpdate(response.body.token, 'Abcd123%', 'toa235A');
  expect(userLogin.body).toStrictEqual({ error: 'New password is invalid' });
  expect(userLogin.status).toStrictEqual(400);
});

test('New password does not have at least a letter and number', () => {
  const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
  const userLogin = requestAdminAuthPasswordUpdate(response.body.token, 'Abcd123%', 'helloitsme');
  expect(userLogin.body).toStrictEqual({ error: 'New password is invalid' });
  expect(userLogin.status).toStrictEqual(400);
});

test('New password does not have at least a letter and number', () => {
  const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
  const userLogin = requestAdminAuthPasswordUpdate(response.body.token, 'Abcd123%', '123456789');
  expect(userLogin.body).toStrictEqual({ error: 'New password is invalid' });
  expect(userLogin.status).toStrictEqual(400);
});

test('Testing token is not a valid structure', () => {
  const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd173%', 'L', 'Cyberia');
  const userLogin = requestAdminAuthPasswordUpdate(response.body.token, 'Abcd173%', 'ADsd&1929');
  expect(userLogin.body).toStrictEqual({ error: 'Invalid token structure' });
  expect(userLogin.status).toStrictEqual(401);
});

test('Testing token is for logged in session', () => {
  const response = requestAdminAuthRegister('patel@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
  requestClear();
  const userLogin = requestAdminAuthPasswordUpdate(response.body.token, 'Abcd173%', 'ADsd&1929');
  expect(userLogin.body).toStrictEqual({ error: 'Not a valid session' });
  expect(userLogin.status).toStrictEqual(403);
});

test('Simple test pass, v1 route', () => {
  const res = requestAdminAuthRegister('lain@gmail.com', 'Abcd123%', 'Pranav', 'Patel');
  const response = v1requestAdminAuthPasswordUpdate(res.body.token, 'Abcd123%', 'ADsd&1929');
  expect(response.body).toStrictEqual({});
  expect(response.status).toStrictEqual(200);
});