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
  return {
    quizId: 1,
    name: 'My Quiz',
    timeCreated:  1683125870,
    timeLastEdited: 1683125871,
    description: 'This is my quiz',  
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
  let data = getData();
  if (name.length > 30 || name.length < 3) {
    return {
      error: 'Quiz name must be greater or equal to 2 chartacters and less than or equal to 30.'
    }
  }
  if (!/^[a-zA-Z0-9]+$/.test(name)) {
    return {
      error: 'Quiz name cannot have spaces and special characters.'
    }
  }
  for (const user of data.users) {
    if (user.userId == authUserId) {
      if (user.userQuizs.includes(quizId)) {
        for (const quiz of data.quizzes) {
          if (quiz.name == name) {
            if (user.userQuizs.includes(quiz)) {
              return {
                error: 'Quiz name already exists.'
              }
            } else {
              for (const quiz of data.quizzes) {
                if (quiz.quizId == quizId) {
                  quiz.name = name;
                  return {

                  }
                }
              }
            }
            return {
              error: 'Quiz does not exist.'
            }
          }
        }
      }
    }
  }
  return {
    error: 'You do not have access to this quiz.'
  }

  // for (const user of data.users) {
  //   if (!(user.UserId == authUserId)) {
  //     return {
  //       error: 'You do not have access to this quiz.'
  //     }
  //   } else if (user.authUserId == authUserId) {
  //     if (user.userQuizs.includes(quizId)) {
  //       for (const quiz of data.quizzes) {
  //         if (quiz.quizId == quizId && (!quiz.name.includes(name))) {
  //           quiz.name = name;
  //           return {

  //           }
  //         }
  //       }
  //     }
  //     return {
  //       error: 'Quiz does not exist.'
  //     }
  //   }
  //   return {
  //     error: 'You do not have access to this quiz.'
  //   }
  // }
	// return {
  
  // }
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

export { adminQuizNameUpdate, adminQuizCreate }