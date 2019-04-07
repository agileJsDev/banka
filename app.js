import express from 'express';
import router from './server/routes';
import errorHandler from './server/helpers/error';
import config from './server/startup/config';

config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.status(200).json({
  status: res.statusCode,
  data: 'Welcome to Banka Default'
}));

app.use('/api/v1', router);
app.use(errorHandler);

const port = process.env.PORT || 9000;
app.listen(port, console.log('Server running...!!!'));

export default app;
