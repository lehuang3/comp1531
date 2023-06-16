import { adminQuizInfo } from './quiz.js';
import { clear } from './other.js';
import { getData, setData} from './dataStore.js'

// beforeEach(() => {
//   clear();
// })

test ('simple test', () => {
  let data = getData;
  data.users.push({
    UserId: 1,
    nameFirst: 'joe',
    nameLast: 'devon',
    email: 'joe.devon@gmail.com',
    password: "test123",
    numSuccessfulLogins: 3,
    numFailedPasswordsSinceLastLogin: 1,
    userQuizs:[1]
  })
  data.quizzes.push({
    quizId: 1,
    name: quiz,
    timeCreated: 1,
    timeLastEditied: 1,
    description: 'simple quiz',
  })
  expect(adminQuizInfo(1,1)).toStrictEqual({
    quizId: 1,
    name: quiz,
    timeCreated: 1,
    timeLastEditied: 1,
    description: 'simple quiz',
  })
}

)

test ('simple test', () => {
  adminAuthRegister('z123@edu.com', '123', 'test', 'test');
  adminAuthLogin('z123@edu.com', '123');
  adminQuizCreate('')
  
})



// describe('Tests with valid inputs', () => {
//   //clear();
//   let data = getData();
//   test.each(

//   )
// });

// describe('Tests with invalid authUserId', () => {
//   //clear();
//   let data = getData();
//   test.each(

//   )
// });

// describe('Test with invalid quiz id', () => {
//   //clear();
//   let data = getData();
//   test.each(

//   )
// });

// describe('Test with user not having ownership of quiz', () => {
//   //clear();
//   let data = getData();
//   test.each(

//   )
// });