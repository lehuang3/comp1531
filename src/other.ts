import fs from 'fs';
import { Data, Token } from './interfaces';
import request from 'sync-request';
import { port, url } from './config.json';
import { ErrorObject, QuizQuestion } from './interfaces';
import { Console } from 'console';
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
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}

/**
 * Send a 'get' request to the corresponding server route for user details, 
 * returning the response in the form of a javascript object
 * @param {{}} - No parameters
 *
 * @returns {{object}} - response in javascript
*/
function requestGetAdminUserDetails(token: ErrorObject | string) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/user/details',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        token,
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}

/**
 * Given a token, find the corresponding user that created
 * the token (by starting a session), and return the user's authUserId
 * if the user exists, and undefined otherwise.
 * @param {{string | ErrorObject}} - Token
 *
 * @returns {{undefined | number}} - undefined or a user's authUserId
*/
function tokenOwner(token: string | ErrorObject) {
  const data: Data = read();
  if (!isSessionValid(token)) {
    // error if no corresponding token found
    return undefined;
  } else {
    if (typeof token === 'string') {
      return data.tokens.find((existingToken) => existingToken.sessionId === parseInt(token)).authUserId;
    }
    
  }
}

/**
 * Check if a token passed in has a valid
 * structure, and return a boolean value accordingly.
 * @param {{ErrorObject | string}} - Token
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
  return true
}

/**
 * Does not return anything, resets the state of the application
 *
 * @param {{}} - No parameters
 *
 * @returns {{}} - Empty object
*/
function clear () {
  let store = read()
  store = {

    // User Data
    users: [],

    // Quiz Data
    quizzes: [],

    tokens: [],

    trash:[]
  }
  save(store)
  return {

  }
}
/**
 * Write the new data object to dataStore.json
 * 
 * @param {Data} - data to write 
 *
 * @returns {void} 
*/
const save = (data: Data) => {
  fs.writeFileSync('./src/dataStore.json', JSON.stringify(data));
}

/**
 * Return the data object stored in dataStore.json
 * 
 * @param {void} 
 *
 * @returns {void}
*/
const read = () => {
  const dataJson = fs.readFileSync('./src/dataStore.json');
  return JSON.parse(String(dataJson));
}

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
      return true
    }
  }
  return false
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
  const data = read()
  for (const user of data.users) {
    if (user.authUserId === authUserId && user.userQuizzes.includes(quizId)) {
      return true
    }
  }
  return false
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
  const data = read()
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId) {
      return true
    }
  }
  for (const quiz of data.trash) {
    if (quiz.quizId === quizId) {
      return true
    }
  }
  return false
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
    return true
  }
  return false
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
    return true
  }
  return false
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
    return false
  } else {
    return true
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
  const data = read()

  let userQuizzes: number[] = []

  for (const user of data.users) {
    if (user.authUserId === authUserId) {
      userQuizzes = user.userQuizzes
    }
  }

  for (let i = 0; i < userQuizzes.length; i++) {
    const quizId = userQuizzes[i]

    for (let j = 0; j < data.quizzes.length; j++) {
      if (data.quizzes[j].quizId === quizId && data.quizzes[j].name === name) {
        return true
      }
    }
  }

  return false
}

/**
 * Send a 'delete' request to the corresponding server route to reset the
 * application state, returning the response in the form of a javascript object
 * @param {{}} - No parameters
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/register',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      json: {
        email,
        password,
        nameFirst,
        nameLast,
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}

/**
 * Send a 'delete' request to the corresponding server route to reset the
 * application state, returning the response in the form of a javascript object
 * @param {{}} - No parameters
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminAuthLogin(email: string, password: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/login',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      json: {
        email,
        password,
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}

/**
 * Send a 'delete' request to the corresponding server route to reset the
 * application state, returning the response in the form of a javascript object
 * @param {{}} - No parameters
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizDescriptionUpdate(token: ErrorObject | string, quizId: number, description: string) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/description`,
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      json: {
        token,
        description
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}

/**
 * Send a 'delete' request to the corresponding server route to reset the
 * application state, returning the response in the form of a javascript object
 * @param {{}} - No parameters
 *
 * @returns {{object}} - response in javascript
*/
function requestQuizQuestionCreate(token: ErrorObject | string, quizId: number, quizQuestion: object) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/question`,
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      json: {
        token,
        quizQuestion
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}


/**
 * Send a 'delete' request to the corresponding server route to reset the
 * application state, returning the response in the form of a javascript object
 * @param {{}} - No parameters
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizCreate(token: ErrorObject | string, name:string, description:string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      json: {
        token,
        name,
        description
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}

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
  } 
}
    
/**
 * Sends a request to update the name of the current quiz
 * 
 * @param token 
 * @param quizId 
 * @param name 
 * 
 * @returns 
*/

function requestAdminQuizNameUpdate(token: ErrorObject | string, quizId: number, name:string) {
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
  } 
}

/**
 * Send a 'delete' request to the corresponding server route to reset the
 * application state, returning the response in the form of a javascript object
 * @param {{}} - No parameters
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizRemove(token: ErrorObject | string, quizId: number ) {
  const res = request(
    'DELETE',
    SERVER_URL + `/v1/admin/quiz/${quizId}`,
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        token,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}

function requestAdminQuizList(token: ErrorObject | string ) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/admin/quiz/list`,
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        token,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}

/**
 * Send a 'get' request to the corresponding server route to 
 * view quizzes in the trash
 * @param {{string | ErrorObject}} - token
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizTrash(token: ErrorObject | string) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/trash',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        token,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}

/**
 * Send a 'post' request to the corresponding server route to
 * transfer a quiz from 1 user to another
 * @param {{string | ErrorObject}} - token
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizTransfer(token: ErrorObject | string, quizId: number, userEmail: string) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${quizId}/transfer`,
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      json: {
        token,
        userEmail
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}

function requestAdminQuizRestore(token: ErrorObject | string, quizId: number) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${quizId}/restore`,
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      json: {
        token
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}

/**
 * Sends a request to update the name of the current quiz
 * 
 * @param token 
 * @param quizId 
 * @param name 
 * 
 * @returns 
*/

function requestAdminQuizQuestionMove(quizId: number, questionId: number,  token: ErrorObject | string, newPosition: number) {
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
  } 
}

/**
 * Sends a request to update the name of the current quiz
 * 
 * @param token 
 * @param quizId 
 * @param name 
 * 
 * @returns 
*/

function requestAdminQuizQuestionDuplicate(token: ErrorObject | string,quizId: number, questionId: number) {
  const res = request(
    'PUT',
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
  } 
}


function questionLengthValid(quizQuestion: QuizQuestion) {
  var question = quizQuestion.questionBody.question;

  if (question.length < 5 || question.length > 50) {
    return false;
  } else {
    return true;
  }
}

function answerCountValid(quizQuestion: QuizQuestion) {
  var answers = quizQuestion.questionBody.answers;

  if (answers.length < 2 || answers.length > 6) {
    return false;
  } else {
    return true;
  }
}

function durationValid(quizQuestion: QuizQuestion) {
  var duration = quizQuestion.questionBody.duration;

  if (duration > 0) {
    return true;
  } else {
    return false;
  }
}

function QuizDurationValid(data:any, quizQuestion:QuizQuestion, quizId:number) {
  let totalDuration = 0;

  const quiz = data.quizzes.find((quiz: { quizId: number; }) => quiz.quizId === quizId);

  for (const question of quiz.questions) {
    totalDuration += question.duration;
  }

  totalDuration += quizQuestion.questionBody.duration;

  if (totalDuration > 180) {
    return false;
  }

  return true;
}

function quizPointsValid(quizQuestion:QuizQuestion) {
  const points = quizQuestion.questionBody.points;

  if (points < 1 || points > 10) {
    return false;
  }

  return true;
}

function quizAnswerValid(quizQuestion: QuizQuestion) {
  const answers = quizQuestion.questionBody.answers;

  for (const answer of answers) {
    const answerLength = answer.answer.length;

    if (answerLength < 1 || answerLength > 30) {
      return false;
    }
  }

  return true;
}

function quizAnswerDuplicateValid(quizQuestion:QuizQuestion) {
  const answers = quizQuestion.questionBody.answers;
  const answerSet = new Set();

  for (const answer of answers) {
    if (answerSet.has(answer.answer)) {
      return false;
    }

    answerSet.add(answer.answer);
  }

  return true;
}

function quizAnswerCorrectValid(quizQuestion:QuizQuestion) {
  const answers = quizQuestion.questionBody.answers;

  for (const answer of answers) {
    if (answer.correct) {
      return true;
    }
  }

  return false;
}

function isQuizInTrash(quizId: number): boolean {
  const data: Data = read();
  for (const quiz of data.trash) {
    if (quiz.quizId === quizId) {
      return true;
    }
  }
  return false;
}

function requestAdminQuizQuestionDelete(token: ErrorObject | string, quizId: number, questionId: number) {
  const res = request(
    'DELETE',
    SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`,
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        token
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}


function questionValidCheck(data:any, quizId:number, questionId:number) {
  const quiz = data.quizzes.find((quiz: { quizId: number; }) => quiz.quizId === quizId);
  for (const question of quiz.questions) {
    if (question.questionId === questionId) {
      return true;
    }
  }
  return false;
}


function newPositionValidCheck(data:any, quizId:number, newPosition: number) {
  const quiz = data.quizzes.find((quiz: { quizId: number; }) => quiz.quizId === quizId);

  if(newPosition < 0 || (newPosition > (quiz.questions.length-1))){
    return false;
  }

  return true;

}

function newPositioNotSame(data:any, quizId:number,questionId:number, newPosition: number) {
  const quiz = data.quizzes.find((quiz: { quizId: number; }) => quiz.quizId === quizId);

  const originalPosition = quiz.questions.findIndex((question: { questionId: number; }) => question.questionId === questionId);

  if(originalPosition !== newPosition){
    return true;
  }

  return false;

}


function requestAdminQuizQuestionUpdate(token: ErrorObject | string, quizId: number, questionId: number, quizQuestion: QuizQuestion) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`,
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      json: {
        token,
        quizQuestion
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}

/**
 * Send a 'delete' request to the corresponding server route to
 * delete quiz/quizzes from the trash
 * @param {{string | ErrorObject}} - token
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizTrashEmpty(token: ErrorObject | string, quizIdArr: number[]) {
  const res = request(
    'DELETE',
    SERVER_URL + '/v1/admin/quiz/trash/empty',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        token,
        quizIdArr
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  } 
}

function getColour() {
  const colors = ["red", "blue", "green", "yellow", "purple", "brown", "orange"];
  const randomColorIndex = Math.floor(Math.random() * colors.length);
  return colors[randomColorIndex];
}

/**
 *
 * @param {{token}} - token/sessionId
 *
 * @returns {{}} - none
*/
function requestAdminAuthLogout(token: ErrorObject | TokenParameter) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/logout',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      json: {
        token
      }
    }
  );
  //console.log(JSON.parse(res.body.toString()));
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  }
}


export { clear, save, read, isTokenValid, isSessionValid, tokenOwner, isValidUser, nameQuizIsValid, quizValidCheck, nameLengthIsValid, nameTaken, isDescriptionLong, 
  quizValidOwner, requestClear, requestGetAdminUserDetails, requestAdminAuthRegister, requestAdminAuthLogin, requestAdminQuizDescriptionUpdate,
  requestAdminQuizCreate, requestAdminQuizNameUpdate, requestAdminQuizRemove, requestAdminQuizTransfer, requestAdminQuizList, requestAdminQuizInfo, requestAdminQuizTrash, requestAdminQuizRestore,
  requestQuizQuestionCreate, questionLengthValid, answerCountValid, durationValid, QuizDurationValid, quizPointsValid, quizAnswerValid, quizAnswerDuplicateValid, 
  quizAnswerCorrectValid, isQuizInTrash,requestAdminQuizQuestionMove,questionValidCheck, newPositioNotSame,newPositionValidCheck,requestAdminQuizQuestionDuplicate, 
  requestAdminQuizQuestionDelete, requestAdminQuizQuestionUpdate, requestAdminQuizTrashEmpty, requestAdminAuthLogout, getColour };


