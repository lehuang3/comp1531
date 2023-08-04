import { ErrorObject, Quiz } from './interfaces';
import {
  save, read, nameQuizIsValid, quizValidCheck, quizValidOwner, nameLengthIsValid, nameTaken, isDescriptionLong,
  tokenOwner, questionLengthValid, answerCountValid, newPositioNotSame, newPositionValidCheck, questionValidCheck, durationValid, QuizDurationValid, quizPointsValid,
  quizAnswerValid, quizAnswerDuplicateValid, quizAnswerCorrectValid, isQuizInTrash, getColour, isSameQuizName, saveImg
} from './other';
import { Data, Answer } from './interfaces';
import HTTPError from 'http-errors';
const isUrl = require('is-url');
const isImageUrl = require('is-image-url');
import fs, { existsSync } from 'fs';
import request from 'sync-request';
import config from './config.json';

const PORT: number = parseInt(process.env.PORT || config.port);

/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {string} token - Token
 * @param {number} version
 *
 * @returns {array object} - List of quizze
*/
function adminQuizList (token: ErrorObject | string, version: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }

  let userQuizs: any[] = [];
  const quizzList = [];

  for (const user of data.users) {
    if (user.authUserId === authUserId) {
      userQuizs = user.userQuizzes;
    }
  }

  for (const quiz of data.quizzes) {
    if (userQuizs.includes(quiz.quizId)) {
      const currentUserQuiz = {
        quizId: quiz.quizId,
        name: quiz.name
      };
      quizzList.push(currentUserQuiz);
    }
  }

  return { quizzes: quizzList };
}

/**
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {string} token - Token
 * @param {integer} name - Name of quiz
 * @param {string} description - Description of quiz
 * @param {number} version
 *
 * @returns {quizID: number} - Quiz's identification number
*/
function adminQuizCreate (token: ErrorObject | string, name: string, description: string, version: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }

  if (nameQuizIsValid(name) === false) {
    if (version === 1) {
      return {
        error: 'Quiz name is not valid',
      };
    } else {
      throw HTTPError(400, 'Quiz name is not valid');
    }
  } else if (nameLengthIsValid(name) === false) {
    if (version === 1) {
      return {
        error: 'Quiz name length is not valid',
      };
    } else {
      throw HTTPError(400, 'Quiz name length is not valid');
    }
  } else if (nameTaken(authUserId, name) === true) {
    if (version === 1) {
      return {
        error: 'uiz name is taken',
      };
    } else {
      throw HTTPError(400, 'uiz name is taken');
    }
  } else if (isDescriptionLong(description) === true) {
    if (version === 1) {
      return {
        error: 'Quiz description is not valid',
      };
    } else {
      throw HTTPError(400, 'Quiz description is not valid');
    }
  } else {
    const quizLength = data.quizzes.length;
    let quizId = 0;
    // max needs to be -1 because if the 1st quiz created is in trash
    // then max can take the value of 0. If max is assigned with 0
    // by default, then line 98 will always be executed, which we don't
    // want in the case where the quiz being created is the 1st ever.
    let max = -1;
    // check in trash for existing quizIds
    for (const index of data.trash) {
      if (index.quizId > max) {
        max = index.quizId;
      }
    }
    if (quizLength === 0) {
      quizId = 0;
      for (const index of data.trash) {
        if (index.quizId > max) {
          max = index.quizId;
        }
      }
      // if there are quizzes in trash
      if (max >= 0) {
        quizId = max + 1;
      }
    } else {
      for (const index of data.quizzes) {
        if (index.quizId > max) {
          max = index.quizId;
        }
      }
      quizId = max + 1;
    }

    const time = Math.floor(Date.now() / 1000);

    const newQuiz: Quiz = {
      quizId: quizId,
      name: name,
      timeCreated: time,
      timeLastEdited: time,
      description: description,
      numQuestions: 0,
      questions: [],
      duration: 0,
      thumbnailUrl: ''
    };

    data.quizzes.push(newQuiz);

    for (const user of data.users) {
      if (user.authUserId === authUserId) {
        user.userQuizzes.push(quizId);
      }
    }
    save(data);
    return { quizId: quizId };
  }
}

/**
 * Given user ID and Quiz ID it deletes it.
 *
 * @param {integer} token - Token
 * @param {integer} quizId - Quiz's identification number
 * @param {number} version
 *
 * @returns {{}} - Empty object
*/
function adminQuizRemove (token: ErrorObject | string, quizId: number, version: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }

  if (isQuizInTrash(quizId)) {
    if (version === 1) {
      return {
        error: 'Quiz is in trash.',
      };
    } else {
      throw HTTPError(400, 'Quiz is in trash.');
    }
  } else if (quizValidCheck(quizId) === false) {
    if (version === 1) {
      return {
        error: 'quiz id not valid',
      };
    } else {
      throw HTTPError(400, 'quiz id not valid');
    }
  } else if (quizValidOwner(authUserId, quizId) === false) {
    if (version === 1) {
      return {
        error: 'Not owner of quiz',
      };
    } else {
      throw HTTPError(400, 'Not owner of quiz');
    }
  } else {
    const quizIndex = data.quizzes.findIndex((quiz) => quiz.quizId === quizId);
    const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

    const removedQuiz = data.quizzes.splice(quizIndex, 1)[0];
    data.trash.push(removedQuiz);
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);

    save(data);
    return {};
  }
}

/**
  * Get all of the relevant information about the current quiz.
  *
  * @param {string} token - Token
  * @param {number} quizId - Quiz's identification number
  * @param {number} version
  *
  * @returns {
  *   {
  *     quizId: number,
  *     name: string,
  *     timeCreated: number,
  *     timeLastEdited: number,
  *     description: string
  *   }
  * }
*/
function adminQuizInfo (token: ErrorObject | string, quizId: number, version: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }

  if (!quizValidCheck(quizId)) {
    if (version === 1) {
      return {
        error: 'Quiz does not exist',
      };
    } else {
      throw HTTPError(400, 'Quiz does not exist');
    }
  } else if (!quizValidOwner(authUserId, quizId)) {
    if (version === 1) {
      return {
        error: 'You do not have access to this quiz.',
      };
    } else {
      throw HTTPError(400, 'You do not have access to this quiz.');
    }
  }
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId) {
      return quiz;
    }
  }
  // // added cause it will cause error in frontend, but may be causing issues.
  // for (const quiz of data.trash) {
  //   if (quiz.quizId === quizId) {
  //     return quiz;
  //   }
  // }
}

/**
  * Update name of relevant quiz.
  *
  * @param {string} token - Token
  * @param {number} quizId - Quiz's identification number
  * @param {string} name - Name of quiz
  * @param {number} version
  *
  * @returns {{}} - Empty object.
*/
function adminQuizNameUpdate (token: ErrorObject | string, quizId: number, name: string, version: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }

  if (!nameLengthIsValid(name)) {
    if (version === 1) {
      return {
        error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.'
      };
    } else {
      throw HTTPError(400, 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.');
    }
  } else if (!nameQuizIsValid(name)) {
    if (version === 1) {
      return {
        error: 'Quiz name cannot have special characters.',
      };
    } else {
      throw HTTPError(400, 'Quiz name cannot have special characters.');
    }
  } else if (nameTaken(authUserId, name)) {
    if (version === 1) {
      return {
        error: 'Quiz name already exists.',
      };
    } else {
      throw HTTPError(400, 'Quiz name already exists.');
    }
  } else if (!quizValidCheck(quizId)) {
    if (version === 1) {
      return {
        error: 'Quiz does not exist.',
      };
    } else {
      throw HTTPError(400, 'Quiz does not exist.');
    }
  } else if (isQuizInTrash(quizId)) {
    if (version === 1) {
      return {
        error: 'Quiz is in trash.',
      };
    } else {
      throw HTTPError(400, 'Quiz is in trash.');
    }
  } else if (!quizValidOwner(authUserId, quizId)) {
    if (version === 1) {
      return {
        error: 'You do not have access to this quiz.',
      };
    } else {
      throw HTTPError(400, 'You do not have access to this quiz.');
    }
  }
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId) {
      quiz.name = name;
      save(data);
      return {

      };
    }
  }
}

/**
  * Update the description of the relevant quiz.
  *
  * @param {string} token - Token
  * @param {number} quizId - Quiz's identification number
  * @param {string} description - Quiz's description
  * @param {number} version
  *
  * @returns {{}} - Empty object.
*/
function adminQuizDescriptionUpdate (token: ErrorObject | string, quizId: number, description: string, version: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }
  // check quizId
  if (!quizValidCheck(quizId)) {
    if (version === 1) {
      return {
        error: 'Not a valid quiz',
      };
    } else {
      throw HTTPError(400, 'Not a valid quiz');
    }
  }
  if (isQuizInTrash(quizId)) {
    if (version === 1) {
      return {
        error: 'Quiz is in trash.',
      };
    } else {
      throw HTTPError(400, 'Quiz is in trash.');
    }
  }
  // check ownership of quiz
  if (!quizValidOwner(authUserId, quizId)) {
    if (version === 1) {
      return {
        error: 'This quiz is owned by another user',
      };
    } else {
      throw HTTPError(400, 'This quiz is owned by another user');
    }
  }
  // check description's length
  if (isDescriptionLong(description)) {
    if (version === 1) {
      return {
        error: 'Description is too long',
      };
    } else {
      throw HTTPError(400, 'Description is too long');
    }
  }
  // change description
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId) {
      quiz.description = description;
      // change timeLastEdited to current time
      quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    }
  }
  save(data);
  return {

  };
}

/**
 * Given a token find and view all quizzes in trash which the tokon/user owns
 *
 * @param {string | ErrorObject} token token object which contains authUserId and sessionId
 * @param {number} version
 *
 * @returns {{}} empty object on success and error msg on fail
 */
function adminQuizTrash(token: string | ErrorObject, version: number) {
  const quizzes: { quizId: number; name: string; }[] = [];
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }
  // filter from data.trash an array of quizzes in trash that only the user has access to
  const userTrash = data.trash.filter(quiz => {
    return data.users.find(user => user.authUserId === authUserId).userQuizzes.includes(quiz.quizId);
  });

  userTrash.map(quiz => {
    quizzes.push({
      quizId: quiz.quizId,
      name: quiz.name,
    });
    return {};
  });
  return {
    quizzes,
  };
}

/**
 * Given a token and quizId, find the quiz in trash and restore it
 *
 * @param {string | ErrorObject} token token object which contains authUserId and sessionId
 * @param {number} quizId quiz Id
 * @param {number} version
 *
 * @returns {{}} empty object on sucess and error msg on fail
 */
function adminQuizRestore(token: ErrorObject | string, quizId: number, version: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }

  if (!quizValidCheck(quizId)) {
    if (version === 1) {
      return {
        error: 'Not a valid quiz',
      };
    } else {
      throw HTTPError(400, 'Not a valid quiz');
    }
  } else if (!isQuizInTrash(quizId)) {
    if (version === 1) {
      return {
        error: 'Quiz not in trash.',
      };
    } else {
      throw HTTPError(400, 'Quiz not in trash.');
    }
  } else if (!quizValidOwner(authUserId, quizId)) {
    if (version === 1) {
      return {
        error: 'You do not have access to this quiz.',
      };
    } else {
      throw HTTPError(400, 'You do not have access to this quiz.');
    }
  }

  data.quizzes.push(data.trash.find((quiz) => quiz.quizId === quizId));
  const newTrash: Quiz[] = data.trash.filter(quiz => quiz.quizId !== quizId);
  data.trash = newTrash;
  save(data);
  return {

  };
}

/**
 * Given basic details about a new quiz question, creates a question in the question for the logged in user.
 *
 * @param {string} token - Token
 * @param {integer} quizId - Quiz Id
 * @param {object} QuestionQuestion - Description of quiz question
 *
 * @returns {questionID: number} - Quiz Question Id
*/
function adminQuizQuestionCreate (token: ErrorObject | string, quizId:number, questionBody: any, version:number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }

  if (quizValidCheck(quizId) === false) {
    if (version === 1) {
      return {
        error: 'Not a valid quiz',
      };
    } else {
    throw HTTPError(400, 'quiz id not valid');
    }
  } else if (quizValidOwner(authUserId, quizId) === false) {
    if (version === 1) {
      return {
        error: 'not owner of quiz',
      };
    } else {
    throw HTTPError(400, 'not owner of quiz');
    }
  } else if (questionLengthValid(questionBody) === false) {
    if (version === 1) {
      return {
        error: 'Question length is not validz',
      };
    } else {
    throw HTTPError(400, 'Question length is not valid');
    }
  } else if (answerCountValid(questionBody) === false) {
    if (version === 1) {
      return {
        error: 'There must 2 asnwer and no greater than 6',
      };
    } else {
    throw HTTPError(400, 'There must 2 asnwer and no greater than 6');
    }
  } else if (durationValid(questionBody) === false) {
    if (version === 1) {
      return {
        error: 'There must 2 asnwer and no greater than 6',
      };
    } else {
    throw HTTPError(400, 'Duration must be a positive number');
    }
  } else if (QuizDurationValid(data, questionBody, quizId) === false) {
    if (version === 1) {
      return {
        error: 'Duration excesseds 3 minutes',
      };
    } else {
    throw HTTPError(400, 'Duration excesseds 3 minutes');
  }
  } else if (quizPointsValid(questionBody) === false) {
    if (version === 1) {
      return {
        error: 'Points must not be less than 1 or greater than 10',
      };
    } else {
    throw HTTPError(400, 'Points must not be less than 1 or greater than 10');
  }
  } else if (quizAnswerValid(questionBody) === false) {
    if (version === 1) {
      return {
        error: '1 or more of your asnwer is less than 1 or greater 30 characters',
      };
    } else {
    throw HTTPError(400, '1 or more of your asnwer is less than 1 or greater 30 characters');
  }
  } else if (quizAnswerDuplicateValid(questionBody) === false) {
    if (version === 1) {
      return {
        error: 'There are duplicate answers',
      };
    } else {
    throw HTTPError(400, 'There are duplicate answers');
    }
  }
   else if (quizAnswerCorrectValid(questionBody) === false) {
    if (version === 1) {
      return {
        error: 'There are no correct asnwers',
      };
    } else {
    throw HTTPError(400, 'There are no correct asnwers');
    }
  } else if (isImageUrl(questionBody.thumbnailUrl) === false) {
    if (version === 1) {
      return {
        error: 'Image not valid',
      };
    } else {
    throw HTTPError(400, 'Image not valid');
    }

  } else {
    const fileName = saveImg(questionBody.thumbnailUrl);
    const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

    let newQuestionId = 0;
    const quizQuestionLength = quiz.questions.length;

    if (quizQuestionLength === 0) {
      newQuestionId = 0;
    } else {
      let max = 0;
      for (const index of quiz.questions) {
        if (index.questionId > max) {
          max = index.questionId;
        }
      }
      newQuestionId = max + 1;
    }

    const newQuestion = {
      questionId: newQuestionId,
      question: questionBody.question,
      duration: questionBody.duration,
      points: questionBody.points,
      answers: questionBody.answers.map((answer: Answer, length: number) => ({
        answerId: length,
        answer: answer.answer,
        correct: answer.correct,
        colour: getColour()
      })),
      thumbnailUrl: `http://localhost:${PORT}/${fileName}`
    };

    quiz.questions.push(newQuestion);
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    quiz.numQuestions++;
    quiz.duration += questionBody.duration;
    save(data);
    return { questionId: newQuestionId };
  }
}

/**
 * Given basic details about a quiz Question, it moves the order within the quiz.
 *
 * @param {integer} quizId - QuizId
 * @param {integer} questionId - Quiz Question Id
 * @param {string} token - Token
 * @param {integer} newPosition - new position of question
 *
 * @returns {quizID: number} - Quiz's identification number
*/
function adminQuizQuestionMove (quizId:number, questionId:number, token: ErrorObject | string, newPosition:number,version:number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }
  if (quizValidCheck(quizId) === false) {
    if (version === 1) {
      return {
        error: 'quiz id not valid'
      };
    } else {
    throw HTTPError(400, 'quiz id not valid');
    }
  } else if (isQuizInTrash(quizId)) {
    if (version === 1) {
      return {
        error: 'Quiz is in trash.',
      };
    } else {
    throw HTTPError(400, 'Quiz is in trash.');
  }
  } else if (quizValidOwner(authUserId, quizId) === false) {
    if (version === 1) {
        return {
          error: 'Not owner of quiz',
        };
      } else {
    throw HTTPError(400, 'Not owner of quiz');
  }
  } else if (questionValidCheck(data, quizId, questionId) === false) {
    if (version === 1) {
      return {
        error: 'Question not found',
      };
    } else {
    throw HTTPError(400, 'Question not found');
  }
  } else if (newPositionValidCheck(data, quizId, newPosition) === false) {
    if (version === 1) {
      return {
        error: 'Invalid new position',
      };
    } else {
    throw HTTPError(400, 'Invalid new position');
  }
  } else if (newPositioNotSame(data, quizId, questionId, newPosition) === false) {
    if (version === 1) {
      return {
        error: 'New Position cannot be the same as original',
      };
    } else {
    throw HTTPError(400, 'New Position cannot be the same as original');
  }
  } else {
    const quiz = data.quizzes.find((quiz: { quizId: number; }) => quiz.quizId === quizId);
    const originalPosition = quiz.questions.findIndex((question: { questionId: number; }) => question.questionId === questionId);
    const questionToMove = quiz.questions[originalPosition];

    quiz.questions.splice(originalPosition, 1);
    quiz.questions.splice(newPosition, 0, questionToMove);
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);

    save(data);
    return {};
  }
}

/**
 * Given token, quizId of a quiz and email of a target user,
 * transfer the quiz from the user represented by the token
 * to the targer user
 *
 * @param {string | ErrorObject} token - token that represents original owner of the quiz
 * @param {number} quizId - quizId of the quiz
 * @param {string} userEmail - Target user's email
 *
 * @returns {} - empty object
*/
function adminQuizTransfer(token: string | ErrorObject, quizId: number, userEmail: string,version:number) {
  const data: Data = read();
  const users = [...data.users];
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }

  if (!quizValidCheck(quizId)) {
    if(version === 1){
      return {
        error: 'Quiz does not exist.',
      };
    } else {
    throw HTTPError(400, 'Quiz does not exist.');
    }
  } else if (isQuizInTrash(quizId)) {
    if(version === 1){
      return {
        error: 'Quiz is in trash.',
      };
    } else {
    throw HTTPError(400, 'Quiz is in trash.');
    }
  } else if (!quizValidOwner(authUserId, quizId)) {
    if(version === 1){
      return {
        error: 'You do not have access to this quiz.',
      };
    } else {
    throw HTTPError(400, 'You do not have access to this quiz.');
    }
  } else if (users.filter(user => user.email === userEmail).length === 0) {
    if(version === 1){
      return {
        error: 'Target user does not exist',
      };
    } else {
    throw HTTPError(400, 'Target user does not exist');
    }
  } else if (users.filter(user => user.email === userEmail)[0].authUserId === authUserId) {
    if(version === 1){
      return {
        error: 'Target user does not exist',
      };
    } else {
    throw HTTPError(400, 'Target user is also original user');
    }
  } else if (isSameQuizName(userEmail, quizId)) {
    if(version === 1){
      return {
        error: 'Target user does not exist',
      };
    } else {
    throw HTTPError(400, "Quiz to be transfered has the same name as one of target user's quizzes");
    }
  }
  // Quiz is not removed from quizzes array, but is rather removed from userQuizzes of the
  // original user, and added to userQuizzes of target user.
  data.users.map(user => {
    if (user.authUserId === authUserId) {
      user.userQuizzes = user.userQuizzes.filter(userQuizId => userQuizId !== quizId);
    }
    if (user.email === userEmail) {
      user.userQuizzes.push(quizId);
    }
    return {};
  });
  save(data);
  return {

  };
}

/**
 * Given basic details about a question in a quiz,it duplicates it for the logged in user.
 *
 * @param {integer} quizId - Quid Id
 * @param {integer} questionId - QuestionId
 * @param {string} token - Token
 *
 * @returns {questionID: number} - Quiz question identification number
*/
function adminQuizQuestionDuplicate (quizId:number, questionId:number, token: ErrorObject | string,version:number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }

  if (quizValidCheck(quizId) === false) {
    if (version === 1) {
      return {
        error: 'Quiz does not exits',
      };
    } else {
    throw HTTPError(400, 'Quiz does not exits');
    }
  } else if (isQuizInTrash(quizId)) {
    if (version === 1) {
      return {
        error: 'Quiz is in trash.',
      };
    } else {
    throw HTTPError(400, 'Quiz is in trash.');
    }
  } else if (quizValidOwner(authUserId, quizId) === false) {
    if (version === 1) {
      return {
        error: 'Quiz Id is not valid',
      };
    } else {
    throw HTTPError(400, 'Quiz Id is not valid');
    }
  } else if (questionValidCheck(data, quizId, questionId) === false) {
    if (version === 1) {
      return {
        error: 'Question not found',
      };
    } else {
    throw HTTPError(400, 'Question not found');
    }
  } else {
    const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
    const question = quiz.questions.find(question => question.questionId === questionId);
    let newQuestionId = 0;
    const quizQuestionLength = quiz.questions.length;

    if (quizQuestionLength === 0) {
      newQuestionId = 0;
    } else {
      let max = 0;
      for (const index of quiz.questions) {
        if (index.questionId > max) {
          max = index.questionId;
        }
      }
      newQuestionId = max + 1;
    }

    const newQuestion = {
      questionId: newQuestionId,
      question: question.question,
      duration: question.duration,
      points: question.points,
      answers: question.answers,
      thumbnailUrl: question.thumbnailUrl
    };

    quiz.questions.push(newQuestion);
    quiz.duration += question.duration;
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    quiz.numQuestions++;
    // console.log(data.quizzes[0]);
    save(data);
    return { newQuestionId: newQuestionId };
  }
}

/**
 * Given a token, quizId and questionId delete the question inside the quiz
 *
 * @param {string | ErrorObject} token token which contains authUserId and sessionId
 * @param {number} quizId quiz Id
 * @param {number} questionId question Id
 *
 * @returns {{}} empty object on sucess error msg on fail
 */
function adminQuizQuestionDelete(token: ErrorObject | string, quizId: number, questionId: number,version:number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }

  if (!quizValidCheck(quizId)) {
    if (version === 1) {
      return {
        error: 'Quiz does not exist.',
      };
    } else {
    throw HTTPError(400, 'Quiz does not exist.');
  }
  } else if (isQuizInTrash(quizId)) {
    if (version === 1) {
      return {
        error: 'Quiz is in trash.',
      };
    } else {
    throw HTTPError(400, 'Quiz is in trash.');
  }
  } else if (!quizValidOwner(authUserId, quizId)) {
    if (version === 1) {
      return {
        error: 'You do not have access to this quiz',
      };
    } else {
    throw HTTPError(400, 'You do not have access to this quiz.');
  }
  } else if (!questionValidCheck(data, quizId, questionId)) {
    if (version === 1) {
      return {
        error: 'Question does not exist.',
      };
    } else {
    throw HTTPError(400, 'Question does not exist.');
  }
  }
  // find the quiz in data.quizzes by matching quizId to data.quizzes.quizId, find the quiz question in data.quizzes.quiz.question, splice out the question.
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  // found the quiz which contains the question
  let index = 0;
  for (const question of quiz.questions) {
    if (question.questionId === questionId) {
      quiz.questions.splice(index, 1);
      quiz.numQuestions--;
      save(data);
      return {
      };
    }
    index++;
  }
}
/**
 * Given a token, quizId, questionId and quizQuestions, update the quiz and its corresponding question to that of the new
 * quizQuestion
 *
 * @param {string | ErrorObject} token token which contains authUserId and sessionId
 * @param {number} quizId quiz Id
 * @param {number} questionId question Id
 * @param {QuizQuestion} quizQuestion the new question object
 *
 * @returns {{}} return empty object on sucess and error msg on fail
 */
function adminQuizQuestionUpdate(token: ErrorObject | string, quizId: number, questionId: number, questionBody: any,version:number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }
  if (!quizValidCheck(quizId)) {
    if (version === 1) {
      return {
        error: 'Quiz does not exist.',
      };
    } else {
    throw HTTPError(400, 'Quiz does not exist.');
    }
  } else if (!quizValidOwner(authUserId, quizId)) {
    if (version === 1) {
      return {
        error: 'You do not have access to this quiz.',
      };
    } else {
    throw HTTPError(400, 'You do not have access to this quiz.');
    }
  } else if (!questionValidCheck(data, quizId, questionId)) {
    if (version === 1) {
      return {
        error: 'This question does not exist.',
      };
    } else {
    throw HTTPError(400, 'This question does not exist.');
    }
  } else if (!questionLengthValid(questionBody)) {
    if (version === 1) {
      return {
        error: 'Question must be greater than 4 characters and less than 51 characters.',
      };
    } else {
    throw HTTPError(400, 'Question must be greater than 4 characters and less than 51 characters.');
    }
  } else if (!answerCountValid(questionBody)) {
    if (version === 1) {
      return {
        error: 'Must have more than one answer and less than 7 answers.',
      };
    } else {
    throw HTTPError(400, 'Must have more than one answer and less than 7 answers.');
    }
  } else if (!durationValid(questionBody)) {
    if (version === 1) {
      return {
        error: 'Time allowed must be a postive number.',
      };
    } else {
    throw HTTPError(400, 'Time allowed must be a postive number.');
    }
  } else if (!QuizDurationValid(data, questionBody, quizId)) {
    if (version === 1) {
      return {
        error: 'Quiz duration longer than 3 minutes.',
      };
    } else {
    throw HTTPError(400, 'Quiz duration longer than 3 minutes.');
    }
  } else if (!quizPointsValid(questionBody)) {
    if (version === 1) {
      return {
        error: 'Question must award at least one point and no more than 10 points.',
      };
    } else {
    throw HTTPError(400, 'Question must award at least one point and no more than 10 points.');
    }
  } else if (!quizAnswerValid(questionBody)) {
    if (version === 1) {
      return {
        error: 'Answer must be greater than 0 characters and less than 31 characters long.',
      };
    } else {
    throw HTTPError(400, 'Answer must be greater than 0 characters and less than 31 characters long.');
    }
  } else if (!quizAnswerDuplicateValid(questionBody)) {
    if (version === 1) {
      return {
        error: 'Cannot have same answers for one question.',
      };
    } else {
    throw HTTPError(400, 'Cannot have same answers for one question.');
    }
  } else if (!quizAnswerCorrectValid(questionBody)) {
    if (version === 1) {
      return {
        error: 'There are no correct answers.',
      };
    } else {
    throw HTTPError(400, 'There are no correct answers.');
    }
  } else if (questionBody.thumbnailUrl.length === 0) {
    if (version === 1) {
      return {
        error: 'Missing thumbnail URL.',
      };
    } else {
    throw HTTPError(400, 'Missing thumbnail URL.');
    }
  } else if (!isUrl(questionBody.thumbnailUrl)) {
    if (version === 1) {
      return {
        error: 'Not a valid url.',
      };
    } else {
    throw HTTPError(400, 'Not a valid url.');
    }
  } else if (!isImageUrl(questionBody.thumbnailUrl)) {
    if (version === 1) {
      return {
        error: 'Url is not an image.',
      };
    } else {
    throw HTTPError(400, 'Url is not an image.');
    }
  }
  const fileName = saveImg(questionBody.thumbnailUrl);
  // find the quiz in data.quizzes by matching quizId to data.quizzes.quizId, find the quiz question in data.quizzes.quiz.question, splice out the question.
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  // found the quiz which contains the question
  for (const question of quiz.questions) {
    if (question.questionId === questionId) {
      question.question = questionBody.question;
      question.duration = questionBody.duration;
      question.points = questionBody.points;
      question.answers = questionBody.answers.map((answer: any, index: number) => ({
        answerId: index,
        answer: answer.answer,
        correct: answer.correct,
        colour: getColour()
      }));
      question.thumbnailUrl = `http://localhost:${PORT}/${fileName}`;
      const updatedQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
      updatedQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
      save(data);
      return {

      };
    }
  }
}

/**
 * Given token, array of quizIds,
 * removes the corresponding quizzes in the trash
 *
 * @param {string | ErrorObject} token - token that represents original owner of the quiz
 * @param {number[]} quizIdArr - array of quizIds of quizIds
 *
 * @returns {} - empty object
*/
function adminQuizTrashEmpty(token: string | ErrorObject, quizIdArr: number[],version:number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }
  // if no quizzes are chosen to be removed, return with 200 status code with
  // no modifications of trash
  if (quizIdArr.length === 0) {
    return {};
  }

  for (const quizId of quizIdArr) {
    if (!quizValidCheck(quizId)) {
      if(version === 1){
        return {
          error: 'One or more of the quizzes is not a valid quiz',
        };
      } else{
        throw HTTPError(400, 'One or more of the quizzes is not a valid quiz');
      } 
    }
    if (!quizValidOwner(authUserId, quizId)) {
      if(version === 1){
        return {
          error: 'One or more of the quizzes refers to a quiz that this current user does not own',
        };
      } else{
      throw HTTPError(400, 'One or more of the quizzes refers to a quiz that this current user does not own');
      }
    }
    if (!isQuizInTrash(quizId)) {
      if(version === 1){
        return {
          error: 'One or more of the quizzes is not currently in the trash',
        };
      } else{
      throw HTTPError(400, 'One or more of the quizzes is not currently in the trash');
      }
    }
  }

  quizIdArr.map((quizIdToRemove) => {
    // user.userQuizzes = user.userQuizzes.filter(userQuizId => userQuizId !== quizId)
    data.trash = data.trash.filter(quiz => quiz.quizId !== quizIdToRemove);
    data.quizzes = data.quizzes.filter(quiz => quiz.quizId !== quizIdToRemove);
    for (const user of data.users) {
      if (user.userQuizzes.includes(quizIdToRemove)) {
        user.userQuizzes = user.userQuizzes.filter(quizId => quizId !== quizIdToRemove);
      }
    }
    save(data);
    return {};
  });
  return {};
}

function adminQuizThumbnailUpdate(token: string| ErrorObject, quizId: number, imgUrl: string) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      throw HTTPError(401, 'Invalid token structure');
    } else {
      throw HTTPError(403, 'Not a valid session');
    }
  }
  if (!quizValidCheck(quizId)) {
    throw HTTPError(400, 'Quiz does not exist.');
  } else if (!quizValidOwner(authUserId, quizId)) {
    throw HTTPError(400, 'You do not have access to this quiz.');
  } else if (!isUrl(imgUrl)) {
    throw HTTPError(400, 'Not a valid url.');
  } else if (!isImageUrl(imgUrl)) {
    throw HTTPError(400, 'Url is not an image.');
  }
  // save to static folder the url as an image
  const fileName = saveImg(imgUrl);
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  // console.log(quiz);

  quiz.thumbnailUrl = `http://localhost:${PORT}/${fileName}`;
  // console.log(quiz.thumbnailUrl)
  // console.log(quiz);
  save(data);
  return {

  };
}

export {
  adminQuizInfo, adminQuizCreate, adminQuizNameUpdate, adminQuizDescriptionUpdate, adminQuizList, adminQuizRemove, adminQuizTrash, adminQuizTransfer, adminQuizRestore,
  adminQuizQuestionCreate, adminQuizQuestionMove, adminQuizQuestionDuplicate, adminQuizQuestionDelete, adminQuizQuestionUpdate, adminQuizTrashEmpty, adminQuizThumbnailUpdate
};
