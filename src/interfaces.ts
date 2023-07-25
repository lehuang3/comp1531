
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
  answerId:number;
  colour: string;
}

interface QuizQuestion {
    questionId:number;
    question: string;
    duration: number;
    points: number;
    answers: Answer[];
    thumbnailUrl: string;
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
  imgUrl: string;
}

// different states of a session
enum State {
  LOBBY = 'LOBBY',
  QUESTION_COUNTDOWN = 'QUESTION_COUNTDOWN',
  QUESTION_OPEN = 'QUESTION_OPEN',
  QUESTION_CLOSE = 'QUESTION_CLOSE',
  ANSWER_SHOW = 'ANSWER_SHOW',
  FINAL_RESULTS = 'FINAL_RESULTS',
  END = 'END'
}

enum Action {
  END = 'END',
  GO_TO_FINAL_RESULTS = 'GO_TO_FINAL_RESULTS',
  GO_TO_ANSWER = 'GO_TO_ANSWER',
  NEXT_QUESTION = 'NEXT_QUESTION'
}

interface Message {
  playerId: number;
  messageBody: string;
  playerName: string;
  timeSent: number;
}

interface Player {
  playerId: number;
  playerName: string;
  playerScore: number;
}

interface AnswerResult {
  answerId: number;
  playersCorrect: string[];
}

// an attempt for 1 question
interface Attempt {
  playerId: number;
  playerName: string;
  answers: number[];
  points: number;
  timeTaken: number;
}

// QuizQuestion object but with an extra key
interface QuizQuestionSession {
  questionId:number;
  question: string;
  duration: number;
  points: number;
  answers: Answer[];
  averageAnswerTime: number;
  percentCorrect: number;
  attempts: Attempt[];
}

// Quiz object but with 2 extra keys + modified questions array
interface QuizSession {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  numQuestions: number;
  questions: QuizQuestionSession[];
  duration:number;
}

interface Session {
  metadata: QuizSession;
  quizSessionId: number;
  state: State;
  autoStartNum: number;
  atQuestion: number;
  messages: Message[];
  players: Player[];
}

// type of datastore
interface Data {
  users: User[];
  quizzes: Quiz[];
  tokens: Token[];
  trash: Quiz[];
  sessions: Session[];
}

export { AdminAuthLoginReturn, AdminUserDetailsReturn, Answer, AdminAuthRegisterReturn, ErrorObject, Data, Token, User, Quiz, QuizQuestion, Session, State, Action };
