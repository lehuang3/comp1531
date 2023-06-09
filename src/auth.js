/**
 * Return integer to indicate if user registration was successful
 * @returns {{authUserId: number}} object
 */
function adminAuthRegister(email, password, nameFirst, nameLast) {
  return {
    authUserId: 1,
  }
}


/**
 * Return integer to indicate if user successfully logs in
 * @returns {{authUserId: number}} object
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
  * ...
  * 
  * @returns {user: {userId: number, name: string, email: string, numSuccessfulLogins: number,numFailedPasswordsSinceLastLogin: number,}} 
  * 
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


