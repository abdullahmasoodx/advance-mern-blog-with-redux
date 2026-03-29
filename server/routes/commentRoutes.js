const express = require("express");
const router = express.Router();

const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");

// Add comment
router.post("/:blogId", protect, addComment);

// Get comments
router.get("/:blogId", getComments);

// Delete comment
router.delete("/:id", protect, deleteComment);

module.exports = router;