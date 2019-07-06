const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    status: res.statusCode,
    error: err.message
  });
};

const error404 = (req, res) => res.status(404).json({
  status: res.statusCode,
  message: 'Not Found!'
});


export { errorHandler, error404 };
