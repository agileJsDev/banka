import helmet from 'helmet';
import compression from 'compression';
import bcrypt from 'bcrypt';
import userModel from '../models/users';

const data = {
  email: 'admin@banka.com',
  firstName: 'Ayodeji',
  lastName: 'Banka',
  role: '1'
};

const startup = async (app) => {
  const email = await userModel.findEmail(data.email);
  if (!email) {
    data.password = await bcrypt.hash('BankaAdmin2019', 10);
    await userModel.createAdminUser(data);
  }
  app.use(helmet());
  app.use(compression());
};


export default startup;
