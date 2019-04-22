const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    status: res.statusCode,
    error: err.message
  });
};

export default errorHandler;
