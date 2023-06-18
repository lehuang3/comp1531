import { getData, setData } from './dataStore.js'

/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 * 
 * @param {integer} authUserId - Admin user ID
 * 
 * @returns {array object} - List of quizzes
*/
function adminQuizList(authUserId) {
  return {
    quizzes: [
      {
        quizId: 1,
        name: 'My Quiz',
      }
    ]
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
function adminQuizCreate(authUserId, name, description) {
	return {
		quizId: 2,
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
function adminQuizRemove(authUserId, quizId) {
  return {
      
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
function adminQuizInfo(authUserId, quizId) {
  const data = getData();
  
  for (const user of data.users) {
    if (user.UserId == authUserId) {
      if (user.userQuizs.includes(quizId)) {
        for (const quiz of data.quizzes) {
          if (quiz.quizId == quizId) {
            return quiz;
          } 
        }
        return {
          error: 'Quiz does not exist.'
        }
      }
      return {
        error: 'You do not have access to this quiz.'
      }
    }
 
  }
  return {
      error: 'Not a valid user.'
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
function adminQuizNameUpdate(authUserId, quizId, name) {
	return {
  
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
function adminQuizDescriptionUpdate(authUserId, quizId, description) {
  return {

  }
}

export { adminQuizInfo, adminQuizCreate }