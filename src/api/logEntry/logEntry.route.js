const { Router } = require("express");
const router = Router();
const LogEntry = require("../../models/logEntry");
const tryCatchWrapper = require("../../helpers");
const { isAdmin } = require("../../middlewares");

router.get(
  "/",
  tryCatchWrapper(async (req, res, next) => {
    const query =
      req.user.role === "admin" ? {} : { createdByUser: req.user.userId };
    const logEntries = await LogEntry.find(query);
    res.status(200).json(logEntries);
  })
);

router.delete(
  "/",
  isAdmin,
  tryCatchWrapper(async (req, res, next) => {
    await LogEntry.deleteMany();
    res.status(201).json({ message: "ok" });
  })
);

router.post(
  "/",
  tryCatchWrapper(async (req, res, next) => {
    const logEntry = {
      ...req.body,
      createdByUser: req.user.userId,
    };
    const log = await LogEntry.create(logEntry);
    res.status(201).json(log);
  })
);

module.exports = router;
