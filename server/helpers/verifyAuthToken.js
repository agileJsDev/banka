import jwt from 'jsonwebtoken';
import config from 'config';

const checkAuthToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;

  if (!token) {
    res.status(401).json({
      status: res.statusCode,
      error: 'Access Denied. No Token Provided'
    });
    return;
  }
  try {
    if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      status: res.statusCode,
      error: 'Invalid Token'
    });
  }
};

export default checkAuthToken;
