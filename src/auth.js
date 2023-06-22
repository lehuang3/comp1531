import { getData, setData } from './dataStore.js'
import validator from 'validator'

function checkValidString (string) {
  for (const char of string) {
    const integer = char.charCodeAt()
    if ((integer > 64) && (integer < 91)) {
      continue
    } else if ((integer > 96) && (integer < 123)) {
      continue
    } else if ((integer === 32) || (integer === 45) || (integer === 39)) {
      continue
    } else {
      return false
    }
  }
  return true
}

function checkValidPassword (string) {
  let intCounter = 0
  let charCounter = 0
  for (const char of string) {
    const integer = char.charCodeAt()
    if ((integer > 64) && (integer < 91)) {
      charCounter++
    } else if ((integer > 96) && (integer < 123)) {
      charCounter++
    } else if ((integer > 47) && (integer < 58)) {
      intCounter++
    }
  }
  if ((intCounter > 0) && (charCounter > 0)) {
    return true
  } else {
    return false
  }
}

function User (email, password, nameFirst, nameLast) {
  const store = getData()
  this.authUserId = store.users.length
  this.email = email
  this.password = password
  this.name = nameFirst + ' ' + nameLast
  this.numSuccessfulLogins = 1
  this.numFailedPasswordsSinceLastLogin = 0
  this.userQuizzes = []
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
function adminAuthRegister (email, password, nameFirst, nameLast) {
  const store = getData()
  // check valid email

  for (const user of store.users) {
    if (user.email === email) {
      return {
        error: 'error: email is already used for another account'
      }
    }
  }

  if (!validator.isEmail(email)) {
    return {
      error: 'error: email is not valid'
    }
  }
  // check valid first name
  if ((nameFirst.length < 2) || (nameFirst.length > 20)) {
    return {
      error: 'error: first name has an invalid length'
    }
  }

  if (!checkValidString(nameFirst)) {
    return {
      error: 'error: first name contains invalid characters'
    }
  }
  // check valid last name
  if ((nameLast.length < 2) || (nameLast.length > 20)) {
    return {
      error: 'error: last name has an invalid length'
    }
  }

  if (!checkValidString(nameLast)) {
    return {
      error: 'error: last name contains invalid characters'
    }
  }
  // check valid password
  if (password.length < 8) {
    return {
      error: 'error: password is too short'
    }
  }
  if (!checkValidPassword(password)) {
    return {
      error: 'error: password is too weak'
    }
  }
  // return successful (setdata)
  const iD = store.users.length

  store.users.push(new User(email, password, nameFirst, nameLast))

  setData(store)
  return {
    authUserId: iD
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
function adminAuthLogin (email, password) {
  const store = getData()
  // check if email is valid
  const iD = store.users.findIndex(x => x.email === email)

  if (iD === -1) {
    return {
      error: 'error: email address is does not exist'
    }
  }

  const user = store.users[iD]

  if (password === user.password) {
    user.numFailedPasswordsSinceLastLogin = 0
    user.numSuccessfulLogins++
    return {
      authUserId: user.authUserId
    }
  } else {
    user.numFailedPasswordsSinceLastLogin++
    return {
      error: 'error: password incorrect'
    }
  }
}

/**
  * Given an admin user's authUserId, return details about the user
  *
  * @param {number} authUserId - User's identification
  *
  * @returns {user: {userId: number, name: string, email: string, numSuccessfulLogins: number,numFailedPasswordsSinceLastLogin: number,}} - User object
*/
function adminUserDetails (authUserId) {
  const data = getData()
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
      }
    }
  }
  // error if no corresponding user found
  return {
    error: 'Not a valid user'
  }
}

export { adminAuthLogin, adminAuthRegister, adminUserDetails }
