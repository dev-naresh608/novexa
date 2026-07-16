const { profileWorkingService } = require("./profile.service");

const getProfileWorking = async (req, res) => {
  try {
    const response = await profileWorkingService();
    return res.status(200).json({ message: response.message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfileWorking,
};
