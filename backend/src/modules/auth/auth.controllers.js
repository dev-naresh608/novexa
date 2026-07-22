const { userLoginSvc, userSignupSvc, getMeSvc } = require("./auth.service");
const login = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload) {
      return res
        .status(400)
        .json({ success: false, message: "Please send some data" });
    }
    const { email, password } = payload;

    const response = await userLoginSvc(email, password);
        
    if (!response || !response.success) {
      return res
        .status(200)
        .json(response || { success: false, message: "Login failed" });
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
      return res
        .status(400)
        .json({ success: false, message: "Please send some data" });
    }
    const response = await userSignupSvc(payload);

    if (!response) {
      return res.status(400).json(response);
    }

    const { accessToken, refreshToken, username, email } = response;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      user: {
        username,
        email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const refreshToken = async (req, res) => {};

const getMe = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({
      message: "Access Token Not Found",
    });
  }

  const response = await getMeSvc(accessToken);

  return res.status(200).json({
    message: "success",
    response
  });
};

module.exports = {
  login,
  signup,
  refreshToken,
  getMe,
};
