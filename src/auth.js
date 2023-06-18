import { getData, setData } from './dataStore.js';
/**
 * Return integer to indicate if user registration was successful
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} nameFirst - User's first name
 * @param {string} nameLast - User's last name
 * 
 * @returns {{authUserId: number}} - User's identification
*/
function adminAuthRegister(email, password, nameFirst, nameLast) {
  return {
    authUserId: 1,
  }
}


/**
 * Return integer to indicate if user successfully logs in
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * 
 * @returns {{authUserId: number}} - User's identification
*/
function adminAuthLogin(email, password) {
	let store = getData();
	// check if email is valid
	let iD = store.users.findIndex(x => x.email === email);

	if (iD == -1) {
		return {
			error: 'error: email address is does not exist'
		};
	}
	
	let user = store.users[iD];

	if (password == user.password) {
		return {
			authUserId: user.iD
		};
	} else {
		return {
			error: 'error: password incorrect'
		};
	}
}


/**
  * Given an admin user's authUserId, return details about the user
  * 
  * @param {number} authUserId - User's identification 
  * 
  * @returns {user: {userId: number, name: string, email: string, numSuccessfulLogins: number,numFailedPasswordsSinceLastLogin: number,}} - User object
*/  
function adminUserDetails(authUserId) {
  return {
    user:
    {
      userId: 1,
      name: 'Hayden Smith',
      email: 'hayden.smith@unsw.edu.au',
      numSuccessfulLogins: 3,
      numFailedPasswordsSinceLastLogin: 1,
    }
  }
}


