const { activityWorkingService } = require("./activity.service");

const getActivityWorking = async (req, res) => {
  try {
    const response = await activityWorkingService();
    return res.status(200).json({ message: response.message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActivityWorking,
};
