import { getData, setData } from './dataStore.js';
import { validator } from 'validator';

function checkValidString(string) {
	for (const char of string) {
		let integer = char.charCodeAt();
		if ((integer > 64) && (integer < 91)) {
			continue;
		} else if ((integer > 96) && (integer < 123)) {
			continue;
		} else if ((integer == 32) || (integer == 45) || (integer == 39)) {
			continue;
		} else {
			return false;
		}
	}
	return true;
}

function checkValidPassword(string) {
	let intCounter = 0;
	let charCounter = 0;
	for (const char of string) {
		let integer = char.charCodeAt();
		if ((integer > 64) && (integer < 91)) {
			charCounter++;
		} else if ((integer > 96) && (integer < 123)) {
			charCounter++;
		} else if ((integer > 47) && (integer < 58)) {
			intCounter++;
		}
	}
	if ((intCounter > 0) && (charCounter > 0)) {
		return true;
	} else {
		return false;
	}
}

function user(email, password, nameFirst, nameLast) {
    let store = getData();
    this.UserID = store.users.length;
    this.email = email;
    this.password = password;
    this.nameFirst = nameFirst;
    this.nameLast = nameLast;
    this.numSuccessfulLogins = 1;
    this.numFailedPasswordsSinceLastLogin = 0;
    this.userQuizs = [];
}

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
	let store = getData();
	// check valid email
	for (const user of store.users) {
		if (user.email === email) {
			return {
				error: 'error: email is already used for another account'
			};
		}
	}

	if (!validator.isEmail(email)) {
		return {
			error: 'error: email is not valid'
		};
	}
	// check valid first name
	if ((nameFirst.length < 2) || (nameFirst > 20)) {
		return {
			error: 'error: first name has an invalid length'
		};
	}

	if (!checkValidString(nameFirst)) {
		return {
			error: 'error: first name contains invalid characters'
		};
	}
	// check valid last name
	if ((nameLast.length < 2) || (nameLast > 20)) {
		return {
			error: 'error: last name has an invalid length'
		};
	}

	if (!checkValidString(nameLast)) {
		return {
			error: 'error: name name contains invalid characters'
		};
	}
	// check valid password
	if (password.length < 8) {
		return {
			error: 'error: password is too short'
		};
	}
	if (!checkValidPassword(password)) {
		return {
			error: 'error: password is too weak'
		};
	}
	// return successful (setdata)
	store.users.push = new user(email, password, nameFirst, nameLast)

	const iD = store.users[store.users.length -1].UserID

	setData(store);
	return {
		authUserId: iD,
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
	return {
		authUserId: 1,
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

export { adminAuthRegister, adminAuthLogin };