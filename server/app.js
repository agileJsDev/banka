import express from 'express';
import router from './routes';
import errorHandler from './helpers/error';
import config from './utils/config';
import prod from './utils/prod';

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

prod(app);

const port = process.env.PORT || 9000;
app.listen(port, console.log(`Server running on PORT ${port}`));

export default app;
