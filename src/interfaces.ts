

// return type for adminAuthRegister
interface AdminAuthRegisterReturn {
  token: string
}

// return type for adminAuthLogin
interface AdminAuthLoginReturn {
  token: string
}

// return type for adminUserDetails
interface AdminUserDetailsReturn {
  user: {
    userId: number,
    name: string,
    email: string,
    numSuccessfulLogins: number,
    numFailedPasswordsSinceLastLogin: number
  }
}

// return type of an error message
interface ErrorObject {
  error: string;
} 

// type of a token being passed in as a parameter (for most functions)
interface TokenParameter {
  token: string;
}

// type of datastore
interface Data {
  users: User[];
  quizzes: Quiz[];
  tokens: Token[];
}

// type of a token object in the tokens array
interface Token {
  authUserId: number;
  sessionId: number;
}

// type of a quiz in the quizzes array
interface Quiz {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string
}

// type of a user in the users array
interface User {
  authUserId: number;
  name: string
  email: string;
  password: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
  userQuizzes: number[];
  usedPasswords: string[]
}

export { AdminAuthLoginReturn, AdminUserDetailsReturn, AdminAuthRegisterReturn, ErrorObject, TokenParameter, Data, Token, User, Quiz}