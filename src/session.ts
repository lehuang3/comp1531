import { State, Data, ErrorObject, Action } from './interfaces';
import { save, read, tokenOwner, quizActiveCheck, quizValidOwner, activeSessions, quizHasQuestion, generateSessionId,
quizSessionIdValidCheck, isActionApplicable,isSessionInLobby,nameExistinSession,generateRandomName
} from './other';
import HTTPError from 'http-errors';
interface SessionIdReturn {
  sessionId: number;
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
          answers: question.answers,
          questionCorrectBreakdown: [],
          // default value of averageAnswerTime
          averageAnswerTime: 0,
          // default value of percentCorrect
          percentCorrect: 0,
        };
      }),
      duration: quiz.duration,
    },
    quizSessionId: newSessionId,
    state: State.LOBBY,
    autoStartNum: autoStartNum,
    // this value = 0 in LOBBY state
    atQuestion: 0,
    messages: [],
    players: [],
  });
  save(data);
  return {
    sessionId: newSessionId,
  };
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
  if (!isActionApplicable(sessionId, action).applicable) {
    throw HTTPError(400, 'Action is not applicable');
  }

  const nextState = isActionApplicable(sessionId, action).nextState;
  for (const session of data.sessions) {
    if (session.quizSessionId === sessionId) {
      session.state = nextState;
    }
  }
  save(data);
  return {};
}


function adminSessionChatSend(playerId: number, message: string) {
  const data: Data = read();
  const playerMatch = data.sessions.filter((session) => {
    session.players.filter((player) => player.playerId === playerId)
  })
  if (playerMatch.length === 0) {
    throw HTTPError(400, 'Player does not exist.')
  } else if (message.length < 1 || message.length > 100) {
    throw HTTPError(400, 'Message length must be greater than 0 and less than 101.')
  }

  // check this section
  const newMessage = {
    playerId: playerId,
    messageBody: message,
    playerName: 1,
    timeSent: Math.floor(Date.now() / 1000)
  }
  //const session = data.sessions.filter((session) => session.players.includes())
  return {}
}

function QuizSessionPlayerJoin(sessionId:number,name:string) {

  const data: Data = read();
  if (isSessionInLobby(data.sessions,sessionId)===false) {
    throw HTTPError(400, 'Session not in lobby');
  } 
  if(name.length > 0){
    if(nameExistinSession(data.sessions,name,sessionId) === true){
      throw HTTPError(400, 'Name Taken');
    } 
  } else {
    name = generateRandomName();
  }

  let maxplayerId = 0;
  
  for (let session of data.sessions) {

    for (let player of session.players) {
      console.log(player.playerId)
      if (player.playerId > maxplayerId) {
        maxplayerId = player.playerId;
      }
    }
  }
  
  maxplayerId++;
  let newPlayer = {
    playerId: maxplayerId,
    playerName:name,
    playerScore:0
  }
  let session = data.sessions.find((session:any) => session.quizSessionId === sessionId);
  
  session.players.push(newPlayer);
  if(session.players.length === session.autoStartNum){
    session.state = State.QUESTION_COUNTDOWN;
  }
  console.log(session)
  save(data);
  
  return {playerId:maxplayerId};
}

function QuizSessionPlayerStatus(playerId:Number){
  const data: Data = read();
  for (const session of data.sessions) {
    const player = session.players.find((player) => player.playerId === playerId);
    if (player) {
      return {
        state:session.state,
        numQuestions:session.metadata.numQuestions,
        atQuestion:session.atQuestion
      };
    }
  }
  throw HTTPError(400, 'Player does not exits');
}

export { adminQuizSessionStart, adminQuizSessionStateUpdate, QuizSessionPlayerJoin, QuizSessionPlayerStatus, adminSessionChatSend };

