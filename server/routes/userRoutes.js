const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  getMyBlogs,
  getDashboardStats,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/my-blogs", protect, getMyBlogs);
router.get("/dashboard/stats", protect, getDashboardStats);

module.exports = router;