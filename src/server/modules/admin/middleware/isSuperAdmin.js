const isSuperAdmin = (req, res, next) => {
  // Middleware checking for super admin status
  next();
};

module.exports = { isSuperAdmin };
