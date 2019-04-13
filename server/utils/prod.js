import helmet from 'helmet';
import compression from 'compression';

const prod = (app) => {
  app.use(helmet());
  app.use(compression());
};

export default prod;
