import express from 'express';
import chalk from 'chalk';
import figlet from 'figlet';
import path from 'node:path';
import { engine } from 'express-handlebars';

import router from './router';
import cors from './middlewares/cors';
import updateDatabaseName from './middlewares/updateDatabaseName';
import errorHandler from './middlewares/errorHandler';

import {
  paymentsAccountJob,
  receivablesAccountJob
} from './app/jobs/FinancialJob';

import './lib/socket';

const app = express();
const PORT = process.env.PORT || 3002;

app.use('/', express.static(path.resolve(__dirname, '..', 'src', 'public')));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, '..', 'src', 'app', 'views'));

app.use(express.json());
app.use(cors);
app.use(updateDatabaseName);
app.use(router);
app.use(errorHandler);

paymentsAccountJob.start();
receivablesAccountJob.start();

app.listen(PORT, () => {
  console.log('\n');
  console.log(chalk.green(figlet.textSync('GSafra', {
    font: 'ANSI Regular',
  })));
  console.log(chalk.bold(`Servidor iniciado em http://localhost:${PORT}`));
});
