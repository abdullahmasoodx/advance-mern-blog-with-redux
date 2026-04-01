const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  deleteUser,
  getAllBlogsAdmin,
  deleteBlogAdmin,
  getAdminDashboardStats,
} = require("../controllers/adminController");

const { protect, admin } = require("../middleware/authMiddleware");

router.get("/users", protect, admin, getAllUsers);
router.get("/users/:id", protect, admin, getUserById);
router.delete("/users/:id", protect, admin, deleteUser);

router.get("/blogs", protect, admin, getAllBlogsAdmin);
router.delete("/blogs/:id", protect, admin, deleteBlogAdmin);

router.get("/dashboard/stats", protect, admin, getAdminDashboardStats);

module.exports = router;