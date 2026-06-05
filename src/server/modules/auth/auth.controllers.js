const login = async (req, res) => {
  const payload = await req.body;

  if(!payload){
    return res.json({msg: "Please send some data"})
  }

  const response = {
    isValidUser: true,
  }

  return res.json(response);
};

const signup = async (req, res) => {
  return res.send('Sign up');
};

module.exports = {
  login,signup
}