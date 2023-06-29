import { getData, setData } from './dataStore'

/**
 * Does not return anything, resets the state of the application
 *
 * @param {{}} - No parameters
 *
 * @returns {{}} - Empty object
*/
function clear () {
  let store = getData()
  store = {

    // User Data
    users: [],

    // Quiz Data
    quizzes: []

  }
  setData(store)
  return {

  }
}

/**
 * Given authUserId, return true or false depending on whether authUserId matches an existing
 * user
 * @param {number} - authUserId
 *
 * @returns {boolean} - true or false
*/
function isValidUser (authUserId: number): boolean {
  const data = getData()
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
  const data = getData()
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
  const data = getData()
  for (const quiz of data.quizzes) {
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
  const data = getData()

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

export { clear, isValidUser, nameQuizIsValid, quizValidCheck, nameLengthIsValid, nameTaken, isDescriptionLong, quizValidOwner }
