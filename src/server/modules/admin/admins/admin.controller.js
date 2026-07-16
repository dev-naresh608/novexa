const { adminsWorkingService } = require("./admin.service");

const getAdminsWorking = async (req, res) => {
  try {
    const response = await adminsWorkingService();
    return res.status(200).json({ message: response.message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminsWorking,
};
