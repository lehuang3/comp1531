import { Data } from './interfaces';
import validator from 'validator';
import { read, save, tokenOwner } from './other';
import { AdminAuthLoginReturn, AdminAuthRegisterReturn, AdminUserDetailsReturn, ErrorObject } from './interfaces';
import HTTPError from 'http-errors';
import crypto from 'crypto';
let counterSession = 0;

/**
 * Given a string, check if the string is valid
 *
 * @param {string} string string to be checked
 *
 * @returns {boolean} true or false
*/
function checkValidString (string: string): boolean {
  for (const char of Array.from(string)) {
    const integer = char.charCodeAt(0);
    if ((integer > 64) && (integer < 91)) {
      continue;
    } else if ((integer > 96) && (integer < 123)) {
      continue;
    } else if ((integer === 32) || (integer === 45) || (integer === 39)) {
      continue;
    } else {
      return false;
    }
  }
  return true;
}

/**
 * Given a string check if the string is a valid password string
 *
 * @param {string} string input password string
 *
 * @returns {boolean} - true or false
*/
function checkValidPassword (string:string): boolean {
  let intCounter = 0;
  let charCounter = 0;
  for (const char of Array.from(string)) {
    const integer = char.charCodeAt(0);
    if ((integer > 64) && (integer < 91)) {
      charCounter++;
    } else if ((integer > 96) && (integer < 123)) {
      charCounter++;
    } else if ((integer > 47) && (integer < 58)) {
      intCounter++;
    }
  }
  if ((intCounter > 0) && (charCounter > 0) && string.length >= 8) {
    return true;
  } else {
    return false;
  }
}

/**
 * Given user information populate a user object with the imformation in the datastore
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} nameFirst - User's first name
 * @param {string} nameLast - User's last name
*/
function User (email: string, password: string, nameFirst: string, nameLast: string) {
  const store = read();
  this.authUserId = store.users.length;
  this.email = email;
  this.password = crypto.createHash('sha256').update(password).digest('hex');
  this.name = nameFirst + ' ' + nameLast;
  this.numSuccessfulLogins = 1;
  this.numFailedPasswordsSinceLastLogin = 0;
  this.userQuizzes = [];
  this.usedPasswords = [];
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
function adminAuthRegister (email: string, password: string, nameFirst: string, nameLast: string): AdminAuthRegisterReturn | ErrorObject {
  const store: Data = read();
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
  if ((nameFirst.length < 2) || (nameFirst.length > 20)) {
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
  if ((nameLast.length < 2) || (nameLast.length > 20)) {
    return {
      error: 'error: last name has an invalid length'
    };
  }

  if (!checkValidString(nameLast)) {
    return {
      error: 'error: last name contains invalid characters'
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
  // return successful (save)
  const iD = store.users.length;
  if (store.users.length === 0) {
    counterSession = 0;
  }
  const sessionIdHash = crypto.createHash('sha256').update(counterSession.toString()).digest('hex');
  store.users.push(new (User as any)(email, password, nameFirst, nameLast));
  store.tokens.push({
    authUserId: iD,
    sessionId: sessionIdHash,
  });
  counterSession++;
  save(store);
  return {
    token: sessionIdHash,
  };
}

/**
 * Return integer to indicate if user successfully logs in
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 *
 * @returns {{authUserId: number}} - User's identification
*/
function adminAuthLogin (email: string, password: string): AdminAuthLoginReturn | ErrorObject {
  const store: Data = read();
  // check if email is valid
  const iD = store.users.findIndex(x => x.email === email);

  if (iD === -1) {
    return {
      error: 'error: email address does not exist'
    };
  }

  const user = store.users[iD];
  if (crypto.createHash('sha256').update(password).digest('hex') === user.password) {
    user.numFailedPasswordsSinceLastLogin = 0;
    user.numSuccessfulLogins++;
    // add new token to tokens array
    const sessionIdHash = crypto.createHash('sha256').update(counterSession.toString()).digest('hex');
    store.tokens.push({
      authUserId: iD,
      sessionId: sessionIdHash,
    });
    save(store);
    counterSession++;
    return {
      token: sessionIdHash,
    };
    // failed login attempt
  } else {
    user.numFailedPasswordsSinceLastLogin++;
    save(store);
    return {
      error: 'error: password incorrect'
    };
  }
}

/**
  * Given an admin user's token, return details about the user
  *
  * @param {string} token - User's identification
  * @param {number} version
  *
  * @returns {user: {userId: number, name: string, email: string, numSuccessfulLogins: number,numFailedPasswordsSinceLastLogin: number,}} - User object
*/
function adminUserDetails (token: ErrorObject | string, version: number): AdminUserDetailsReturn | ErrorObject {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }
  // loop through users array
  for (const user of data.users) {
    if (user.authUserId === authUserId) {
      // return details of corresponding user
      return {
        user: {
          userId: user.authUserId,
          name: user.name,
          email: user.email,
          numSuccessfulLogins: user.numSuccessfulLogins,
          numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin
        }
      };
    }
  }
}

/**
 * Updates the password of the admin user
 *
 * @param {string | ErrorObject} token token object which contains authUserId and sessionId
 * @param {string} oldPassword old password
 * @param {string} newPassword new password
 * @param {number} version
 *
 * @returns {{}} returns empty object on sucess and error msg on fail
 */
function adminAuthPasswordUpdate (token: ErrorObject | string, oldPassword: string, newPassword: string, version: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }

  if (!checkValidPassword(newPassword)) {
    if (version === 1) {
      return {
        error: 'New password is invalid',
      };
    } else {
      throw HTTPError(400, 'New password is invalid');
    }
  }
  const user = data.users.find((userID) => userID.authUserId === authUserId);
  if (crypto.createHash('sha256').update(oldPassword).digest('hex') !== user.password) {
    throw HTTPError(400, 'Old password is incorrect');
  } else if (user.usedPasswords.includes(crypto.createHash('sha256').update(newPassword).digest('hex'))) {
    throw HTTPError(400, 'Password has been used before');
  }
  user.usedPasswords.push(crypto.createHash('sha256').update(oldPassword).digest('hex'));
  user.password = crypto.createHash('sha256').update(newPassword).digest('hex');
  save(data);
  return {

  };
}

/**
 * Log out of session
 *
 * @param {string | ErrorObject} token token object which contains authUserId and sessionId
 * @param { number } version
 * @returns {{}} empty object on success and error msg on fail
 */
function adminAuthLogout (token: ErrorObject | string, version: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }
  // removes token from active tokens array
  data.tokens = data.tokens.filter((user) => user.sessionId !== token);
  save(data);
  return {

  };
}

/**
 * Given a new details about a current user, the users info is updated
 *
 * @param {string} token token
 * @param {string} email user email
 * @param {string} nameFirst username first name
 * @param {string} nameLast user lastname
 * @param {number} version
 *
 * @returns {}
*/

function adminAuthDetailsUpdate(token: string | ErrorObject, email: string, nameFirst: string, nameLast:string, version: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      if (version === 1) {
        return {
          error: 'Invalid token structure',
        };
      } else if (version === 2) {
        throw HTTPError(401, 'Invalid token structure');
      }
      // invalid session
    } else {
      if (version === 1) {
        return {
          error: 'Not a valid session',
        };
      } else if (version === 2) {
        throw HTTPError(403, 'Not a valid session');
      }
    }
  }

  // check valid email
  for (const user of data.users) {
    if (user.email === email && user.authUserId !== authUserId) {
      if (version === 1) {
        return {
          error: 'email is already used for another account',
        };
      } else {
        throw HTTPError(400, 'email is already used for another account');
      }
    }
  }

  if (!checkValidString(nameFirst)) {
    if (version === 1) {
      return {
        error: 'First name is invalid',
      };
    } else {
      throw HTTPError(400, 'First name is invalid');
    }
  }
  if (!checkValidString(nameLast)) {
    if (version === 1) {
      return {
        error: 'Last name is invalid',
      };
    } else {
      throw HTTPError(400, 'Last name is invalid');
    }
  }
  // check valid first name
  if ((nameFirst.length < 2) || (nameFirst.length > 20)) {
    if (version === 1) {
      return {
        error: 'error: first name has an invalid length',
      };
    } else {
      throw HTTPError(400, 'error: first name has an invalid length');
    }
  }
  // check valid last name
  if ((nameLast.length < 2) || (nameLast.length > 20)) {
    if (version === 1) {
      return {
        error: 'error: last name has an invalid length',
      };
    } else {
      throw HTTPError(400, 'error: last name has an invalid length');
    }
  }
  if (!validator.isEmail(email)) {
    if (version === 1) {
      return {
        error: 'error: email is not valid',
      };
    } else {
      throw HTTPError(400, 'error: email is not valid');
    }
  }

  const user = data.users.find((userID) => userID.authUserId === authUserId);
  user.email = email;
  user.name = nameFirst + ' ' + nameLast;
  save(data);
  return {};
}

export { adminAuthLogin, adminAuthRegister, adminUserDetails, checkValidPassword, adminAuthPasswordUpdate, adminAuthLogout, adminAuthDetailsUpdate };
