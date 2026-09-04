const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    err.statusCode = 409;
    err.data = { message: 'A record with this value already exists' };
  }

  if (err.name === 'SequelizeValidationError') {
    err.statusCode = 400;
    err.data = { errors: err.errors.map((item) => ({ field: item.path, message: item.message })) };
  }

  if (err.name === 'MulterError') {
    err.statusCode = 400;
    err.data = { message: err.message };
  }

  const statusCode = err.statusCode || 500;

  if (statusCode >= 400 && statusCode < 500){
    return res.status(statusCode).json({
      status: 'fail',
      data: err.data || {
        message: err.message,
      },
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

module.exports = errorHandler;
