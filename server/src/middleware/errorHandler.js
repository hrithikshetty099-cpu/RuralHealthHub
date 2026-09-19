export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  console.error('Server error:', err);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
