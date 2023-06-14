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
