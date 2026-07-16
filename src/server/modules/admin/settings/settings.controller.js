const { settingsWorkingService } = require("./settings.service");

const getSettingsWorking = async (req, res) => {
  try {
    const response = await settingsWorkingService();
    return res.status(200).json({ message: response.message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettingsWorking,
};
