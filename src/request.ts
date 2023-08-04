import request from 'sync-request';
import { port, url } from './config.json';
import { ErrorObject } from './interfaces';
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
 * Send a 'post' which logs out the provided tokens user session
 *
 * @param {ErrorObject | string} token - token/sessionId
 *
 * @returns {{}} - none
*/
function v1requestAdminAuthLogout(token: ErrorObject | string) {
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
 * Send a 'get' request to the corresponding server route for user details,
 * returning the response in the form of a javascript object
 * @param {{string | ErrorObject}}
 *
 * @returns {{object}} - response in javascript
*/
function v1requestGetAdminUserDetails(token: ErrorObject | string) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/user/details',
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
function v1requestAdminAuthDetailsUpdate(token: ErrorObject | string, email: string, nameFirst: string, nameLast: string) {
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
function v1requestAdminAuthPasswordUpdate(token: ErrorObject | string, oldPassword: string, newPassword: string) {
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
 * Send a 'GET' request to the corresponding server route to show the list of user quizzes
 *
 * @param {string | ErrorObject} token - token/sessionId
 *
 * @returns {{object}} - response in javascript
*/
function v1requestAdminQuizList(token: ErrorObject | string) {
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
 * Send a 'post' request to the corresponding server route to create
 * a quiz
 *
 * @param {string | ErrorObject} token - token/sessionId
 * @param {string} name quiz name
 * @param {string} description description of quiz
 *
 * @returns {{object}} - response in javascript
*/
function v1requestAdminQuizCreate(token: ErrorObject | string, name: string, description: string) {
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

function requestAdminQuizSessionFinalCsv(token:string | ErrorObject, quizId:number, sessionId:number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/admin/quiz/${quizId}/session/${sessionId}/results/csv`,
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
 * v1 version of requestAdminQuizDescriptionUpdate
 *
 * @param {string | ErrorObject} token
 * @param {string} quizId quiz id
 * @param {string} description quiz description
 *
 * @returns {{object}} - response in javascript
*/
function v1requestAdminQuizDescriptionUpdate(token: ErrorObject | string, quizId: number, description: string) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/description`,
    {
      json: {
        token,
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
 * Send a 'put' request to the corresponding server route to create
 * a quiz question
 *
 * @param {string | ErrorObject} token - token/sessionId
 * @param {number} quizId quiz Id
 * @param {QuizQuestion} quizQuestion question object
 *
 * @returns {{object}} - response in javascript
*/
function requestQuizQuestionCreateV1(token: ErrorObject | string, quizId: number, questionBody: any) {
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
 * v1 version of requestAdminQuizInfo
 *
 * @param {string | ErrorObject} token - token/sessionId
 * @param {number} quizId quiz Id
 *
 * @returns {{object}} - response in javascript
 */
function v1requestAdminQuizInfo(token: ErrorObject | string, quizId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/admin/quiz/${quizId}`,
    {
      qs: {
        token: token as string,
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
 * v1 version of adminQuizNameUpdate
 *
 * @param {string | ErrorObject} token - token/sessionId
 * @param {number} quizId quiz Id
 * @param {string} name quiz name
 *
 * @returns {{object}} - response in javascript
*/
function v1requestAdminQuizNameUpdate(token: ErrorObject | string, quizId: number, name: string) {
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
 * v1 version of requestAdminQuizRemove
 *
 * @param {string | ErrorObject} token - token/sessionId
 * @param {number} quizId - quiz Id
 *
 * @returns {{object}} - response in javascript
*/
function v1requestAdminQuizRemove(token: ErrorObject | string, quizId: number) {
  const res = request(
    'DELETE',
    SERVER_URL + `/v1/admin/quiz/${quizId}`,
    {
      qs: {
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
 * v1 version of requestAdminQuizTrash
 *
 * @param {string | ErrorObject} token - token
 *
 * @returns {{object}} - response in javascript
*/
function v1requestAdminQuizTrash(token: ErrorObject | string) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/trash',
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
 * Send a 'post' request to the corresponding server route to
 * transfer a quiz from 1 user to another
 *
 * @param {string | ErrorObject} token - token
 * @param {number} quizId - quiz Id
 * @param {string | ErrorObject} token - token
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizTransferV1(token: ErrorObject | string, quizId: number, userEmail: string) {
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
 * v1 version of requestAdminQuizRestore
 *
 * @param {string | ErrorObject} token - token/sessionId
 * @param {number} quizId - Quiz Id
 *
 * @returns {{object}} - response in javascript
*/
function v1requestAdminQuizRestore(token: ErrorObject | string, quizId: number) {
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
function requestAdminQuizQuestionMoveV1(quizId: number, questionId: number, token: ErrorObject | string, newPosition: number) {
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
 * Send a 'PUT' request to the corresponding server route to duplicate
 * an existing quiz question
 *
 * @param {number} quizId - token/sessionId
 * @param {number} questionId - token/sessionId
 * @param {string | ErrorObject} token - token/sessionId
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizQuestionDuplicateV1(token: ErrorObject | string, quizId: number, questionId: number) {
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
 * Send a 'DELETE' request to the corresponding server route for user details,
 * returning the response in the form of a javascript object
 *
 * @param {string | ErrorObject} token - token
 * @param {number} quizId - quiz Id
 * @param {number} questionId - question Id
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizQuestionDeleteV1(token: ErrorObject | string, quizId: number, questionId: number) {
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
function requestAdminQuizQuestionUpdateV1(token: ErrorObject | string, quizId: number, questionId: number, questionBody: any) {
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
 * Send a 'delete' request to the corresponding server route to
 * delete quiz/quizzes from the trash
 *
 * @param {string | ErrorObject} token - token
 * @param {number[]} quizIdArr - quizIds array
 *
 * @returns {{object}} - response in javascript
*/
function requestAdminQuizTrashEmptyV1(token: ErrorObject | string, quizIds: string) {
  const res = request(
    'DELETE',
    SERVER_URL + '/v1/admin/quiz/trash/empty',
    {
      qs: {
        token,
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
    SERVER_URL + `/v1/player/${playerId}/question/${questionposition}/results`
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

function requestAdminSessionFinalResult(playerId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/player/${playerId}/results`
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
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

function requestAdminQuizSessionsView(token: string | ErrorObject, quizId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/admin/quiz/${quizId}/sessions`,
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

export {
  requestClear, requestGetAdminUserDetails, requestAdminAuthRegister, requestAdminAuthLogin, requestAdminQuizDescriptionUpdate,
  requestAdminQuizCreate, requestAdminQuizNameUpdate, requestAdminQuizRemove, requestAdminQuizTransfer, requestAdminQuizList, requestAdminQuizInfo, requestAdminQuizTrash, requestAdminQuizRestore,
  requestQuizQuestionCreate, requestAdminQuizQuestionMove, requestAdminQuizQuestionDuplicate, requestAdminQuizQuestionDelete, requestAdminQuizQuestionUpdate, requestAdminQuizTrashEmpty,
  requestAdminAuthPasswordUpdate, requestAdminAuthLogout, requestAdminAuthDetailsUpdate, requestAdminQuizSessionStart, requestAdminQuizThumbnailUpdate, requestQuizSessionPlayerJoin,
  requestQuizSessionPlayerStatus, requestPlayerAnswerSubmit, requestAdminSessionChatView, requestAdminSessionChatSend, requestPlayerQuestionInfo, requestAdminQuizSessionState, requestAdminSessioQuestionResult,
  requestAdminSessionFinalResult, requestAdminQuizSessionFinal, v1requestAdminQuizRemove, v1requestAdminQuizInfo, v1requestAdminQuizNameUpdate, v1requestAdminQuizDescriptionUpdate, v1requestAdminQuizTrash,
  v1requestAdminQuizRestore, requestAdminQuizSessionFinalCsv, requestAdminQuizSessionsView, v1requestAdminAuthDetailsUpdate, v1requestAdminAuthLogout, v1requestAdminAuthPasswordUpdate,
  v1requestAdminQuizCreate, v1requestAdminQuizList, v1requestGetAdminUserDetails, requestAdminQuizSessionStateUpdate,requestAdminQuizTrashEmptyV1,requestAdminQuizTransferV1, requestQuizQuestionCreateV1,requestAdminQuizQuestionUpdateV1,requestAdminQuizQuestionDeleteV1,requestAdminQuizQuestionDuplicateV1,requestAdminQuizQuestionMoveV1
}
