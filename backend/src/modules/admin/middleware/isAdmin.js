const isAdmin = (req, res, next) => {
  // Middleware checking for admin status
  next();
};

module.exports = { isAdmin };
