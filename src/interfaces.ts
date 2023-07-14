
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

// type of a token object in the tokens array
interface Token {
  authUserId: number;
  sessionId: number;
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

interface Answer {
  answer: string;
  correct: boolean;
}

interface QuizQuestion {
    questionId:number;
    question: string;
    duration: number;
    points: number;
    answers: Answer[];
    // colour:string;

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

// type of datastore
interface Data {
  users: User[];
  quizzes: Quiz[];
  tokens: Token[];
  trash:Quiz[];
}

export { AdminAuthLoginReturn, AdminUserDetailsReturn, Answer, AdminAuthRegisterReturn, ErrorObject, Data, Token, User, Quiz, QuizQuestion };
