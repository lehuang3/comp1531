import { State, Data, ErrorObject, Action, AnswerResult, Answer } from './interfaces';
import {
  save, read, tokenOwner, quizActiveCheck, quizValidOwner, activeSessions, quizHasQuestion, generateSessionId,
  quizSessionIdValidCheck, isActionApplicable, isSessionInLobby, nameExistinSession, generateRandomName, findPlayerSession,
  answerIdsValidCheck, findScalingFactor, getAverageAnswerTime, getPercentCorrect, getQuestionResults, isSessionAtLastQuestion,
  getSessionState, isSessionInFinal, getSessions
} from './other';
import HTTPError from 'http-errors';
interface SessionIdReturn {
  sessionId: number;
}

let questionOpenStart: number;
let timeoutIds: NodeJS.Timeout[] = [];

export function clearTimeouts() {
  for (const timeoutId of timeoutIds) {
    clearTimeout(timeoutId);
  }
  timeoutIds = [];
}

function adminQuizSessionStart(token: ErrorObject | string, quizId: number, autoStartNum: number): SessionIdReturn {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      throw HTTPError(401, 'Invalid token structure');
      // invalid session
    } else {
      throw HTTPError(403, 'Not a valid session');
    }
  }
  if (!quizActiveCheck(quizId)) {
    throw HTTPError(400, 'Quiz does not exist');
  }
  if (!quizValidOwner(authUserId, quizId)) {
    throw HTTPError(400, 'You do not have access to this quiz');
  }
  if (autoStartNum > 50) {
    throw HTTPError(400, 'Maximum number of users is 50');
  }
  if (activeSessions() >= 10) {
    throw HTTPError(400, 'Exceeded maxinum number of active sessions');
  }
  if (quizHasQuestion(quizId)) {
    throw HTTPError(400, 'Quiz does not have any question');
  }
  const quiz = data.quizzes.filter(quiz => quiz.quizId === quizId)[0];
  const newSessionId = generateSessionId();
  data.sessions.push({
    metadata: {
      quizId: quizId,
      name: quiz.name,
      timeCreated: quiz.timeCreated,
      timeLastEdited: quiz.timeLastEdited,
      description: quiz.description,
      numQuestions: quiz.numQuestions,
      questions: quiz.questions.map(question => {
        return {
          questionId: question.questionId,
          question: question.question,
          duration: question.duration,
          points: question.points,
          thumbnailUrl: question.thumbnailUrl,
          answers: question.answers,
          // default value of averageAnswerTime
          averageAnswerTime: 0,
          // default value of percentCorrect
          percentCorrect: 0,
          attempts: []
        };
      }),
      duration: quiz.duration,
      thumbnailUrl: quiz.thumbnailUrl
    },
    quizSessionId: newSessionId,
    state: State.LOBBY,
    autoStartNum: autoStartNum,
    // this value = 0 in LOBBY state
    atQuestion: 0,
    messages: [],
    players: []
  });
  save(data);
  return {
    sessionId: newSessionId,
  };
}

function questionCountdownHandler(sessionId: number) {
  const data: Data = read();
  for (const session of data.sessions) {
    if (session.quizSessionId === sessionId) {
      timeoutIds.push(setTimeout(() => {
        session.state = State.QUESTION_OPEN;
        // console.log('question open')
        save(data);
        questionOpenStart = Math.floor(Date.now() / 1000);
        timeoutIds.push(setTimeout(() => {
          session.state = State.QUESTION_CLOSE;
          save(data);
        }, session.metadata.questions[session.atQuestion - 1].duration * 1000));
      }, 1000));
      save(data);
    }
  }
}

function adminQuizSessionStateUpdate(token: ErrorObject | string, quizId: number, sessionId: number, action: string) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      throw HTTPError(401, 'Invalid token structure');
      // invalid session
    } else {
      throw HTTPError(403, 'Not a valid session');
    }
  }
  if (!quizActiveCheck(quizId)) {
    throw HTTPError(400, 'Quiz does not exist');
  }
  if (!quizValidOwner(authUserId, quizId)) {
    throw HTTPError(400, 'You do not have access to this quiz');
  }
  if (!quizSessionIdValidCheck(quizId, sessionId)) {
    throw HTTPError(400, 'Session is not valid');
  }
  if (!Object.keys(Action).includes(action)) {
    throw HTTPError(400, 'Invalid Action enum');
  }
  if (!isActionApplicable(sessionId, action).applicable ||
     (isSessionAtLastQuestion(sessionId) &&
     (getSessionState(sessionId) === 'ANSWER_SHOW' || getSessionState(sessionId) === 'QUESTION_CLOSE') &&
     (action === 'NEXT_QUESTION'))) {
    throw HTTPError(400, 'Action is not applicable');
  }

  const nextState = isActionApplicable(sessionId, action).nextState;
  for (const session of data.sessions) {
    if (session.quizSessionId === sessionId) {
      session.state = nextState;
      if (session.state === 'QUESTION_COUNTDOWN') {
        session.atQuestion = session.atQuestion + 1;
        save(data);
        questionCountdownHandler(session.quizSessionId);
      }
      if (session.state === 'FINAL_RESULTS' || session.state === 'END') {
        session.atQuestion = 0;
      }
    }
  }
  save(data);
  return {};
}

function adminSessionChatView(playerId: number) {
  const data: Data = read();
  const sess = data.sessions.find((session) => {
    if ((session.players.find((player) => player.playerId === playerId))) {
      return session;
    }
  });
  if (sess === undefined) {
    throw HTTPError(400, 'Player does not exist.');
  }
  const chatLogs: object[] = [];
  // console.log(sess)
  for (const message of sess.messages) {
    chatLogs.push(message);
  }
  // console.log(chatLogs)
  return {
    messages: chatLogs
  };
}

function adminSessionChatSend(playerId: number, message: string) {
  const data: Data = read();
  const sess = data.sessions.find((session) => {
    if ((session.players.find((player) => player.playerId === playerId))) {
      return session;
    }
  });
  if (sess === undefined) {
    throw HTTPError(400, 'Player does not exist.');
  } else if (message.length < 1 || message.length > 100) {
    throw HTTPError(400, 'Message length must be greater than 0 and less than 101.');
  }

  const player = sess.players.find((player) => {
    if (player.playerId === playerId) {
      return player.playerName;
    }
  });
  const newMessage = {
    playerId: playerId,
    messageBody: message,
    playerName: player.playerName,
    timeSent: Math.floor(Date.now() / 1000)
  };
  sess.messages.push(newMessage);
  save(data);
  return {};
}

function QuizSessionPlayerJoin(sessionId:number, name:string) {
  const data: Data = read();
  if (isSessionInLobby(data.sessions, sessionId) === false) {
    throw HTTPError(400, 'Session not in lobby');
  }
  if (name.length > 0) {
    if (nameExistinSession(data.sessions, name, sessionId) === true) {
      throw HTTPError(400, 'Name Taken');
    }
  } else {
    name = generateRandomName();
  }

  let maxplayerId = 0;

  for (const session of data.sessions) {
    for (const player of session.players) {
      // console.log(player.playerId)
      if (player.playerId > maxplayerId) {
        maxplayerId = player.playerId;
      }
    }
  }

  maxplayerId++;
  const newPlayer = {
    playerId: maxplayerId,
    playerName: name,
    playerScore: 0
  };
  const session = data.sessions.find((session:any) => session.quizSessionId === sessionId);

  session.players.push(newPlayer);
  if (session.players.length === session.autoStartNum) {
    session.state = State.QUESTION_COUNTDOWN;
    session.atQuestion++;
    save(data);
    questionCountdownHandler(session.quizSessionId);
  }
  // console.log(session)
  save(data);

  return { playerId: maxplayerId };
}

function adminQuizSessionState(token: ErrorObject | string, quizId: number, sessionId: number) {
  const data: Data = read();
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      throw HTTPError(401, 'Invalid token structure');
      // invalid session
    } else {
      throw HTTPError(403, 'Not a valid session');
    }
  }
  if (!quizActiveCheck(quizId)) {
    throw HTTPError(400, 'Quiz does not exist');
  }
  if (!quizValidOwner(authUserId, quizId)) {
    throw HTTPError(400, 'You do not have access to this quiz');
  }
  if (!quizSessionIdValidCheck(quizId, sessionId)) {
    throw HTTPError(400, 'Session is not valid');
  }

  const session = data.sessions.find((session:any) => session.quizSessionId === sessionId);

  const sessionStatus = {
    state: session.state,
    atQuestion: session.atQuestion,
    players: session.players.map(player => player.playerName),
    metadata: {
      quizId: session.metadata.quizId,
      name: session.metadata.name,
      timeCreated: session.metadata.timeCreated,
      timeLastEdited: session.metadata.timeLastEdited,
      description: session.metadata.description,
      numQuestions: session.metadata.numQuestions,
      questions: session.metadata.questions,
      duration: session.metadata.duration,
      thumbnailUrl: session.metadata.thumbnailUrl
    }
  };
  // console.log(sessionStatus);
  return sessionStatus;
}

function QuizSessionPlayerStatus(playerId: number) {
  const data: Data = read();
  for (const session of data.sessions) {
    const player = session.players.find((player) => player.playerId === playerId);
    if (player) {
      return {
        state: session.state,
        numQuestions: session.metadata.numQuestions,
        atQuestion: session.atQuestion
      };
    }
  }
  throw HTTPError(400, 'Player does not exits');
}

function playerAnswerSubmit(playerId: number, questionposition: number, answerIds: number[]) {
  const data: Data = read();
  const playerSession = findPlayerSession(playerId);
  if (playerSession === undefined) {
    throw HTTPError(400, 'Player does not exist');
  }
  if (questionposition <= 0 || questionposition > playerSession.metadata.questions.length) {
    throw HTTPError(400, 'Question is not valid for this session');
  }
  if (playerSession.state !== State.QUESTION_OPEN) {
    throw HTTPError(400, 'Question is not open');
  }
  if (playerSession.atQuestion < questionposition) {
    throw HTTPError(400, 'Session is not up to this question yet');
  }
  if (!answerIdsValidCheck(playerSession, questionposition, answerIds)) {
    throw HTTPError(400, 'At least 1 answer is invalid');
  }
  // set can only contain unique values
  if (new Set(answerIds).size !== answerIds.length) {
    throw HTTPError(400, 'Answer(s) has duplicate(s)');
  }
  if (answerIds.length < 1) {
    throw HTTPError(400, 'No answer submitted');
  }

  for (const session of data.sessions) {
    if (session.quizSessionId === playerSession.quizSessionId) {
      const timeTaken = Math.floor(Date.now() / 1000) - questionOpenStart;
      let points = session.metadata.questions[questionposition - 1].points;
      const correctAnswers = session.metadata.questions[questionposition - 1].answers.filter(answer => answer.correct === true);

      // if correctAnswers and answerIds have different numbers of values => wrong
      if (correctAnswers.length !== answerIds.length) {
        points = 0;
      }
      // if correctAnswers has the same number of values as answerIds, but
      // correctAnswers does not have value(s) of answerIds => wrong
      for (const answerId of answerIds) {
        if (correctAnswers.find(answer => answer.answerId === answerId) === undefined) {
          points = 0;
        }
      }
      const playerName = session.players.filter(player => player.playerId === playerId)[0].playerName;
      // add player to list of attempts used to calculate average time and percent correct
      if (!session.metadata.questions[questionposition - 1].attempts.find(attempt => attempt.playerId === playerId)) {
        session.metadata.questions[questionposition - 1].attempts.push({
          playerId: playerId,
          playerName: playerName,
          answers: answerIds,
          points: points,
          timeTaken: timeTaken,
        });
        // there is already an entry in the attempts array from the player
      } else {
        for (const attempt of session.metadata.questions[questionposition - 1].attempts) {
          if (attempt.playerId === playerId) {
            // points and timeTaken need to be updated because a player can change their mind => different
            // answer at a later time => affects ranking
            attempt.answers = answerIds;
            attempt.points = points;
            attempt.timeTaken = timeTaken;
          }
        }
      }
      // console.log(session.metadata.questions[questionposition - 1].attempts)
      // find averageAnwerTime
      session.metadata.questions[questionposition - 1].averageAnswerTime = Math.round(getAverageAnswerTime(session, questionposition));
      // find percentCorrect
      // if a player is correct, their point is not 0
      session.metadata.questions[questionposition - 1].percentCorrect = Math.round(getPercentCorrect(session, questionposition));
      // console.log(session.metadata.questions[questionposition - 1].attempts);
    }
    save(data);
  }
  return {};
}

function playerQuestionInfo(playerId: number, questionposition: number) {
  const playerSession = findPlayerSession(playerId);
  if (playerSession === undefined) {
    throw HTTPError(400, 'Player does not exist');
  }
  if (questionposition <= 0 || questionposition > playerSession.metadata.questions.length) {
    throw HTTPError(400, 'Question is not valid for this session');
  }
  if (playerSession.atQuestion !== questionposition) {
    throw HTTPError(400, 'Session is not currently on this question');
  }
  if (playerSession.state === State.END || playerSession.state === State.LOBBY) {
    throw HTTPError(400, 'Session is in LOBBY or END state');
  }
  const question = playerSession.metadata.questions[questionposition - 1];
  return {
    questionId: question.questionId,
    question: question.question,
    duration: question.duration,
    thumbnailUrl: question.thumbnailUrl,
    points: question.points,
    answers: question.answers.map(answer => {
      return {
        answerId: answer.answerId,
        answer: answer.answer,
        colour: answer.colour
      };
    })
  };
}

function adminSessionQuestionResult(playerId: number, questionposition: number) {
  const data: Data = read();
  const sess = data.sessions.find((session) => {
    if ((session.players.find((player) => player.playerId === playerId))) {
      return session;
    }
  });
  if (sess === undefined) {
    throw HTTPError(400, 'Player does not exist.');
  } else if (questionposition > sess.metadata.numQuestions || questionposition < 1) {
    throw HTTPError(400, 'Question does not exist.');
  } else if (sess.state !== 'ANSWER_SHOW') {
    throw HTTPError(400, 'Answers cannot be shown right now.');
  } else if (sess.atQuestion < questionposition) {
    throw HTTPError(400, 'Session is not up to question yet.');
  }
  // any for time being
  // console.log(sess.metadata.questions[0].attempts)
  return getQuestionResults(data, sess, questionposition);
}

function adminSessionFinalResult(playerId: number) {
  const data: Data = read();
  const sess = data.sessions.find((session) => {
    if ((session.players.find((player) => player.playerId === playerId))) {
      return session;
    }
  });
  // console.log(sess.players)
  if (sess === undefined) {
    throw HTTPError(400, 'Player does not exist.');
  } else if (sess.state !== 'FINAL_RESULTS') {
    throw HTTPError(400, 'Answers cannot be shown right now.');
  }
  const ranking: object[] = [];
  const questionResult = [];
  for (let i = 1; i <= sess.metadata.numQuestions; i++) {
    questionResult.push(getQuestionResults(data, sess, i));
  }

  // find the rankings
  // loop through all the questions
  for (let i = 1; i <= sess.metadata.numQuestions; i++) {
  // first need to find who actually gets points for the question, need to check for a question which answerids must be selected

    // find which answerids must be selected and put it into an array
    const answersNeeded = sess.metadata.questions[i - 1].answers.filter((answer) => answer.correct === true);
    const answersNeededIds = [];
    for (const answer of answersNeeded) {
      answersNeededIds.push(answer.answerId);
    }

    // now find all players who selected everything in the answersNeededIds array
    const correctPlayers = [];
    for (const attempt of sess.metadata.questions[i - 1].attempts) {
      // if the answers array of player === answersNeededIds array then push to correct players
      // JSON.stringify the sorted values to check for array equality
      if (JSON.stringify(attempt.answers.sort((a, b) => a - b)) === JSON.stringify(answersNeededIds.sort((a, b) => a - b))) {
        // correctPlayers.push(attempt.playerName)
        correctPlayers.push(attempt);
        // console.log(correctPlayers)
      }
    }
    // console.log(i)
    // console.log(correctPlayers)
    // if there are no correct players for this question move onto the next question
    if (correctPlayers.length === 0) {
      continue;
    }
    // get the attempts timetaken and sort the players based on fastest to slowest
    correctPlayers.sort((a, b) => a.timeTaken - b.timeTaken);
    console.log(i);
    console.log(correctPlayers);
    // get the scaling factor and the score and add to the players points
    // console.log(correctPlayers)
    for (const correctPlayer of correctPlayers) {
      sess.players.find((player) => player.playerId === correctPlayer.playerId).playerScore += correctPlayer.points * findScalingFactor(correctPlayer.timeTaken, correctPlayers);
    }
    // console.log(sess.players)
  }
  // sort the players by score
  sess.players.sort((a, b) => b.playerScore - a.playerScore);
  for (const player of sess.players) {
    const playerFinalResult = {
      name: player.playerName,
      score: player.playerScore
    };
    ranking.push(playerFinalResult);
  }

  const answer = {
    usersRankedByScore: ranking,
    questionResults: questionResult
  };
  console.log(answer);
  return answer;
}

function adminQuizSessionFinal(token:string | ErrorObject, quizId:number, sessionId:number) {
  const data: Data = read();
  const sess = data.sessions.find((session: { quizSessionId: number; }) => session.quizSessionId === sessionId);
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      throw HTTPError(401, 'Invalid token structure');
      // invalid session
    } else {
      throw HTTPError(403, 'Not a valid session');
    }
  }
  if (!quizActiveCheck(quizId)) {
    throw HTTPError(400, 'Quiz does not exist');
  }
  if (!quizValidOwner(authUserId, quizId)) {
    throw HTTPError(400, 'You do not have access to this quiz');
  }
  if (!quizSessionIdValidCheck(quizId, sessionId)) {
    throw HTTPError(400, 'Session is not valid');
  }

  if (isSessionInFinal(data.sessions, sessionId) === false) {
    throw HTTPError(400, 'Session has not ended');
  }

  const ranking: object[] = [];
  const questionResult = [];
  for (let i = 1; i <= sess.metadata.numQuestions; i++) {
    questionResult.push(getQuestionResults(data, sess, i));
  }

  // find the rankings
  // loop through all the questions
  for (let i = 1; i <= sess.metadata.numQuestions; i++) {
  // first need to find who actually gets points for the question, need to check for a question which answerids must be selected

    // find which answerids must be selected and put it into an array
    const answersNeeded = sess.metadata.questions[i - 1].answers.filter((answer) => answer.correct === true);
    const answersNeededIds = [];
    for (const answer of answersNeeded) {
      answersNeededIds.push(answer.answerId);
    }

    // now find all players who selected everything in the answersNeededIds array
    const correctPlayers = [];
    for (const attempt of sess.metadata.questions[i - 1].attempts) {
      // if the answers array of player === answersNeededIds array then push to correct players
      // JSON.stringify the sorted values to check for array equality
      if (JSON.stringify(attempt.answers.sort((a, b) => a - b)) === JSON.stringify(answersNeededIds.sort((a, b) => a - b))) {
        // correctPlayers.push(attempt.playerName)
        correctPlayers.push(attempt);
        // console.log(correctPlayers)
      }
    }
    // console.log(i)
    // console.log(correctPlayers)
    // if there are no correct players for this question move onto the next question
    if (correctPlayers.length === 0) {
      continue;
    }
    // get the attempts timetaken and sort the players based on fastest to slowest
    correctPlayers.sort((a, b) => a.timeTaken - b.timeTaken);
    // get the scaling factor and the score and add to the players points
    for (const player of correctPlayers) {
      sess.players.find((player) => player.playerId === player.playerId).playerScore += player.points * findScalingFactor(player.timeTaken, correctPlayers);
    }
    // console.log(sess.players)
  }
  // sort the players by score
  sess.players.sort((a, b) => b.playerScore - a.playerScore);
  for (const player of sess.players) {
    const playerFinalResult = {
      name: player.playerName,
      score: player.playerScore
    };
    ranking.push(playerFinalResult);
  }

  const answer = {
    usersRankedByScore: ranking,
    questionResults: questionResult
  };
  // console.log(answer.questionResults[0].questionCorrectBreakdown)
  // console.log(answer)
  return answer;
}

function adminQuizSessionFinalCsv(token:string | ErrorObject, quizId:number, sessionId:number) {
  const data: Data = read();
  const sess = data.sessions.find((session: { quizSessionId: number; }) => session.quizSessionId === sessionId);
  const authUserId = tokenOwner(token);
  if (typeof authUserId !== 'number') {
    if (authUserId.error === 'Invalid token structure') {
      throw HTTPError(401, 'Invalid token structure');
      // invalid session
    } else {
      throw HTTPError(403, 'Not a valid session');
    }
  }
  if (!quizActiveCheck(quizId)) {
    throw HTTPError(400, 'Quiz does not exist');
  }
  if (!quizValidOwner(authUserId, quizId)) {
    throw HTTPError(400, 'You do not have access to this quiz');
  }
  if (!quizSessionIdValidCheck(quizId, sessionId)) {
    throw HTTPError(400, 'Session is not valid');
  }

  if (isSessionInFinal(data.sessions, sessionId) === false) {
    throw HTTPError(400, 'Session has not ended');
  }

  return {};
}

function adminQuizSessionsView(token: string | ErrorObject, quizId: number) {
  // const authUserId = tokenOwner(token);
  // if (typeof authUserId !== 'number') {
  //   if (authUserId.error === 'Invalid token structure') {
  //     throw HTTPError(401, 'Invalid token structure');
  //     // invalid session
  //   } else {
  //     throw HTTPError(403, 'Not a valid session');
  //   }
  // }
  const quizSessions = getSessions(quizId);
  let activeSessions = quizSessions.filter(session => session.state !== State.END).map(session => session.quizSessionId);
  let inactiveSessions = quizSessions.filter(session => session.state === State.END).map(session => session.quizSessionId);
  activeSessions = activeSessions.sort((a, b) => a - b);
  inactiveSessions = inactiveSessions.sort((a, b) => a - b);
  return {
    activeSessions,
    inactiveSessions,
  };
}
export {
  adminQuizSessionStart, adminQuizSessionStateUpdate, QuizSessionPlayerJoin, QuizSessionPlayerStatus, adminSessionChatSend, adminSessionChatView,
  playerAnswerSubmit, playerQuestionInfo, adminQuizSessionState, adminSessionQuestionResult, adminSessionFinalResult, adminQuizSessionFinal, 
  adminQuizSessionFinalCsv, adminQuizSessionsView
};
