import { getData, setData} from './dataStore.js';

/**
 * Does not return anything, resets the state of the application
 * 
 * @param {{}} - No parameters
 * 
 * @returns {{}} - Empty object
*/
function clear() {
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
function isValidUser(authUserId) {
	const data = getData();
	for (const user of data.users) {
		if (user.authUserId === authUserId) {
			return true;
		}
	}
	return false;
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
function quizValidOwner(authUserId, quizId) {
	const data = getData();
	for (const user of data.users) {
		if (user.UsersId === authUserId && user.userQuizs.includes(quizId)) {
			return true;
		}
	}
	return false;
}

/**
 * Given a quizId check if it exists within the datastore, returning true if it exists
 * and false if it does not
 * 
 * @param {number} quizId 
 * 
 * @returns {boolean} - true or false 
 */

function quizValidCheck(quizId) {
	const data = getData();
	for (const quiz of data.quizzes) {
		if (quiz.quizId === quizId) {
			return true;
		}
	}
	return false;
}