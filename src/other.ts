import fs from 'fs';
import { Data, Token } from './interfaces';
import request from 'sync-request';
import { port, url } from './config.json';
import { ErrorObject } from './interfaces';
import HTTPError from 'http-errors';
const SERVER_URL = `${url}:${port}`;

/**
 * Send a 'delete' request to the corresponding server route to reset the
 * application state, returning the response in the form of a javascript object
 * @param {{}} - No parameters
 *
 * @returns {{object}} - response in javascript
*/
function requestClear() {
  const res = request(
    'DELETE',
    SERVER_URL + '/v1/clear',
    {
      qs: {

      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'get' request to the corresponding server route for user details,
 * returning the response in the form of a javascript object
 * @param {{string | ErrorObject}}
 *
 * @returns {{object}} - response in javascript
*/
function requestGetAdminUserDetails(token: ErrorObject | string) {
  console.log(token);
  // token = JSON.stringify(token);
  // console.log(token);
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/user/details',
    {
      headers: {
        token: token as string,
      },
      qs: {
        
      }
    }
  );
  if (res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 400) {
    throw HTTPError(res.statusCode, JSON.parse(res.body.toString()));
  }
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Check if a token passed in has a valid
 * structure, and return a boolean value accordingly.
 * @param {ErrorObject | string} token
 *
 * @returns {{boolean}} - True or false
*/
function isTokenValid(token: ErrorObject | string) {
  if (typeof token !== 'string') {
    return false;
  }
  return true;
}

/**
 * Given a token, check if there is an existing session
 * linked to the token, return true if such a session
 * exists, false otherwise
 * @param {{ErrorObject | string}} - Token
 *
 * @returns {{boolean}} - True/false or matching token's
 * associated authUserId
*/
function isSessionValid(token: string | ErrorObject): boolean {
  const data: Data = read();
  let matchingToken: Token;
  if (typeof token === 'string') {
    matchingToken = data.tokens.find((existingToken) => existingToken.sessionId === parseInt(token));
  }
  if (matchingToken === undefined) {
    // error if no corresponding token found
    return false;
  }
  return true;
}

/**
 * Given a token, find the corresponding user that created
 * the token (by starting a session), and return the user's authUserId
 * if the user exists, and error msg otherwise.
 * @param {{string | ErrorObject}} - Token
 *
 * @returns {{undefined | number}} - error msg or a user's authUserId
*/
function tokenOwner(token: string | ErrorObject) {
  const data: Data = read();
  if (!isTokenValid(token)) {
    return {
      error: 'Invalid token structure'
    };
  }
  if (!isSessionValid(token)) {
    // error if no corresponding token found
    return {
      error: 'Not a valid session'
    };
  } else {
    if (typeof token === 'string') {
      return data.tokens.find((existingToken) => existingToken.sessionId === parseInt(token)).authUserId;
    }
  }
}

/**
 * Does not return anything, resets the state of the application
 *
 * @param {{}} - No parameters
 *
 * @returns {{}} - Empty object
*/
function clear () {
  let store = read();
  store = {

    // User Data
    users: [],

    // Quiz Data
    quizzes: [],

    tokens: [],

    trash: []
  };
  save(store);
  return {

  };
}
/**
 * Write the new data object to dataStore.json
 *
 * @param {Data} data - data to write
 *
 * @returns {void}
*/
const save = (data: Data) => {
  fs.writeFileSync('./src/dataStore.json', JSON.stringify(data));
};

/**
 * Return the data object stored in dataStore.json
 *
 * @param {void}
 *
 * @returns {Data} returns the data
*/
const read = () => {
  const dataJson = fs.readFileSync('./src/dataStore.json');
  return JSON.parse(String(dataJson));
};

/**
 * Given authUserId, return true or false depending on whether authUserId matches an existing
 * user
 * @param {number} - authUserId
 *
 * @returns {boolean} - true or false
*/
function isValidUser (authUserId: number): boolean {
  const data = read();
  for (const user of data.users) {
    if (user.authUserId === authUserId) {
      return true;
    }
  }
  return false;
}
/**
 * Given the authUserId and quizId of, find if the user has access to the quiz, returns true if they
 * and false if they can not
 *
 * @param {number} authUserId
 * @param {number} quizId
 *
 * @returns {boolean} - true or false
*/
function quizValidOwner (authUserId: number, quizId: number): boolean {
  const data = read();
  for (const user of data.users) {
    if (user.authUserId === authUserId && user.userQuizzes.includes(quizId)) {
      return true;
    }
  }
  return false;
}

/**
 * Given a quizId check if it exists within the datastore, returning true if it exists
 * and false if it does not
 *
 * @param {number} quizId
 *
 * @returns {boolean} - true or false
 */
function quizValidCheck (quizId: number): boolean {
  const data = read();
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId) {
      return true;
    }
  }
  for (const quiz of data.trash) {
    if (quiz.quizId === quizId) {
      return true;
    }
  }
  return false;
}

/**
 * Given description, returns true or false depending on whether it is over 100 characters
 * long
 * @param {string} - description
 *
 * @returns {boolean} - true or false
*/
function isDescriptionLong (description: string): boolean {
  if (description.length > 100) {
    return true;
  }
  return false;
}

/**
 * Given a quiz name, check if the quiz name contains valid characters
 *
 * @param {string} name name of the quiz
 *
 * @returns {boolean} - true or false
*/
function nameQuizIsValid (name: string): boolean {
  const namePattern = /^[a-z\d\s]+$/i;

  if (namePattern.test(name)) {
    return true;
  }
  return false;
}

/**
 * Given a name of a quiz, check if the quiz name is of valid length
 *
 * @param {string} name name of the quiz
 *
 * @returns {boolean} - true or false
*/
function nameLengthIsValid (name: string): boolean {
  if (name.length < 3 || name.length > 30) {
    return false;
  } else {
    return true;
  }
}

/**
 * Given a name to a quiz, check if the user already has a quiz with the same name
 *
 * @param {number} authUserId
 * @param {string} name
 *
 * @returns {boolean} - true or false
 */
function nameTaken (authUserId: number, name: string): boolean {
  const data = read();

  let userQuizzes: number[] = [];

  for (const user of data.users) {
    if (user.authUserId === authUserId) {
      userQuizzes = user.userQuizzes;
    }
  }

  for (let i = 0; i < userQuizzes.length; i++) {
    const quizId = userQuizzes[i];

    for (let j = 0; j < data.quizzes.length; j++) {
      if (data.quizzes[j].quizId === quizId && data.quizzes[j].name === name) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Send a 'post' request to the corresponding server route to register
 * an account
 *
 * @param {string} email user email
 * @param {string} password user password
 * @param {string} nameFirst first name
 * @param {string} nameLast last name
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/register',
    {
      json: {
        email,
        password,
        nameFirst,
        nameLast,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'post' request to the corresponding server route to log in
 *
 * @param {string} email user email
 * @param {string} password user password
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminAuthLogin(email: string, password: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/login',
    {
      json: {
        email,
        password,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'put' request to the corresponding server route to update
 * quiz description
 *
 * @param {string | ErrorObject} token
 * @param {string} quizId quiz id
 * @param {string} description quiz description
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizDescriptionUpdate(token: ErrorObject | string, quizId: number, description: string) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/description`,
    {
      json: {
        token,
        description
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Sends a 'put' request to the corresponding server route to
 * update the user password.
 *
 * @param {string | ErrorObject} token - token/sessionId
 * @param {string} oldPassword old password
 * @param {string} newPassword new password
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminAuthPasswordUpdate(token: ErrorObject | string, oldPassword: string, newPassword: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v1/admin/user/password',
    {
      json: {
        token,
        oldPassword,
        newPassword
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'put' request to the corresponding server route to create
 * a quiz question
 *
 * @param {string | ErrorObject} token - token/sessionId
 * @param {number} quizId quiz Id
 * @param {QuizQuestion} quizQuestion question object
 *
 * @returns {{object}} - response in javascript
*/
function requestQuizQuestionCreate(token: ErrorObject | string, quizId: number, questionBody: any) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${quizId}/question`,
    {
      json: {
        token,
        questionBody
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'post' request to the corresponding server route to create
 * a quiz
 *
 * @param {string | ErrorObject} token - token/sessionId
 * @param {string} name quiz name
 * @param {string} description description of quiz
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizCreate(token: ErrorObject | string, name: string, description: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz',
    {
      json: {
        token,
        name,
        description
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'get' request to the corresponding server route to get the quiz info
 *
 * @param {string | ErrorObject} token - token/sessionId
 * @param {number} quizId quiz Id
 *
 * @returns {{object}} - response in javascript
 */
function requestAdminQuizInfo(token: ErrorObject | string, quizId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/admin/quiz/${quizId}`,
    {
      qs: {
        token
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Sends a 'put' request to update the name of the current quiz
 *
 * @param {string | ErrorObject} token - token/sessionId
 * @param {number} quizId quiz Id
 * @param {string} name quiz name
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizNameUpdate(token: ErrorObject | string, quizId: number, name: string) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/name`,
    {
      json: {
        token,
        name
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'delete' request to the corresponding server route to remove
 * an existing quiz
 *
 * @param {string | ErrorObject} token - token/sessionId
 * @param {number} quizId - quiz Id
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizRemove(token: ErrorObject | string, quizId: number) {
  const res = request(
    'DELETE',
    SERVER_URL + `/v1/admin/quiz/${quizId}`,
    {
      qs: {
        token,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'GET' request to the corresponding server route to show the list of user quizzes
 *
 * @param {string | ErrorObject} token - token/sessionId
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizList(token: ErrorObject | string) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/list',
    {
      qs: {
        token,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'get' request to the corresponding server route to
 * view quizzes in the trash
 *
 * @param {string | ErrorObject} token - token
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizTrash(token: ErrorObject | string) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/trash',
    {
      qs: {
        token,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'post' request to the corresponding server route to
 * transfer a quiz from 1 user to another
 *
 * @param {string | ErrorObject} token - token
 * @param {number} quizId - quiz Id
 * @param {string | ErrorObject} token - token
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizTransfer(token: ErrorObject | string, quizId: number, userEmail: string) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${quizId}/transfer`,
    {
      json: {
        token,
        userEmail
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'POST' request to the corresponding server route to restore
 * an existing quiz
 *
 * @param {string | ErrorObject} token - token/sessionId
 * @param {number} quizId - Quiz Id
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizRestore(token: ErrorObject | string, quizId: number) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${quizId}/restore`,
    {
      json: {
        token
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}
/**
 * Send a 'PUT' request to the corresponding server route to move
 * an existing quiz question
 *
 * @param {number} quizId - token/sessionId
 * @param {number} questionId - token/sessionId
 * @param {string | ErrorObject} token - token/sessionId
 * @param {number} newPosition - new position of quiz question
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizQuestionMove(quizId: number, questionId: number, token: ErrorObject | string, newPosition: number) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}/move`,
    {
      json: {
        token,
        newPosition
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'PUT' request to the corresponding server route to duplicate
 * an existing quiz question
 *
 * @param {number} quizId - token/sessionId
 * @param {number} questionId - token/sessionId
 * @param {string | ErrorObject} token - token/sessionId
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizQuestionDuplicate(token: ErrorObject | string, quizId: number, questionId: number) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`,
    {
      json: {
        token,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Given a quiz question, check if the quiz question length is valid
 *
 * @param {object} questionBody question content
 *
 * @returns {boolean} - true or false
*/
function questionLengthValid(questionBody: any) {
  const question = questionBody.question;

  if (question.length < 5 || question.length > 50) {
    return false;
  } else {
    return true;
  }
}

/**
 * Given a quiz question, check if the quiz there sufficent asnwer within the question
 *
 * @param {object} questionBody Question content
 *
 * @returns {boolean} - true or false
*/
function answerCountValid(questionBody: any) {
  const answers = questionBody.answers;

  if (answers.length < 2 || answers.length > 6) {
    return false;
  } else {
    return true;
  }
}

/**
 * Given a quiz question, check if the quiz question the duration is valid within the question
 *
 * @param {object} questionBody Question content
 *
 * @returns {boolean} - true or false
*/
function durationValid(questionBody: any) {
  const duration = questionBody.duration;

  if (duration > 0) {
    return true;
  } else {
    return false;
  }
}

/**
 * Given a quiz question, check if the quiz does not go over 180sec duration
 *
 * @param {object} data Question content
 * @param {object} questionBody Question content
 * @param {number} quizId quiz Id
 *
 * @returns {boolean} - true or false
*/
function QuizDurationValid(data: any, questionBody: any, quizId: number) {
  let totalDuration = 0;

  const quiz = data.quizzes.find((quiz: { quizId: number; }) => quiz.quizId === quizId);

  for (const question of quiz.questions) {
    totalDuration += question.duration;
  }

  totalDuration += questionBody.duration;

  if (totalDuration > 180) {
    return false;
  }

  return true;
}

/**
 * Given a quiz question, check if the quiz question points is valid
 *
 * @param {object} questionBody question content
 *
 * @returns {boolean} - true or false
*/
function quizPointsValid(questionBody: any) {
  const points = questionBody.points;

  if (points < 1 || points > 10) {
    return false;
  }

  return true;
}

/**
 * Given a quiz question, check if the quiz question asnwer length is valid
 *
 * @param {object} questionBody question content
 *
 * @returns {boolean} - true or false
*/
function quizAnswerValid(questionBody: any) {
  const answers = questionBody.answers;

  for (const answer of answers) {
    const answerLength = answer.answer.length;

    if (answerLength < 1 || answerLength > 30) {
      return false;
    }
  }

  return true;
}

/**
 * Given a quiz question, check if the quiz question asnwer are duplicates
 *
 * @param {object} questionBody question content
 *
 * @returns {boolean} - true or false
*/
function quizAnswerDuplicateValid(questionBody: any) {
  const answers = questionBody.answers;
  const answerSet = new Set();

  for (const answer of answers) {
    if (answerSet.has(answer.answer)) {
      return false;
    }

    answerSet.add(answer.answer);
  }

  return true;
}

/**
 * Given a quiz question, check if the quiz question has at least 1 correct asnwer
 *
 * @param {object} questionBody question content
 *
 * @returns {boolean} - true or false
*/
function quizAnswerCorrectValid(questionBody:any) {
  const answers = questionBody.answers;

  for (const answer of answers) {
    if (answer.correct) {
      return true;
    }
  }

  return false;
}

/**
 * Given a quizId, check if the quiz is in the trash
 *
 * @param {number} quizId QuizId
 *
 * @returns {boolean} - true or false
*/
function isQuizInTrash(quizId: number): boolean {
  const data: Data = read();
  for (const quiz of data.trash) {
    if (quiz.quizId === quizId) {
      return true;
    }
  }
  return false;
}

/**
 * Send a 'DELETE' request to the corresponding server route for user details,
 * returning the response in the form of a javascript object
 *
 * @param {string | ErrorObject} token - token
 * @param {number} quizId - quiz Id
 * @param {number} questionId - question Id
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizQuestionDelete(token: ErrorObject | string, quizId: number, questionId: number) {
  const res = request(
    'DELETE',
    SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`,
    {
      qs: {
        token
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Given a quiz question, check if the quiz question has at least 1 correct asnwer
 *
 * @param {object} data Datastore
 * @param {number} quizId Quiz Id
 * @param {number} questionId Question Id
 *
 * @returns {boolean} - true or false
*/
function questionValidCheck(data: any, quizId: number, questionId: number) {
  const quiz = data.quizzes.find((quiz: { quizId: number; }) => quiz.quizId === quizId);
  for (const question of quiz.questions) {
    if (question.questionId === questionId) {
      return true;
    }
  }
  return false;
}

/**
 * Given a quiz question new position, check if its valid
 *
 * @param {object} data Datastore
 * @param {number} quizId Quiz Id
 * @param {number} newPosition Newposition of quiz question
 *
 * @returns {boolean} - true or false
*/
function newPositionValidCheck(data: any, quizId: number, newPosition: number) {
  const quiz = data.quizzes.find((quiz: { quizId: number; }) => quiz.quizId === quizId);

  if (newPosition < 0 || (newPosition > (quiz.questions.length - 1))) {
    return false;
  }

  return true;
}

/**
 * Given a quiz question new position, check if its the same as original position
 *
 * @param {object} data Datastore
 * @param {number} quizId Quiz Id
 * @param {number} questionId Question Id
 * @param {number} newPosition Newposition of quiz question
 *
 * @returns {boolean} - true or false
*/
function newPositioNotSame(data: any, quizId: number, questionId: number, newPosition: number) {
  const quiz = data.quizzes.find((quiz: { quizId: number; }) => quiz.quizId === quizId);

  const originalPosition = quiz.questions.findIndex((question: { questionId: number; }) => question.questionId === questionId);

  if (originalPosition !== newPosition) {
    return true;
  }

  return false;
}

/**
 * Send a 'put' request to the corresponding server route to
 * question update
 *
 * @param {string | ErrorObject} token - token
 * @param {number} quizId - quiz Id
 * @param {number} questionId - question Id
 * @param {object} questionBody - question object
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizQuestionUpdate(token: ErrorObject | string, quizId: number, questionId: number, questionBody: any) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`,
    {
      json: {
        token,
        questionBody
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'delete' request to the corresponding server route to
 * delete quiz/quizzes from the trash
 *
 * @param {string | ErrorObject} token - token
 * @param {number[]} quizIdArr - quizIds array
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizTrashEmpty(token: ErrorObject | string, quizIdArr: number[]) {
  const res = request(
    'DELETE',
    SERVER_URL + '/v1/admin/quiz/trash/empty',
    {
      qs: {
        token,
        quizIdArr
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Gnerates random colour
 *
 * @returns {string} - colour
*/
function getColour() {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];
  const randomColorIndex = Math.floor(Math.random() * colors.length);
  return colors[randomColorIndex];
}

/**
 * Send a 'post' which logs out the provided tokens user session
 *
 * @param {ErrorObject | string} token - token/sessionId
 *
 * @returns {{}} - none
*/
function requestAdminAuthLogout(token: ErrorObject | string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/logout',
    {
      json: {
        token
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'put' request to the corresponding server route to
 * update user details
 *
 * @param {string | ErrorObject} token - token
 * @param {string} - user email
 * @param {string} - user first name
 * @param {string} - user last name
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminAuthDetailsUpdate(token: ErrorObject | string, email: string, nameFirst: string, nameLast: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v1/admin/user/details',
    {
      json: {
        token,
        email,
        nameFirst,
        nameLast
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

export {
  clear, save, read, tokenOwner, isValidUser, nameQuizIsValid, quizValidCheck, nameLengthIsValid, nameTaken, isDescriptionLong,
  quizValidOwner, requestClear, requestGetAdminUserDetails, requestAdminAuthRegister, requestAdminAuthLogin, requestAdminQuizDescriptionUpdate,
  requestAdminQuizCreate, requestAdminQuizNameUpdate, requestAdminQuizRemove, requestAdminQuizTransfer, requestAdminQuizList, requestAdminQuizInfo, requestAdminQuizTrash, requestAdminQuizRestore,
  requestQuizQuestionCreate, questionLengthValid, answerCountValid, durationValid, QuizDurationValid, quizPointsValid, quizAnswerValid, quizAnswerDuplicateValid,
  quizAnswerCorrectValid, isQuizInTrash, requestAdminQuizQuestionMove, questionValidCheck, newPositioNotSame, newPositionValidCheck, requestAdminQuizQuestionDuplicate,
  requestAdminQuizQuestionDelete, requestAdminQuizQuestionUpdate, requestAdminQuizTrashEmpty, getColour, requestAdminAuthPasswordUpdate, requestAdminAuthLogout, requestAdminAuthDetailsUpdate
};
