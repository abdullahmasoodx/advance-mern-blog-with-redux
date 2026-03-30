const User = require("../models/User");
const Blog = require("../models/Blog");

// Save / Unsave blog
exports.toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const blogId = req.params.id;
    // check blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const alreadySaved = user.savedBlogs.some(
      (id) => id.toString() === blogId
    );

    if (alreadySaved) {
      user.savedBlogs = user.savedBlogs.filter(
        (id) => id.toString() !== blogId
      );

      await user.save();

      return res.status(200).json({
        message: "Blog removed from bookmarks",
        savedBlogs: user.savedBlogs,
      });
    }

    user.savedBlogs.push(blogId);
    await user.save();

    return res.status(200).json({
      message: "Blog saved successfully",
      savedBlogs: user.savedBlogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

exports.getSavedBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "savedBlogs"
    );

    return res.status(200).json(user.savedBlogs);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};