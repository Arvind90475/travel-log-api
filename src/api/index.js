const { Router } = require("express");

const auth = require("./auth/auth.route");
const admin = require("./admin/admin.route");
const logEntry = require("./logEntry/logEntry.route");

const { isLoggedIn, isAdmin } = require("../middlewares");

const router = Router();

router.use("/auth", auth);
router.use("/logs", isLoggedIn, logEntry);
router.use("/admin", isLoggedIn, isAdmin, admin);

module.exports = router;
