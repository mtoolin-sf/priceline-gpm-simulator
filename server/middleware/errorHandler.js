function errorHandler(err, req, res, next) {
  console.error(err.message, err.data || '');
  res.status(err.status || 500).json({
    error: err.message,
    detail: err.data || null,
  });
}

module.exports = errorHandler;
