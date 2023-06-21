import { getData, setData } from './dataStore.js'
import { isValidUser, nameQuizIsValid, quizValidCheck, quizValidOwner, nameLengthIsValid, nameTaken, isDescriptionLong } from './other.js'

/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {integer} authUserId - Admin user ID
 *
 * @returns {array object} - List of quizzes
*/
function adminQuizList (authUserId) {
  if (isValidUser(authUserId) === false) {
    return { error: 'User id not valid' }
  } else {
    const data = getData()

    let userQuizs = []
    const quizzList = []

    for (const user of data.users) {
      if (user.authUserId === authUserId) {
        userQuizs = user.userQuizzes
      }
    }

    for (const quiz of data.quizzes) {
      if (userQuizs.includes(quiz.quizId)) {
        const currentUserQuiz = {
          quizId: quiz.quizId,
          name: quiz.name
        }

        quizzList.push(currentUserQuiz)
      }
    }

    return { quizzes: quizzList }
  }
}

/**
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {integer} authUserId - Admin user ID
 * @param {integer} name - Name of quiz
 * @param {string} authUserId - Description of quiz
 *
 * @returns {quizID: number} - Quiz's identification number
*/
function adminQuizCreate (authUserId, name, description) {
  const data = getData()

  if (isValidUser(authUserId) === false) {
    return { error: 'User id not valid' }
  } else if (nameQuizIsValid(name) === false) {
    return { error: 'Quiz name is not valid' }
  } else if (nameLengthIsValid(name) === false) {
    return { error: 'Quiz name length is not valid' }
  } else if (nameTaken(authUserId, name) === true) {
    return { error: 'Quiz name is taken' }
  } else if (isDescriptionLong(description) === true) {
    return { error: 'Quiz description is not valid' }
  } else {
    const quizId = data.quizzes.length

    const time = Math.floor(Date.now() / 1000)

    const newQuiz = {
      quizId,
      name,
      timeCreated: time,
      timeLastEdited: time,
      description
    }

    data.quizzes.push(newQuiz)

    for (const user of data.users) {
      if (user.authUserId === authUserId) {
        user.userQuizzes.push(quizId)
      }
    }

    return { quizId }
  }
}

/**
 * Given user ID and Quiz ID it deletes it.
 *
 * @param {integer} authUserId - Admin user ID
 * @param {integer} quizId - Quiz's identification number
 *
 * @returns {{}} - Empty object
*/
function adminQuizRemove (authUserId, quizId) {
  if (isValidUser(authUserId) === false) {
    return { error: 'User id not valid' }
  } else if (quizValidCheck(quizId) === false) {
    return { error: 'quiz id not valid' }
  } else if (quizValidOwner(authUserId, quizId) === false) {
    return { error: 'Not owner of quiz' }
  } else {
    const data = getData()

    for (let index = 0; index < data.quizzes.length; index++) {
      if (data.quizzes[index].quizId === quizId) {
        data.quizzes.splice(index, 1)
      }
    }

    for (const user of data.users) {
      if (user.authUserId === authUserId) {
        user.userQuizzes.splice(user.userQuizzes.indexOf(quizId), 1)
      }
    }

    return {}
  }
}

/**
  * Get all of the relevant information about the current quiz.
  *
  * @param {number} authUserId - Admin user ID
  * @param {number} quizId - Quiz's identification number
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
function adminQuizInfo (authUserId, quizId) {
  const data = getData()
  if (!quizValidCheck(quizId)) {
    return {
      error: 'Quiz does not exist.'
    }
  } else if (!isValidUser(authUserId)) {
    return {
      error: 'Not a valid user.'
    }
  } else if (!quizValidOwner(authUserId, quizId)) {
    return {
      error: 'You do not have access to this quiz.'
    }
  }
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId) {
      return quiz
    }
  }
}

/**
  * Update name of relevant quiz.
  *
  * @param {number} authUserId - Admin user ID
  * @param {number} quizId - Quiz's identification number
  * @param {string} name - Name of quiz
  *
  * @returns {{}} - Empty object.
*/
function adminQuizNameUpdate (authUserId, quizId, name) {
  const data = getData()
  if (!nameLengthIsValid(name)) {
    return {
      error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.'
    }
  } else if (!nameQuizIsValid(name)) {
    return {
      error: 'Quiz name cannot have special characters.'
    }
  } else if (nameTaken(authUserId, name)) {
    return {
      error: 'Quiz name already exists.'
    }
  } else if (!quizValidCheck(quizId)) {
    return {
      error: 'Quiz does not exist.'
    }
  } else if (!quizValidOwner(authUserId, quizId)) {
    return {
      error: 'You do not have access to this quiz.'
    }
  }
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId) {
      quiz.name = name;
      setData(data);
      return {

      }
    }
  }
}

/**
  * Update the description of the relevant quiz.
  *
  * @param {number} authUserId - Admin user ID
  * @param {number} quizId - Quiz's identification number
  * @param {string} description - Quiz's description
  *
  * @returns {{}} - Empty object.
*/
function adminQuizDescriptionUpdate (authUserId, quizId, description) {
  const data = getData()

  // check authUserId
  if (!isValidUser(authUserId)) {
    return {
      error: 'Not a valid user'
    }
  }

  // check quizId
  if (!quizValidCheck(quizId)) {
    return {
      error: 'Not a valid quiz'
    }
  }

  // check ownership of quiz
  if (!quizValidOwner(authUserId, quizId)) {
    return {
      error: 'This quiz is owned by another user'
    }
  }

  // check description's length
  if (isDescriptionLong(description)) {
    return {
      error: 'Description is too long'
    }
  }

  // change description
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId) {
      quiz.description = description
    }
  }

  setData(data)

  return {

  }
}

export { adminQuizInfo, adminQuizCreate, adminQuizNameUpdate, adminQuizDescriptionUpdate, adminQuizList, adminQuizRemove }
