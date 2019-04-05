import jwt from 'jsonwebtoken';
import config from 'config';

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    res.status(401).json({
      status: res.statusCode,
      error: 'Access Denied. No Token Provided'
    });
    return;
  }
  try {
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

export default auth;
