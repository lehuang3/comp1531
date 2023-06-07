/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 * @param {integer} authUserId - Admin user ID.
 * @returns {array object} - List of quizzes.
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
  * Get all of the relevant information about the current quiz.
  * @param {number} authUserId
  * @param {number} quizId
  * @returns {
  *   {
  *     quizId: number, 
  *     name: string, 
  *     timeCreated: number, 
  *     timeLastEdited: number, 
  *     description: string
  *   }
  * }
**/
 function adminQuizInfo(authUserId, quizId) {
  return {
    quizId: 1,
    name: 'My Quiz',
    timeCreated:  1683125870,
    timeLastEdited: 1683125871,
    description: 'This is my quiz',  
  }
}

/** 
  * Update the description of the relevant quiz.
  * 
  * @param {number} authUserId - User's identification number
  * @param {number} quizId - Quiz's identification number
  * @param {string} description - Quiz's description
  * ...
  * 
  * @returns {empty}
**/
function adminQuizDescriptionUpdate(authUserId, quizId, description) {
  return {

  }
}

