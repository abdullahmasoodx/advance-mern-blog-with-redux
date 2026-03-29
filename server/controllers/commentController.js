const Comment = require("../models/Comment");

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const comment = await Comment.create({
      text,
      blog: req.params.blogId,
      user: req.user._id,
    });

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

// Get comments for a blog
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      blog: req.params.blogId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this comment",
      });
    }

    await comment.deleteOne();

    return res.status(200).json({
      message: "Comment deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};