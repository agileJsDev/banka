const permission = (role) => {
  const authorization = (req, res, next) => {
    if (req.user.type === 'staff' && req.user.isAdmin === role.isAdmin) return next();
    if (req.user.type === 'staff' && role.isAdmin === undefined) return next();

    return res.status(403).json({
      status: res.statusCode,
      error: 'Unauthorized'
    });
  };
  return authorization;
};

export default {
  staff: permission({ isAdmin: undefined }),
  cashier: permission({ isAdmin: false }),
  admin: permission({ isAdmin: true })
};
