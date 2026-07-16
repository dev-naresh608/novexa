const { dashboardWorkingService } = require("./dashboard.service");

const getDashboardWorking = async (req, res) => {
  try {
    const response = await dashboardWorkingService();
    return res.status(200).json({ message: response.message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardWorking,
};
