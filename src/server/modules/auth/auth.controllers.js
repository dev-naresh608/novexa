const { userLoginSvc, userSignupSvc } = require("./auth.service");

const login = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload) {
      return res.status(400).json({ success: false, message: "Please send some data" });
    }
    const { email, password } = payload;

    const response = await userLoginSvc(email, password);

    if (!response || !response.success) {
      return res.status(400).json(response || { success: false, message: "Login failed" });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const signup = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload) {
      return res.status(400).json({ success: false, message: "Please send some data" });
    }
    const response = await userSignupSvc(payload);

    if (!response.success) {
      return res.status(400).json(response);
    }

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
  signup,
};
