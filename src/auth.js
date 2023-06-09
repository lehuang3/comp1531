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