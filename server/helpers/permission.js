const permission = (req, res, next) => {
  if (req.user.type === 'staff' && req.user.isAdmin === false) {
    return next();
  }

  if (req.user.type === 'staff' && req.user.isAdmin === true) {
    return next();
  }

  return res.status(403).json({
    status: res.statusCode,
    error: 'Unauthorized'
  });
};

export default permission;
