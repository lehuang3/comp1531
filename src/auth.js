/**
  * Given an admin user's authUserId, return details about the user
  * 
  * @param {number} authUserId - User's identification 
  * 
  * ...
  * 
  * @returns {object} user 
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


