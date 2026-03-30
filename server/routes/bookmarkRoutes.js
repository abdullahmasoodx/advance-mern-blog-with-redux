const express = require("express");
const router = express.Router();

const {
  toggleBookmark,
  getSavedBlogs,
} = require("../controllers/bookmarkController");

const { protect } = require("../middleware/authMiddleware");

// toggle bookmark
router.put("/:id", protect, toggleBookmark);

// get saved blogs
router.get("/", protect, getSavedBlogs);

module.exports = router;