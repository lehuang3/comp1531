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