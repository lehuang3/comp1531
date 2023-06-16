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
	let data = getData();
	for (const user of data.users) {
		if (user.authUserId === authUserId) {
			return true;
		}
	}
	return false;
}

/**
 * Given a string and the minimum and maximum length to be valid, return a true or false based on the string's validity
 * @param {string} string - string length to check
 * @param {number} min - minimum length for string
 * @param {number} max - maximum length for string
 * 
 * @returns {boolean} - true or false
*/
function checkStringLengthBetween(string, min, max) {
	if ((string.length >= min) && (string.length <= max)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Given a string, UserID and quizID, return true or false depending on if the user already has a quiz of the same name
 * @param {string} string - string name to check
 * @param {number} UserID - User's ID to check for quiz of same name
 * 
 * @returns {boolean} - true or false
*/
function checkQuizNameUsed(string, UserID) {
    for (const quiz of UserID.quizzes) {
        if ((quiz == users.quizzes.quizID) && (string == users.quizzes.name)) {
            return true
        }
    }
    return false;
}