import { ErrorObject, Quiz, QuizQuestion } from './interfaces';
import { save, read, isValidUser, nameQuizIsValid, quizValidCheck, quizValidOwner, nameLengthIsValid, nameTaken, isDescriptionLong,
         tokenOwner,questionLengthValid, answerCountValid,newPositioNotSame,newPositionValidCheck,questionValidCheck, durationValid,QuizDurationValid, quizPointsValid, 
         quizAnswerValid, quizAnswerDuplicateValid, quizAnswerCorrectValid, isQuizInTrash, getColour } from './other';
import { Data } from './interfaces';
/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {integer} authUserId - Admin user ID
 *
 * @returns {array object} - List of quizze
*/
function adminQuizList (token: ErrorObject | string) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }

  if (isValidUser(authUserId) === false) {
    return { error: 'User id not valid' }
  } else {
    const data = read();

    let userQuizs = []
    const quizzList = []

    for (const user of data.users) {
      if (user.authUserId === authUserId) {
        userQuizs = user.userQuizzes
      }
    }

    for (const quiz of data.quizzes) {
      if (userQuizs.includes(quiz.quizId)) {
        const currentUserQuiz = {
          quizId: quiz.quizId,
          name: quiz.name
        }

        quizzList.push(currentUserQuiz)
      }
    }

    return { quizzes: quizzList }
  }
}

/**
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {integer} authUserId - Admin user ID
 * @param {integer} name - Name of quiz
 * @param {string} authUserId - Description of quiz
 *
 * @returns {quizID: number} - Quiz's identification number
*/
function adminQuizCreate (token: ErrorObject | string, name: string, description: string) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }

  if (isValidUser(authUserId) === false) {
    return { error: 'User id not valid' }
  } else if (nameQuizIsValid(name) === false) {
    return { error: 'Quiz name is not valid' }
  } else if (nameLengthIsValid(name) === false) {
    return { error: 'Quiz name length is not valid' }
  } else if (nameTaken(authUserId, name) === true) {
    return { error: 'Quiz name is taken' }
  } else if (isDescriptionLong(description) === true) {
    return { error: 'Quiz description is not valid' }
  } else {

    let quizLength = data.quizzes.length;
    let quizId = 0;

    if(quizLength === 0){
      quizId = 0;
    } else {
      let max = 0;
      for (const index of data.quizzes) {
        if (index.quizId > max) {
          max = index.quizId
        }
      }
      quizId = max + 1;
    }

    const time = Math.floor(Date.now() / 1000)

    const newQuiz: Quiz = {
      quizId: quizId,
      name: name,
      timeCreated: time,
      timeLastEdited: time,
      description: description,
      numQuestions:0,
      questions:[],
      duration:0

    }

    data.quizzes.push(newQuiz)

    for (const user of data.users) {
      if (user.authUserId === authUserId) {
        user.userQuizzes.push(quizId)
      }
    }
    save(data);
    return { quizId:quizId }
  }
}

/**
 * Given user ID and Quiz ID it deletes it.
 *
 * @param {integer} authUserId - Admin user ID
 * @param {integer} quizId - Quiz's identification number
 *
 * @returns {{}} - Empty object
*/
function adminQuizRemove (token: ErrorObject | string, quizId: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }
  if (isValidUser(authUserId) === false) {
    return { error: 'User id not valid' }
  } else if (quizValidCheck(quizId) === false) {
    return { error: 'quiz id not valid' }
  } else if (quizValidOwner(authUserId, quizId) === false) {
    return { error: 'Not owner of quiz' }
  } else {
    const quizIndex = data.quizzes.findIndex((quiz) => quiz.quizId === quizId);
    const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

    const removedQuiz = data.quizzes.splice(quizIndex, 1)[0];
    data.trash.push(removedQuiz);
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    
    save(data);
    return {}
  }
}

/**
  * Get all of the relevant information about the current quiz.
  *
  * @param {number} authUserId - Admin user ID
  * @param {number} quizId - Quiz's identification number
  *
  * @returns {
  *   {
  *     quizId: number,
  *     name: string,
  *     timeCreated: number,
  *     timeLastEdited: number,
  *     description: string
  *   }
  * }
*/
function adminQuizInfo (token: ErrorObject | string, quizId: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }

  if (!quizValidCheck(quizId)) {
    return {
      error: 'Quiz does not exist.'
    }
  } else if (!isValidUser(authUserId)) {
    return {
      error: 'Not a valid user.'
    }
  } else if (!quizValidOwner(authUserId, quizId)) {
    return {
      error: 'You do not have access to this quiz.'
    }
  }
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId) {
      return quiz
    }
  }
}

/**
  * Update name of relevant quiz.
  *
  * @param {number} authUserId - Admin user ID
  * @param {number} quizId - Quiz's identification number
  * @param {string} name - Name of quiz
  *
  * @returns {{}} - Empty object.
*/
function adminQuizNameUpdate (token: ErrorObject | string, quizId: number, name: string) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }
  
  if (!nameLengthIsValid(name)) {
    return {
      error: 'Quiz name must be greater or equal to 3 chartacters and less than or equal to 30.'
    }
  } else if (!nameQuizIsValid(name)) {
    return {
      error: 'Quiz name cannot have special characters.'
    }
  } else if (nameTaken(authUserId, name)) {
    return {
      error: 'Quiz name already exists.'
    }
  } else if (!quizValidCheck(quizId)) {
    return {
      error: 'Quiz does not exist.'
    }
  } else if (!quizValidOwner(authUserId, quizId)) {
    return {
      error: 'You do not have access to this quiz.'
    }
  }
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId) {
      quiz.name = name;
      save(data);
      return {

      }
    }
  }
}

/**
  * Update the description of the relevant quiz.
  *
  * @param {number} authUserId - Admin user ID
  * @param {number} quizId - Quiz's identification number
  * @param {string} description - Quiz's description
  *
  * @returns {{}} - Empty object.
*/
function adminQuizDescriptionUpdate (token: ErrorObject | string, quizId: number, description: string) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }
  // check quizId
  if (!quizValidCheck(quizId)) {
    return {
      error: 'Not a valid quiz'
    }
  }
  // check ownership of quiz
  if (!quizValidOwner(authUserId, quizId)) {
    return {
      error: 'This quiz is owned by another user'
    }
  }
  // check description's length
  if (isDescriptionLong(description)) {
    return {
      error: 'Description is too long'
    }
  }
  // change description
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId) {
      quiz.description = description;
      // change timeLastEdited to current time
      quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    }
  }
  save(data);
  return {

  }
}

/**
 * Given a token find and view all quizzes in trash which the tokon/user owns
 * 
 * @param {string | ErrorObject} token token object which contains authUserId and sessionId
 *  
 * @returns {{}} empty object on success and error msg on fail
 */
function adminQuizTrash(token: string) {
  const quizzes = [];
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }
  // filter from data.trash an array of quizzes in trash that only the user has access to
  const userTrash = data.trash.filter(quiz => {
    return data.users.find(user => user.authUserId === authUserId).userQuizzes.includes(quiz.quizId)
  })

  userTrash.map(quiz => {
    quizzes.push({
      quizId: quiz.quizId,
      name: quiz.name,
    })
  })
  return {
    quizzes,
  }
}

/**
 * Given a token and quizId, find the quiz in trash and restore it
 * 
 * @param {string | ErrorObject} token token object which contains authUserId and sessionId
 * @param {number} quizId quiz Id
 * 
 * @returns {{}} empty object on sucess and error msg on fail
 */
function adminQuizRestore(token: ErrorObject | string, quizId: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }

  if (!quizValidCheck(quizId)) {
    return {
      error: 'Not a valid quiz'
    }
  }

  if (!isQuizInTrash(quizId)) {
    return { 
      error: 'Quiz not in trash.'
    }
  }

  if (!quizValidOwner(authUserId, quizId)) {
    return {
      error: 'You do not have access to this quiz.'
    }
  }


  data.quizzes.push(data.trash.filter(quiz => quiz.quizId === quizId))
  const newTrash: Quiz[] = data.trash.filter(quiz => quiz.quizId !== quizId).map(quiz => quiz);
  data.trash = newTrash;
  save(data);
  return {

  }

}

/**
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {integer} authUserId - Admin user ID
 * @param {integer} name - Name of quiz
 * @param {string} authUserId - Description of quiz
 *
 * @returns {quizID: number} - Quiz's identification number
*/
function adminQuizQuestionCreate (token: ErrorObject | string, quizId:number, quizQuestion: QuizQuestion) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }

  if (isValidUser(authUserId) === false) {
    return { error: 'User id not valid' }
  } else if (quizValidCheck(quizId) === false) {
    return { error: 'quiz id not valid' }
  } else if (quizValidOwner(authUserId, quizId) === false) {
    return { error: 'Not owner of quiz' }
  } else if(questionLengthValid(quizQuestion) === false){
    return { error: 'Question length is not valid' }
  } else if(answerCountValid(quizQuestion) === false){
    return { error: 'There must 2 asnwer and no greater than 6' }
  } else if(durationValid(quizQuestion) === false){
    return { error: 'Duration must be a positive number' }
  } else if(QuizDurationValid(data,quizQuestion, quizId) === false){
    return { error: 'Duration excesseds 3 minutes' }
  } else if(quizPointsValid(quizQuestion) === false){
    return { error: 'Points must not be less than 1 or greater than 10' }
  } else if(quizAnswerValid(quizQuestion) === false){
    return { error: '1 or more of your asnwer is less than 1 or greater 30 characters' }
  } else if(quizAnswerDuplicateValid(quizQuestion) === false){
    return { error: 'There are duplicate answers' }
  } else if(quizAnswerCorrectValid(quizQuestion) === false){
    return { error: 'There are no correct asnwers' }
  }else {
    const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
    
    let newQuestionId = 0;
    if (quiz.questions.length > 0) {
      const lastQuestion = quiz.questions[quiz.questions.length - 1];
      newQuestionId = lastQuestion.questionId + 1;
    }


    const newQuestion = {
      questionId: newQuestionId,
      question: quizQuestion.questionBody.question,
      duration: quizQuestion.questionBody.duration,
      points: quizQuestion.questionBody.points,
      answers: quizQuestion.questionBody.answers.map((answer,length) =>({
        answerId:length,
        answer: answer.answer,
        correct: answer.correct,
        color: getColour()
      }))
    };

    quiz.questions.push(newQuestion);
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    quiz.numQuestions++;
    quiz.duration+=quizQuestion.questionBody.duration;
    //console.log(quiz.questions[0]);
    save(data)
    return {questionId:newQuestionId}

  }
}

/**
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {integer} authUserId - Admin user ID
 * @param {integer} name - Name of quiz
 * @param {string} authUserId - Description of quiz
 *
 * @returns {quizID: number} - Quiz's identification number
*/
function adminQuizQuestionMove (quizId:number ,questionId:number ,token: ErrorObject | string, newPosition:number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }

  if (isValidUser(authUserId) === false) {
    return { error: 'User id not valid' }
  } else if (quizValidCheck(quizId) === false) {
    return { error: 'quiz id not valid' }
  } else if (quizValidOwner(authUserId, quizId) === false) {
    return { error: 'Not owner of quiz' }
  } else if (questionValidCheck(data, quizId, questionId) === false) {
    return { error: 'Question not found' }
  } else if (newPositionValidCheck(data, quizId, newPosition) === false) {
    return { error: 'Invalid new position' }
  } else if (newPositioNotSame(data, quizId,questionId, newPosition) === false) {
    return { error: 'New Position cannot be the same as original' }
  } else {

    const quiz = data.quizzes.find((quiz: { quizId: number; }) => quiz.quizId === quizId);
    const originalPosition = quiz.questions.findIndex((question: { questionId: number; }) => question.questionId === questionId);
    const questionToMove = quiz.questions[originalPosition];

    quiz.questions.splice(originalPosition, 1); 
    quiz.questions.splice(newPosition, 0, questionToMove);
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    // console.log( quiz.questions);
    save(data)
    return{};

  }
 
}

/**
 * Given token, quizId of a quiz and email of a target user,
 * transfer the quiz from the user represented by the token
 * to the targer user
 *
 * @param {string | ErrorObject} token - token that represents original owner of the quiz
 * @param {number} quizId - quizId of the quiz
 * @param {string} userEmail - Target user's email
 *
 * @returns {} - empty object
*/
function adminQuizTransfer(token: string | ErrorObject, quizId: number, userEmail: string) {  
  const data: Data = read();
  let users = [...data.users];
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }
  if (!quizValidCheck(quizId)) {
    return {
      error: 'Quiz does not exist.'
    }
  } else if (!quizValidOwner(authUserId, quizId)) {
    return {
      error: 'You do not have access to this quiz.'
    }
  } else if (users.filter(user => user.email === userEmail).length === 0) {
    return {
      error: 'Target user does not exist'
    }
  } else if (users.filter(user => user.email === userEmail)[0].authUserId === authUserId) {
    return {
      error: 'Target user is also original user'
    }
  } else {
    const targetUserQuizzes = users.filter(user => user.email === userEmail)[0].userQuizzes;
    let quizzes = [...data.quizzes];
    const transferedQuizName = quizzes.filter(quiz => quiz.quizId === quizId)[0].name;
    // compare name of quiz to be transfered with every quiz name of quizzes that the target user has
    for (const userQuizId of targetUserQuizzes) {
      const targetUserQuizName = quizzes.filter(quiz => quiz.quizId === userQuizId)[0].name;
      if (transferedQuizName == targetUserQuizName) {
        return {
          error: "Quiz to be transfered has the same name as one of target user's quizzes",
        }
      }
    }
  }
  // Quiz is not removed from quizzes array, but is rather removed from userQuizzes of the 
  // original user, and added to userQuizzes of target user.
  data.users.map(user => {
    if (user.authUserId === authUserId) {
      // console.log(user.userQuizzes)
      user.userQuizzes = user.userQuizzes.filter(userQuizId => userQuizId !== quizId)
      // console.log(user.userQuizzes)
    }
    if (user.email === userEmail) {
      // console.log(user.userQuizzes)
      user.userQuizzes.push(quizId)
      // console.log(user.userQuizzes)
    }
  })
  save(data)
  return {
  
  }
}

/**
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {integer} authUserId - Admin user ID
 * @param {integer} name - Name of quiz
 * @param {string} authUserId - Description of quiz
 *
 * @returns {quizID: number} - Quiz's identification number
*/
function adminQuizQuestionDupicate (quizId:number ,questionId:number ,token: ErrorObject | string) {
  const data: Data = read();
  let users = [...data.users];
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }

  if (isValidUser(authUserId) === false) {
    return { error: 'User id not valid' }
  } else if (quizValidCheck(quizId) === false) {
    return { error: 'quiz id not valid' }
  } else if (quizValidOwner(authUserId, quizId) === false) {
    return { error: 'Not owner of quiz' }
  } else if (questionValidCheck(data, quizId, questionId) === false) {
    return { error: 'Question not found' }
  } else {

    const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
    const question = quiz.questions.find(question => question.questionId === questionId);
    let newQuestionId = 0;
    if (quiz.questions.length > 0) {
      const lastQuestion = quiz.questions[quiz.questions.length - 1];
      newQuestionId = lastQuestion.questionId + 1;
    }

    const newQuestion = {
      questionId: newQuestionId,
      question: question.question,
      duration: question.duration,
      points: question.points,
      answers: question.answers
    };

    quiz.questions.push(newQuestion);
    quiz.duration += question.duration;
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    quiz.numQuestions++;
    save(data)
    return {newQuestionId:newQuestionId}

  } 
}

/**
 * Given a token, quizId and questionId delete the question inside the quiz
 * 
 * @param {string | ErrorObject} token token which contains authUserId and sessionId 
 * @param {number} quizId quiz Id
 * @param {number} questionId question Id
 * 
 * @returns {{}} empty object on sucess error msg on fail
 */
function adminQuizQuestionDelete(token: ErrorObject | string, quizId: number, questionId: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }
  if (!quizValidCheck(quizId)) {
    return {
      error: 'Quiz does not exist.'
    }
  } else if (!quizValidOwner(authUserId, quizId)) {
    return {
      error: 'You do not have access to this quiz.'
    }
  } else if (!questionValidCheck(data, quizId, questionId)) {
    return {
      error: 'Question does not exist.'
    }
  }
  // find the quiz in data.quizzes by matching quizId to data.quizzes.quizId, find the quiz question in data.quizzes.quiz.question, splice out the question.
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId)
  // console.log(quiz)
  // found the quiz which contains the question
  let index: number = 0;
  for (const question of quiz.questions) {
    if (question.questionId === questionId) {
      quiz.questions.splice(index, 1);
      save(data);
      return {
      };
    }
    index ++;
  }
  return {
    error: 'Something went wrong'
  }
}
/**
 * Given a token, quizId, questionId and quizQuestions, update the quiz and its corresponding question to that of the new 
 * quizQuestion
 * 
 * @param {string | ErrorObject} token token which contains authUserId and sessionId 
 * @param {number} quizId quiz Id
 * @param {number} questionId question Id 
 * @param {QuizQuestion} quizQuestion the new question object
 * 
 * @returns {{}} return empty object on sucess and error msg on fail
 */
function adminQuizQuestionUpdate(token: ErrorObject | string, quizId: number, questionId: number, quizQuestion: quizQuestion) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }
  if (!quizValidCheck(quizId)) {
    return { 
      error: 'Quiz does not exist.' 
    }
  } else if (!quizValidOwner(authUserId, quizId)) {
    return { 
      error: 'You do not have access to this quiz.' 
    }
  } else if (!questionValidCheck(data, quizId, questionId)) {
    return {
      error: 'This question does not exist.'
    }
  } else if (!questionLengthValid(quizQuestion)) {
    return { 
      error: 'Question must be greater than 4 characters and less than 51 characters.'
    }
  } else if (!answerCountValid(quizQuestion)) {
    return { 
      error: 'Must have more than one answer and less than 7 answers.'
    }
  } else if (!durationValid(quizQuestion)) {
    return {  
      error: 'Time allowed must be a postive number.'  
    }
  } else if (!QuizDurationValid(data,quizQuestion, quizId)) {
    return { 
      error: 'Quiz duration longer than 3 minutes.'
    }
  } else if (!quizPointsValid(quizQuestion)) {
    return { 
      error: 'Question must award at least one point and no more than 10 points.' 
    }
  } else if (!quizAnswerValid(quizQuestion)) {
    return { 
      error: 'Answer must be greater than 0 characters and less than 31 characters long.' 
    }
  } else if (!quizAnswerDuplicateValid(quizQuestion)) {
    return { 
      error: 'Cannot have same answers for one question.' 
    }
  } else if (!quizAnswerCorrectValid(quizQuestion)) {
    return { 
      error: 'There are no correct answers.' 
    }
  }
  // find the quiz in data.quizzes by matching quizId to data.quizzes.quizId, find the quiz question in data.quizzes.quiz.question, splice out the question.
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  // console.log(quiz)
  // found the quiz which contains the question
  for (const question of quiz.questions) {
    if (question.questionId === questionId) {
      quiz.questions = quizQuestion;
      const updatedQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
      updatedQuiz.timeLastEdited = Math.floor(Date.now() / 1000)
      save(data);
      return {

      };
    }
  }
  return {
    error: 'Something went wrong'
  }
  
}

/**
 * Given token, array of quizIds,
 * removes the corresponding quizzes in the trash
 *
 * @param {string | ErrorObject} token - token that represents original owner of the quiz
 * @param {number[]} quizIdArr - array of quizIds of quizIds
 *
 * @returns {} - empty object
*/
function adminQuizTrashEmpty(token: string | ErrorObject, quizIdArr: number[]) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    const error = authUserId.error;
    return {
      error
    }
  }
  // if no quizzes are chosen to be removed, return with 200 status code with 
  // no modifications of trash
  if (quizIdArr === undefined) {
    return {}
  }

  for (const quizId of quizIdArr) {
    if (!quizValidCheck(quizId)) {
      return {
        error: "One or more of the quizzes is not a valid quiz"
      }
    }
    if (!quizValidOwner(authUserId, quizId)) {
      return {
        error: "One or more of the quizzes refers to a quiz that this current user does not own"
      }
    }
    if (!isQuizInTrash(quizId)) {
      return {
        error: "One or more of the quizzes is not currently in the trash"
      }
    }
  }

  quizIdArr.map(quizIdToRemove => {
    // user.userQuizzes = user.userQuizzes.filter(userQuizId => userQuizId !== quizId)
    data.trash = data.trash.filter(quiz => quiz.quizId !== quizIdToRemove);
    save(data);
  })
  return {}

}

export { adminQuizInfo, adminQuizCreate, adminQuizNameUpdate, adminQuizDescriptionUpdate, adminQuizList, adminQuizRemove, adminQuizTrash, adminQuizTransfer, adminQuizRestore,
adminQuizQuestionCreate, adminQuizQuestionMove, adminQuizQuestionDupicate, adminQuizQuestionDelete, adminQuizQuestionUpdate, adminQuizTrashEmpty }

