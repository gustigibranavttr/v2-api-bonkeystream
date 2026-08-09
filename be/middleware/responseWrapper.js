/**
 * Wraps response data in a consistent JSON envelope.
 */
function success(res, data, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data
  });
}

function error(res, message = 'Internal Server Error', statusCode = 500, err = null) {
  const response = {
    success: false,
    statusCode,
    message
  };
  if (err && process.env.NODE_ENV !== 'production') {
    response.error = err.message || String(err);
  }
  return res.status(statusCode).json(response);
}

module.exports = { success, error };
