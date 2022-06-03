import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { corsUrl, environment } from './config';
import './database'; // initialize database
import { NotFoundError, ApiError, InternalError } from './core/ApiError';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import * as swaggerFile from "../swagger-output.json";

process.on('uncaughtException', (e) => {
  console.error(e);
});

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
// Routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (environment === 'development') {
      console.error(err);
      return res.status(500).send(err.message);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
