exports.errorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON format", details: err.message });
  }
  // Default error
  return res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
};
