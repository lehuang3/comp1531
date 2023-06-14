import {getData, setData} from './dataStore.js';
import {clear, isValidUser} from './other.js';

/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 * 
 * @param {integer} authUserId - Admin user ID
 * 
 * @returns {array object} - List of quizzes
*/
function adminQuizList(authUserId) {
  if(isValidUser(authUserId) === false) {

    return {error: 'User id not valid'};

  } else {

    let data = getData();

    let userQuizs = [];
    let quizzList = [];

    for(let user of data.users) {
      if(user.UserId === authUserId){
        userQuizs = user.userQuizs;
      }
    }

    for(let quiz of data.quizzes) {

      if(userQuizs.includes(quiz.quizId)){

        let currentUserQuiz = {
            quizId: quiz.quizId,
            name: quiz.name,
        };

        quizzList.push(currentUserQuiz);

      }

    }

    return {quizzes: quizzList};

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
export function adminQuizCreate(authUserId, name, description) {

	let data = getData();

  if(isValidUser(authUserId) === false) {
		return {error: 'User id not valid'}
	} else if(nameQuizIsValid === false){
		return {error: 'Quiz name is not valid'}
	} else if(nameLengthIsValid === false){
		return {error: 'Quiz name length is not valid'}
	} else if(nameTaken === true){
		return {error: 'Quiz name is taken'}
	} else if(quizDescriptionIsValid === false) {
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
    
    return {quizId: quizId};
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