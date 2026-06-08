const {loginSvc, register} = require('./auth.service');

const login = async (req, res) => {
  const payload = await req.body;
  if (!payload) {
    return res.json({ msg: "Please send some data" });
  }
  const { email, password } = payload;

  const response = await loginSvc(email, password) || await {msg: "nothing"};

  return res.json(response);
};

const signup = async (req, res) => {
  const payload = await req.body;
  if (!payload) {
    return res.json({ msg: "Please send some data" });
  }
  const response = await register(payload) || await {msg: "nothing"};

  return res.json(response);
};

module.exports = {
  login,
  signup,
};
