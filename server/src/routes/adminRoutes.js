const express = require("express");
const {
  getDashboardStats,
  getAllUsers
} = require("../controllers/adminController");

const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);

module.exports = router;