import 'reflect-metadata';

import express from 'express';
import bodyParser from 'body-parser';

import routes from './routes';
import './database';
import uploadConfig from './config/upload';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
