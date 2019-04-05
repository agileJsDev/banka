import config from 'config';

// Configuration
export default () => {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
  }
};
