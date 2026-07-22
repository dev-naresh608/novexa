const express = require("express");
const router = express.Router();

const { isAdmin } = require("./middleware/isAdmin");
const { isSuperAdmin } = require("./middleware/isSuperAdmin");

const { dashboardRoute } = require("./dashboard/dashboard.routes");
const { adminsRoute } = require("./admins/admin.routes");
const { profileRoute } = require("./profile/profile.routes");
const { analyticsRoute } = require("./analytics/analytics.routes");
const { settingsRoute } = require("./settings/settings.routes");
const { activityRoute } = require("./activityLogs/activity.routes");

router.get("/",isSuperAdmin, (req, res) => {
  try {
    return res.status(200).json({ success: true, message: "api working" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.use("/dashboard", isAdmin, dashboardRoute);
router.use("/admins", isSuperAdmin, adminsRoute);
router.use("/profile", isAdmin, profileRoute);
router.use("/analytics", isAdmin, analyticsRoute);
router.use("/settings", isSuperAdmin, settingsRoute);
router.use("/activity", isAdmin, activityRoute);

module.exports = {
  adminRoute: router,
};
