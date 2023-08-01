import fs from 'fs';
import { Data, Token, State, AnswerResult } from './interfaces';
import {clearTimeouts} from './session'
import request from 'sync-request';
import { port, url } from './config.json';
import { ErrorObject, Session, Attempt } from './interfaces';
// import { Session } from 'inspector';
// import arrayShuffle from 'array-shuffle';
const shuffle = require('shuffle-array');
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
  const res = request(
    'GET',
    SERVER_URL + '/v2/admin/user/details',
    {
      headers: {
        token: token as string,
      },
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
    matchingToken = data.tokens.find((existingToken) => existingToken.sessionId === token);
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
      return data.tokens.find((existingToken) => existingToken.sessionId === token).authUserId;
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
  clearTimeouts();
  store = {

    // User Data
    users: [],

    // Quiz Data
    quizzes: [],

    tokens: [],

    trash: [],

    sessions: [],

  };
  // Deletes all the pictures but broke all the tests so left as comments for the time being

  // const files = fs.readdirSync('./static');
  // files.forEach((file) => {
  //   const fileName = `/static/${file}`;
  //   fs.unlink(fileName, (err) => {
  //     if (err) throw err
  //   })
  // })
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
 * Given a quizId check if it exists within the list of active quizzes,
 * returning true if it exists and false if it does not
 *
 * @param {number} quizId
 *
 * @returns {boolean} - true or false
 */
function quizActiveCheck (quizId: number): boolean {
  const data = read();
  for (const quiz of data.quizzes) {
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
    SERVER_URL + `/v2/admin/quiz/${quizId}/description`,
    {
      headers: {
        token: token as string,
      },
      json: {
        description,
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
    SERVER_URL + '/v2/admin/user/password',
    {
      headers: {
        token: token as string,
      },
      json: {
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
    SERVER_URL + `/v2/admin/quiz/${quizId}/question`,
    {
      headers: {
        token: token as string
      },
      json: {
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
    SERVER_URL + '/v2/admin/quiz',
    {
      headers: {
        token: token as string
      },
      json: {
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
    SERVER_URL + `/v2/admin/quiz/${quizId}`,
    {
      headers: {
        token: token as string
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
    SERVER_URL + `/v2/admin/quiz/${quizId}/name`,
    {
      headers: {
        token: token as string
      },
      json: {
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
    SERVER_URL + `/v2/admin/quiz/${quizId}`,
    {
      headers: {
        token: token as string
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
    SERVER_URL + '/v2/admin/quiz/list',
    {
      headers: {
        token: token as string
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
    SERVER_URL + '/v2/admin/quiz/trash',
    {
      headers: {
        token: token as string,
      },
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
    SERVER_URL + `/v2/admin/quiz/${quizId}/transfer`,
    {
      headers: {
        token: token as string,
      },
      json: {
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
    SERVER_URL + `/v2/admin/quiz/${quizId}/restore`,
    {
      headers: {
        token: token as string
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
    SERVER_URL + `/v2/admin/quiz/${quizId}/question/${questionId}/move`,
    {
      headers: {
        token: token as string
      },
      json: {
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
    SERVER_URL + `/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`,
    {
      headers: {
        token: token as string
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

  totalDuration = questionBody.duration + quiz.duration;

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
    SERVER_URL + `/v2/admin/quiz/${quizId}/question/${questionId}`,
    {
      headers: {
        token: token as string
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
    SERVER_URL + `/v2/admin/quiz/${quizId}/question/${questionId}`,
    {
      headers: {
        token: token as string
      },
      json: {
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
 * @param {number[]} quizIds - quizIds array
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizTrashEmpty(token: ErrorObject | string, quizIds: string) {
  const res = request(
    'DELETE',
    SERVER_URL + '/v2/admin/quiz/trash/empty',
    {
      headers: {
        token: token as string,
      },
      qs: {
        quizIds
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
    SERVER_URL + '/v2/admin/auth/logout',
    {
      headers: {
        token: token as string,
      },
      json: {
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
    SERVER_URL + '/v2/admin/user/details',
    {
      headers: {
        token: token as string
      },
      json: {
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

function requestAdminQuizThumbnailUpdate(token: ErrorObject | string, quizId: number, imgUrl: string) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/thumbnail`,
    {
      headers: {
        token: token as string
      },
      json: {
        imgUrl
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

function requestAdminSessionChatView(playerId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/player/${playerId}/chat`
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

function requestAdminSessionChatSend(playerId: number, message: string) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/player/${playerId}/chat`,
    {
      json: {
        message
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

function isSameQuizName(userEmail: string, quizId: number): boolean {
  const data: Data = read();
  const users = data.users;
  const targetUserQuizzes = users.filter(user => user.email === userEmail)[0].userQuizzes;
  const transferedQuizName = data.quizzes.filter(quiz => quiz.quizId === quizId)[0].name;
  // compare name of quiz to be transfered with every quiz name of quizzes that the target user has
  for (const userQuizId of targetUserQuizzes) {
    let targetUserQuiz = data.quizzes.filter(quiz => quiz.quizId === userQuizId)[0];
    if (targetUserQuiz === undefined) {
      targetUserQuiz = data.trash.filter(quiz => quiz.quizId === userQuizId)[0];
    }
    if (transferedQuizName === targetUserQuiz.name) {
      return true;
    }
  }
  return false;
}

/**
 * Send a 'POST' request to the corresponding server route to
 * create a new session (instance) for a quiz
 *
 * @param {string | ErrorObject} token - token
 * @param {number} - quizId
 * @param {number} - autoStartNum
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizSessionStart(token: string | ErrorObject, quizId: number, autoStartNum: number) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${quizId}/session/start`,
    {
      headers: {
        token: token as string
      },
      json: {
        autoStartNum,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'POST' request to the corresponding server route to
 * create a new session (instance) for a quiz
 *
 * @param {string | ErrorObject} token - token
 * @param {number} - quizId
 * @param {number} - autoStartNum
 *
 * @returns {{object}} - response in javascript
*/
function requestQuizSessionPlayerJoin(sessionId:number, name:string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/player/join',
    {

      json: {
        sessionId,
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
 * Send a 'POST' request to the corresponding server route to
 * create a new session (instance) for a quiz
 *
 * @param {string | ErrorObject} token - token
 * @param {number} - quizId
 * @param {number} - autoStartNum
 *
 * @returns {{object}} - response in javascript
*/
function requestQuizSessionPlayerStatus(playerId:number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/player/${playerId}`,
    {

    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Send a 'POST' request to the corresponding server route to
 * create a new session (instance) for a quiz
 *
 * @param {string | ErrorObject} token - token
 * @param {number} - quizId
 * @param {number} - autoStartNum
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizSessionState(token:string | ErrorObject, quizId:number, sessionId:number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/admin/quiz/${quizId}/session/${sessionId}`,
    {
      headers: {
        token: token as string
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Given a quizId, returns true or false depending on
 * whether the questions array of the quiz is empty
 *
 * @param {number} quizId Quiz Id
 *
 * @returns {boolean} - true or false
*/
function quizHasQuestion(quizId: number): boolean {
  const data: Data = read();
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId) {
      if (quiz.questions.length === 0) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Counts the number of currently active sessions (not in END state) (in general - across all users
 * and quizzes) and returns the count
 *
 * @param {number} quizId Quiz Id
 *
 * @returns {number} - number of active sessions
*/
function activeSessions(): number {
  const data: Data = read();
  return data.sessions.filter(session => session.state !== State.END).length;
}

/**
 * Generates a random sessionId that is unique
 *
 * @param {void}
 *
 * @returns {number} - sessionId
*/
function generateSessionId(): number {
  const data: Data = read();
  let sessionId = Math.floor(Math.random() * 1000);
  while (data.sessions.filter(sesison => sesison.quizSessionId === sessionId).length !== 0) {
    sessionId = Math.floor(Math.random() * 1000);
  }
  return sessionId;
}

/**
 * Send a 'put' request to the corresponding server route to
 * create a new session (instance) for a quiz
 *
 * @param {string | ErrorObject} token - token
 * @param {number} - quizId
 * @param {number} - sessionId
 * @param {string} - action
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizSessionStateUpdate(token: string | ErrorObject, quizId: number, sessionId: number, action: string) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/session/${sessionId}`,
    {
      headers: {
        token: token as string
      },
      json: {
        action
      }
    }
  );
  // console.log(JSON.parse(res.body.toString()))
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Checks whether sessionId is related to the quizId
 * passed in, returning true or false accordingly
 *
 * @param {number} - quizId
 * @param {number} - sessionId
 *
 * @returns {number} - sessionId
*/
function quizSessionIdValidCheck(quizId: number, sessionId: number): boolean {
  const data: Data = read();
  for (const session of data.sessions) {
    if (session.quizSessionId === sessionId) {
      if (session.metadata.quizId === quizId) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks whether action passed in is applicable given the
 * current state of the passed in session
 *
 * @param {number} - sessionId
 * @param {string} - action
 *
 * @returns {object} - applicability & nextState if there is one
*/
function isActionApplicable(sessionId: number, action: string): any {
  const data: Data = read();
  for (const session of data.sessions) {
    if (session.quizSessionId === sessionId) {
      const state = session.state;
      switch (state) {
        case State.LOBBY:
          if (action === 'NEXT_QUESTION') {
            return {
              applicable: true,
              nextState: 'QUESTION_COUNTDOWN'
            };
          } else if (action === 'END') {
            return {
              applicable: true,
              nextState: 'END'
            };
          } else {
            return {
              applicable: false,
              nextState: ''
            };
          }
        case State.QUESTION_COUNTDOWN:
          if (action === 'END') {
            return {
              applicable: true,
              nextState: 'END'
            };
          } else if (action === 'NEXT_QUESTION') {
            return {
              applicable: true,
              nextState: 'ANSWER_SHOW'
            };
          } else {
            return {
              applicable: false,
              nextState: ''
            };
          }
        case State.QUESTION_OPEN:
          if (action === 'END') {
            return {
              applicable: true,
              nextState: 'END'
            };
          } else if (action === 'GO_TO_ANSWER') {
            return {
              applicable: true,
              nextState: 'ANSWER_SHOW'
            };
          } else {
            return {
              applicable: false,
              nextState: ''
            };
          }
        case State.QUESTION_CLOSE:
          if (action === 'END') {
            return {
              applicable: true,
              nextState: 'END'
            };
          } else if (action === 'GO_TO_ANSWER') {
            return {
              applicable: true,
              nextState: 'ANSWER_SHOW'
            };
          } else if (action === 'GO_TO_FINAL_RESULTS') {
            return {
              applicable: true,
              nextState: 'FINAL_RESULTS'
            };
          } else {
            return {
              applicable: true,
              nextState: 'QUESTION_COUNTDOWN'
            };
          }
        case State.ANSWER_SHOW:
          if (action === 'NEXT_QUESTION') {
            return {
              applicable: true,
              nextState: 'QUESTION_COUNTDOWN'
            };
          } else if (action === 'END') {
            return {
              applicable: true,
              nextState: 'END'
            };
          } else if (action === 'GO_TO_FINAL_RESULTS') {
            return {
              applicable: true,
              nextState: 'FINAL_RESULTS'
            };
          } else {
            return {
              applicable: false,
              nextState: ''
            };
          }
        case State.FINAL_RESULTS:
          if (action === 'END') {
            return {
              applicable: true,
              nextState: 'END'
            };
          } else {
            return {
              applicable: false,
              nextState: ''
            };
          }
        case State.END:
          return {
            applicable: false,
            nextState: ''
          };
      }
    }
  }
  return true;
}

function isSessionInLobby(sessions: any, sessionId:number) {
  const session = sessions.find((session:any) => session.quizSessionId === sessionId);
  if (session.state === State.LOBBY) {
    return true;
  }

  return false;
}

function nameExistinSession(sessions: any, name:string, sessionId:number) {
  const session = sessions.find((session:any) => session.quizSessionId === sessionId);
  const foundPlayer = session.players.find((player:any) => player.playerName === name);
  if (foundPlayer !== undefined) {
    return true;
  }

  return false;
}

function generateRandomName() {
  const letters = shuffle(
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  );
  const numbers = shuffle(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
  let name = '';

  for (let i = 0; i < 5; i++) {
    name += letters[i];
  }

  for (let i = 0; i < 3; i++) {
    name += numbers[i];
  }
  // console.log(name);
  return name;
}

/**
 * Send a 'put' request to the corresponding server route to
 * create a new session (instance) for a quiz
 *
 * @param {string | ErrorObject} token - token
 * @param {number} - quizId
 * @param {number} - sessionId
 * @param {string} - action
 *
 * @returns {{object}} - response in javascript
*/
function requestPlayerAnswerSubmit(playerId: number, questionposition: number, answerIds: number[]) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/player/${playerId}/question/${questionposition}/answer`,
    {
      json: {
        answerIds
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

function requestAdminSessioQuestionResult(playerId: number, questionposition: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/player/${playerId}/question/${questionposition}/results`,
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

function requestAdminSessionFinalResult(playerId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/player/${playerId}/results`,
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/**
 * Finds in data a session that has playerId passed in,
 * returns undefined otherwise
 *
 * @param {number} - playerId
 *
 * @returns {undefined | Session} - session or undefined
*/
function findPlayerSession(playerId: number) {
  const data: Data = read();
  for (const session of data.sessions) {
    if (session.players.filter(player => player.playerId === playerId).length !== 0) {
      return session;
    }
  }
  return undefined;
}

/**
 * Checks if within answerIds array there is any answer that
 * does not match the allowed range of answerIds for a question,
 * returns true or false accordingly
 *
 * @param {Session} - session
 * @param {number} - questionposition
 * @param {number[]} - answerIds
 *
 * @returns {boolean} - true or false
*/
function answerIdsValidCheck(session: Session, questionposition: number, answerIds: number[]) {
  for (const answerId of answerIds) {
    if (answerId < 0 || answerId >= session.metadata.questions[questionposition - 1].answers.length) {
      return false;
    }
  }

  return true;
}

function findScalingFactor(timeTaken: number, correctPlayers: Attempt[]) {
  return 1 / (correctPlayers.indexOf(correctPlayers.find(attempt => attempt.timeTaken === timeTaken)) + 1);
}

function getAverageAnswerTime(session: Session, questionposition: number) {
  const noPlayers = session.metadata.questions[questionposition - 1].attempts.length;
  const totalTimeTaken = session.metadata.questions[questionposition - 1].attempts.reduce((sum, attempt) => sum + attempt.timeTaken, 0);
  return totalTimeTaken / noPlayers;
}

function getPercentCorrect(session: Session, questionposition: number) {
  const noPlayers = session.metadata.questions[questionposition - 1].attempts.length;
  const noCorrectPlayers = session.metadata.questions[questionposition - 1].attempts.filter(attempt => attempt.points !== 0).length;
  return noCorrectPlayers / noPlayers * 100;
}

function changeState(sessionId: number, state: State) {
  const data: Data = read();
  for (const session of data.sessions) {
    if (session.quizSessionId === sessionId) {
      session.state = state;
    }
  }
  save(data);
}

function isSessionAtLastQuestion(sessionId: number) {
  const data: Data = read();
  for (const session of data.sessions) {
    if (session.quizSessionId === sessionId) {
      const questionsLength = session.metadata.questions.length;
      if (session.atQuestion === questionsLength) {
        return true;
      }
    }
  }
  return false;
}

function getSessionState(sessionId: number) {
  const data: Data = read();
  for (const session of data.sessions) {
    if (session.quizSessionId === sessionId) {
      return session.state;
    }
  }
}

/**
 * Send a 'get' request to the corresponding server route to
 * fetch details of a question for given player
 *
 * @param {number} - playerId
 * @param {number} - questionposition
 *
 * @returns {{object}} - response in javascript
*/
function requestPlayerQuestionInfo(playerId: number, questionposition: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/player/${playerId}/question/${questionposition}`,
    {
      qs: {
      }
    }
  );
  // console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}



function getQuestionResults(data: Data, sess: Session, questionposition: number) {
  // any for time being
  let correctAnswerIds: number[] = [];
  const correctPlayers: AnswerResult[] = [];
  // finds all the correct answerids which exist
  for (const quiz of data.quizzes) {
    for (const question of quiz.questions) {
      for (const correctAnswer of question.answers) {
        if (correctAnswer.correct === true && !correctAnswerIds.includes(correctAnswer.answerId)) {
          correctAnswerIds.push(correctAnswer.answerId);
        }
      }
    }
  }

  let answerObject: AnswerResult = {
    answerId: null,
    playersCorrect: []
  }

  // loop through all the possible answers in this question and look for the ones that are correct, then for that answer check who picked it and add to array players correct
  for (const answer of sess.metadata.questions[questionposition - 1].answers) {
    if (correctAnswerIds.includes(answer.answerId)) {
      answerObject.answerId = answer.answerId;
      answerObject.playersCorrect = [];
      correctAnswerIds = correctAnswerIds.filter((value) => value !== answer.answerId)
      for (const player of sess.metadata.questions[questionposition - 1].attempts) {
        if (player.answers.includes(answerObject.answerId) && !answerObject.playersCorrect.includes(player.playerName)) {
          answerObject.playersCorrect.push(player.playerName)
        }
      }
      correctPlayers.push(answerObject);
    }
  }

  // const answer = {
  //   questionId: sess.metadata.questions[questionposition - 1].questionId,
  //   questionCorrectBreakdown: correctPlayers,
  //   averageAnswerTime: getAverageAnswerTime(sess, questionposition),
  //   percentCorrect: getPercentCorrect(sess, questionposition)
  // }
  // console.log(answer)
  return {
    questionId: sess.metadata.questions[questionposition - 1].questionId,
    questionCorrectBreakdown: correctPlayers,
    averageAnswerTime: getAverageAnswerTime(sess, questionposition),
    percentCorrect: getPercentCorrect(sess, questionposition)
  }
}

function requestAdminQuizSessionFinal(token:string | ErrorObject, quizId:number, sessionId:number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/admin/quiz/${quizId}/session/${sessionId}/results`,
    {
      headers: {
        token: token as string
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

function isSessionInFinal(sessionArray:any,sessionId:number){
  const session = sessionArray.find((session: { quizSessionId: number; }) => session.quizSessionId === sessionId);
  if (session.state === State.FINAL_RESULTS) {
    return true
  }
  return false;
}
  
function saveImg(imgUrl: string) {
  const res = request(
    'GET',
    `${imgUrl}`
  );
  let i = 0;
  let fileName = `static/${i}.jpg`;
  while (fs.existsSync(fileName)) {
    i ++;
    fileName = `static/${i}.jpg`;
  }

  fs.writeFileSync(fileName, res.getBody(), { flag: 'w' })
  return fileName
}

export {
  clear, save, read, tokenOwner, isValidUser, nameQuizIsValid, quizValidCheck, nameLengthIsValid, nameTaken, isDescriptionLong, isSameQuizName,
  quizValidOwner, requestClear, requestGetAdminUserDetails, requestAdminAuthRegister, requestAdminAuthLogin, requestAdminQuizDescriptionUpdate,
  requestAdminQuizCreate, requestAdminQuizNameUpdate, requestAdminQuizRemove, requestAdminQuizTransfer, requestAdminQuizList, requestAdminQuizInfo, requestAdminQuizTrash, requestAdminQuizRestore,
  requestQuizQuestionCreate, questionLengthValid, answerCountValid, durationValid, QuizDurationValid, quizPointsValid, quizAnswerValid, quizAnswerDuplicateValid,
  quizAnswerCorrectValid, isQuizInTrash, requestAdminQuizQuestionMove, questionValidCheck, newPositioNotSame, newPositionValidCheck, requestAdminQuizQuestionDuplicate,
  requestAdminQuizQuestionDelete, requestAdminQuizQuestionUpdate, requestAdminQuizTrashEmpty, getColour, requestAdminAuthPasswordUpdate, requestAdminAuthLogout,
  requestAdminAuthDetailsUpdate, requestAdminQuizSessionStart, quizActiveCheck, quizHasQuestion, activeSessions, generateSessionId, requestAdminQuizSessionStateUpdate,
  quizSessionIdValidCheck, isActionApplicable, requestAdminQuizThumbnailUpdate, requestQuizSessionPlayerJoin, isSessionInLobby, nameExistinSession, generateRandomName,
  requestQuizSessionPlayerStatus, requestPlayerAnswerSubmit, findPlayerSession, answerIdsValidCheck, findScalingFactor, getAverageAnswerTime, getPercentCorrect,
  changeState, requestAdminSessionChatView, requestAdminSessionChatSend, requestPlayerQuestionInfo,requestAdminQuizSessionState, getQuestionResults,
  requestAdminSessioQuestionResult, requestAdminSessionFinalResult, isSessionAtLastQuestion, getSessionState, saveImg, requestAdminQuizSessionFinal, isSessionInFinal
};
