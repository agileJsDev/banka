import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import cors from 'cors';
import router from './routes';
import { errorHandler, error404 } from './helpers/error';
import startup from './utils/startup';
// import { dbTableSetup } from './db';

// dbTableSetup();
const swaggerDoc = YAML.load(path.join(process.cwd(), './server/docs/docs.yml'));
const app = express();
app.use(express.json());
startup(app);
app.use(cors());
app.use('/api/v1', router);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(errorHandler);
app.use(error404);

const port = process.env.PORT || 8000;
app.listen(port, console.log(`Server running on PORT ${port}`));

export default app;
