
/**
  * Update name of relevant quiz.
  * @param {number} authUserId 
  * @param {number} quizId 
  * @param {string} name 
  * @returns {{}}
**/
function adminQuizNameUpdate(authUserId, quizId, name) {
	return {
  
	}
}
  
/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 * @param {integer} authUserId - Admin user ID.
 * @returns {array object} - List of quizzes.
**/
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

