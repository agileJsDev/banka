import config from 'config';

// Configuration
export default () => {
  if (!config.get('jwtPrivateKey') && !config.get('DATABASE_URL')) {
    throw new Error('FATAL ERROR: jwtPrivateKey or database url is not defined');
  }
};
