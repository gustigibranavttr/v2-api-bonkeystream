const { error } = require('./responseWrapper');

/**
 * Global error handler middleware.
 */
function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  return error(res, 'Something went wrong', 500, err);
}

module.exports = errorHandler;
