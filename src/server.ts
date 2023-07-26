import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import { adminAuthRegister, adminUserDetails, adminAuthLogin, adminAuthPasswordUpdate, adminAuthLogout, adminAuthDetailsUpdate } from './auth';
import {
  adminQuizCreate, adminQuizDescriptionUpdate, adminQuizRemove, adminQuizNameUpdate, adminQuizList, adminQuizInfo, adminQuizTrash,
  adminQuizTransfer, adminQuizRestore, adminQuizQuestionCreate, adminQuizQuestionMove, adminQuizQuestionDuplicate, adminQuizQuestionDelete, adminQuizQuestionUpdate,
  adminQuizTrashEmpty, adminQuizThumbnailUpdate
} from './quiz';
import { adminQuizSessionStart, adminQuizSessionStateUpdate, QuizSessionPlayerJoin, QuizSessionPlayerStatus, adminSessionChatSend, adminSessionChatView,
playerAnswerSubmit, playerQuestionInfo,adminQuizSessionState
} from './session';
import { clear } from './other';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
app.use(errorHandler());
// Use middleware that allows for access from other domains
app.use(cors());
// for producing the docs that define the API
const file = fs.readFileSync('./swagger.yaml', 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// for logging errors (print to terminal)
app.use(morgan('dev'));

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminUserDetails(token);
  res.json(response);
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const response = adminUserDetails(token);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      res.status(403).json(response);
    }
  }
  res.json(response);
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  const response = clear();
  res.json(response);
});

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const response = adminAuthRegister(email, password, nameFirst, nameLast);
  if ('error' in response) {
    return res.status(400).json(response);
  }
  res.json(response);
});

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response = adminAuthLogin(email, password);
  if ('error' in response) {
    return res.status(400).json(response);
  }
  res.json(response);
});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  const response = adminQuizCreate(token, name, description);

  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else if (response.error === 'Quiz name is not valid') {
      return res.status(400).json(response);
    } else if (response.error === 'Quiz name length is not valid') {
      return res.status(400).json(response);
    } else if (response.error === 'Quiz name is taken') {
      return res.status(400).json(response);
    } else if (response.error === 'Quiz description is not valid') {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const { name, description } = req.body;
  const token = req.header('token');
  const response = adminQuizCreate(token, name, description);
  res.json(response);
});

app.get('/v1/admin/quiz/:quizId/session/:sessionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const sessionId = parseInt(req.params.sessionId);
  const token = req.header('token');
  const response = adminQuizSessionState(token, quizId, sessionId);
  res.json(response);
});

app.post('/v1/admin/quiz/:quizId/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const { token, questionBody } = req.body;
  const response = adminQuizQuestionCreate(token, quizId, questionBody);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.post('/v2/admin/quiz/:quizId/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const token = req.header('token');
  const { questionBody } = req.body;
  const response = adminQuizQuestionCreate(token, quizId, questionBody);
  res.json(response);
});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const response = adminQuizList(token);

  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    }
  }
  res.json(response);
});

app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.header('token');
  const response = adminQuizList(token);

  res.json(response);
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminQuizTrash(token);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    }
  }
  res.json(response);
});

app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminQuizTrash(token);
  res.json(response);
});

app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.query.token as string;
  const response = adminQuizRemove(token, quizId);
  if ('error' in response) {
    if (response.error === 'Token is not valid') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'User id not valid') {
      return res.status(400).json(response);
    } else if (response.error === 'quiz id not valid') {
      return res.status(400).json(response);
    } else if (response.error === 'Not owner of quiz') {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.delete('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.header('token');
  const response = adminQuizRemove(token, quizId);

  res.json(response);
});

app.put('/v1/admin/quiz/:quizId/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const { token, description } = req.body;
  const response = adminQuizDescriptionUpdate(token, quizId, description);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.put('/v2/admin/quiz/:quizId/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const { description } = req.body;
  const token = req.headers.token as string;
  const response = adminQuizDescriptionUpdate(token, quizId, description);
  res.json(response);
});

app.get('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const token = req.query.token as string;
  const response = adminQuizInfo(token, quizId);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.put('/v1/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const { token, name } = req.body;
  const response = adminQuizNameUpdate(token, quizId, name);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.post('/v1/admin/quiz/:quizId/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const { token, userEmail } = req.body;
  const response = adminQuizTransfer(token, quizId, userEmail);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.post('/v2/admin/quiz/:quizId/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const token = req.headers.token as string;
  const { userEmail } = req.body;
  const response = adminQuizTransfer(token, quizId, userEmail);
  res.json(response);
});

app.post('/v1/admin/quiz/:quizId/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const { token } = req.body;
  const response = adminQuizRestore(token, quizId);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.put('/v1/admin/quiz/:quizId/question/:questionId/move', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const { token, newPosition } = req.body;
  const response = adminQuizQuestionMove(quizId, questionId, token, newPosition);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.put('/v2/admin/quiz/:quizId/question/:questionId/move', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.header('token');
  const { newPosition } = req.body;
  const response = adminQuizQuestionMove(quizId, questionId, token, newPosition);
  res.json(response);
});

app.delete('/v1/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.query.token as string;
  const response = adminQuizQuestionDelete(token, quizId, questionId);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.post('/v1/admin/quiz/:quizId/question/:questionId/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const { token } = req.body;
  const response = adminQuizQuestionDuplicate(quizId, questionId, token);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.post('/v2/admin/quiz/:quizId/question/:questionId/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.header('token');
  const response = adminQuizQuestionDuplicate(quizId, questionId, token);
  res.json(response);
});

app.put('/v1/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const { token, questionBody } = req.body;
  const response = adminQuizQuestionUpdate(token, quizId, questionId, questionBody);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const quizIdArr = JSON.parse(req.query.quizIdArr as string);
  const token = req.query.token as string;
  const response = adminQuizTrashEmpty(token, quizIdArr);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const quizIdArr = JSON.parse(req.query.quizIdArr as string);
  const token = req.headers.token as string;
  const response = adminQuizTrashEmpty(token, quizIdArr);
  res.json(response);
});

app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const { token } = req.body;
  const response = adminAuthLogout(token);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else {
      return res.status(403).json(response);
    }
  }
  res.json(response);
});

app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminAuthLogout(token);
  res.json(response);
});

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  const response = adminAuthPasswordUpdate(token, oldPassword, newPassword);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const { oldPassword, newPassword } = req.body;
  const response = adminAuthPasswordUpdate(token, oldPassword, newPassword);
  res.json(response);
});

app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  const response = adminAuthDetailsUpdate(token, email, nameFirst, nameLast);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const { email, nameFirst, nameLast } = req.body;
  const token = req.header('token');
  const response = adminAuthDetailsUpdate(token, email, nameFirst, nameLast);
  res.json(response);
});

app.get('/v2/admin/quiz/:quizId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const token = req.header('token');
  const response = adminQuizInfo(token, quizId);
  res.json(response);
});

app.put('/v2/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const token = req.header('token');
  const { name } = req.body;
  const response = adminQuizNameUpdate(token, quizId, name);
  res.json(response);
});

app.post('/v2/admin/quiz/:quizId/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const token = req.header('token');
  const response = adminQuizRestore(token, quizId);
  res.json(response);
});

app.put('/v2/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.header('token');
  const questionBody = req.body.questionBody;
  const response = adminQuizQuestionUpdate(token, quizId, questionId, questionBody);
  res.json(response);
});

app.delete('/v2/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.header('token');
  const response = adminQuizQuestionDelete(token, quizId, questionId);
  res.json(response);
});

app.post('/v1/admin/quiz/:quizId/session/start', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const token = req.header('token');
  const { autoStartNum } = req.body;
  const response = adminQuizSessionStart(token, quizId, autoStartNum);
  res.json(response);
});

app.post('/v1/player/join', (req: Request, res: Response) => {
  const { sessionId, name } = req.body;
  const response = QuizSessionPlayerJoin(sessionId, name);
  res.json(response);
});

app.get('/v1/player/:playerId', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerId);
  const response = QuizSessionPlayerStatus(playerId);
  res.json(response);
});

app.put('/v1/admin/quiz/:quizId/session/:sessionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const sessionId = parseInt(req.params.sessionId);
  const token = req.header('token');
  const { action } = req.body;
  const response = adminQuizSessionStateUpdate(token, quizId, sessionId, action);
  res.json(response);
});

app.put('/v1/admin/quiz/:quizId/thumbnail', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const imgUrl = req.body.imgUrl;
  const token = req.header('token');
  const response = adminQuizThumbnailUpdate(token, quizId, imgUrl);
  res.json(response);
});

app.put('/v1/player/:playerId/question/:questionposition/answer', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerId);
  const questionposition = parseInt(req.params.questionposition);
  const { answerIds } = req.body;
  const response = playerAnswerSubmit(playerId, questionposition, answerIds);
  res.json(response);
});

app.get('/v1/player/:playerId/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerId);
  const response = adminSessionChatView(playerId);
  res.json(response);
});

app.post('/v1/player/:playerId/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerId);
  const message = req.body.message;
  const response = adminSessionChatSend(playerId, message);
  res.json(response);
});

app.get('/v1/player/:playerId/question/:questionposition', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerId);
  const questionposition = parseInt(req.params.questionposition);
  const response = playerQuestionInfo(playerId, questionposition);
  res.json(response);
});

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
