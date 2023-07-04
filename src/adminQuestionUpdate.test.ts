import { adminQuizNameUpdate, adminQuizCreate } from './quiz.js'
import { adminAuthLogin, adminAuthRegister } from './auth.js'
import { requestClear, requestGetAdminUserDetails, requestAdminAuthRegister, requestAdminQuizCreate, requestAdminQuizInfo} from './other'


beforeEach(() => {
  requestClear();
})

describe('Passing cases', () => {

});

describe('Invalid quizId', () => {

});

describe('Quiz not owned', () => {

});

describe('Invalid questionId', () => {

});

describe('Question too short/long', () => {

});

describe('Too many/little answers', () => {

});

describe('Invalid timer', () => {

});

describe('Quiz total duration > 3minutes', () => {

});

describe('Question awards too little/much points', () => {

});

describe('Answer too long/short', () => {

});

describe('Two or more answers in question are the same', () => {

});

describe('No correct answers', () => {

});

describe('Invalid session', () => {

});

describe('Invalid token', () => {

});




