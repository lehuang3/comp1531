import {getData, setData} from './dataStore.js';
import {adminAuthRegister} from './auth.js';
import {clear, isValidUser, nameQuizIsValid, nameLengthIsValid, nameTaken, isDescriptionLong} from './other.js';


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

	let data = getData();

  if(isValidUser(authUserId) === false) {
		return {error: 'User id not valid'}
	} else if(nameQuizIsValid(name) === false){
		return {error: 'Quiz name is not valid'}
	} else if(nameLengthIsValid(name) === false){
		return {error: 'Quiz name length is not valid'}
	} else if(nameTaken(authUserId,name) === true){
		return {error: 'Quiz name is taken'}
	} else if(isDescriptionLong(description) === true) {
		return {error: 'Quiz description is not valid'}
	} else {
    let quizId = data.quizzes.length;

    let time = Math.floor(Date.now() / 1000);

    let newQuiz = {
      quizId: quizId,
      name: name,
      timeCreated: time,
      timeLastEdited: time,
      description: description
    };

    data.quizzes.push(newQuiz);

    for (let user of data.users) {
      if (user.authUserId === authUserId) {
        user.userQuizzes.push(quizId);
        break;
      }
    }
    
    return {quizId: quizId};
  }

  
}
/*
adminAuthRegister("Sina.hafezimasoomi@gmail.com", "Sina12356789", "Sina", "Hafezi");
adminQuizCreate(0, 'quiz1',"descruiption");
console.log(adminQuizCreate(0, 'quiz1',"descruiption"));
console.log(getData())
*/
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
    if (user.authUserId === authUserId) {
      if (user.userQuizzes.includes(quizId)) {
        for (const exisitingQuiz of data.quizzes) {
          if (exisitingQuiz.name == name && user.userQuizzes.includes(exisitingQuiz.quizId)) {
            //if (user.userQuizzes.includes(exisitingQuiz.quizId)) {
              return {
                error: 'Quiz name already exists.'
              };
            //} 
          }
        }
        for (const quiz of data.quizzes) {
          if (quiz.quizId === quizId) {
            quiz.name = name;
            return {

            };
          }
        }
        return {
          error: 'Quiz does not exist.'
        };
      }
    }
  }
  return {
    error: 'You do not have access to this quiz.'
  };
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
