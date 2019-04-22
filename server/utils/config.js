import config from 'config';

// Configuration
export default () => {
  if (!config.get('jwtPrivateKey') && !config.get('db')) {
    throw new Error('FATAL ERROR: jwtPrivateKey or database url is not defined');
  }
};
