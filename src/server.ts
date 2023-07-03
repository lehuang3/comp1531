import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import { adminAuthRegister, adminUserDetails, adminAuthLogin } from './auth';
import { adminQuizCreate, adminQuizDescriptionUpdate } from './quiz';
import { clear } from './other';
import { ErrorObject, TokenParameter } from './interfaces';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync('./swagger.yaml', 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';
// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  const ret = echo(data);
  if ('error' in ret) {
    res.status(400);
  }
  return res.json(ret);
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const token = req.query.token;
  const response = adminUserDetails(token);
  if ('error' in response) {
    if (response.error === 'Invalid token structure') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    }
  }
  res.json(response);
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  const response = clear();
  res.json(response);
});

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast} = req.body;
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
  const { token,name,description} = req.body;
  const response = adminQuizCreate(token, name, description);
  if ('error' in response) {
    if (response.error === 'Token is not valid') {
      return res.status(401).json(response);
    } else if (response.error === 'Not a valid session') {
      return res.status(403).json(response);
    } else if (response.error === 'Quiz name is not valid') {
      return res.status(400).json(response);
    }else if (response.error === 'Quiz name length is not valid') {
      return res.status(400).json(response);
    }else if (response.error === 'Quiz name is taken') {
      return res.status(400).json(response);
    }else if (response.error === 'Quiz description is not valid') {
      return res.status(400).json(response);
    }
  }
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

app.get('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const token = req.body
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

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
