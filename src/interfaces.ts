

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
  trash:Quiz[];
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
  description: string;
  numQuestions: number;
  questions: QuizQuestion[];
  duration:number;
}

// type of a user in the users array
interface User {
  authUserId: number;
  name: string
  email: string;
  password: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
  userQuizzes: number[]
}

interface QuizQuestion {
  questionBody: {
    question: string;
    duration: number;
    points: number;
    answers: Answer[];
  };
}

interface Answer {
  answer: string;
  correct: boolean;
}

export { AdminAuthLoginReturn, AdminUserDetailsReturn, Answer, AdminAuthRegisterReturn, ErrorObject, TokenParameter, Data, Token, User, Quiz,QuizQuestion}
