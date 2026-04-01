const User = require("../models/User");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

// Get single user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

// Get all blogs
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

// Delete any blog
exports.deleteBlogAdmin = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    await blog.deleteOne();

    return res.status(200).json({
      message: "Blog deleted successfully by admin",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

// Admin dashboard stats
exports.getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalComments = await Comment.countDocuments();

    const totalLikesAgg = await Blog.aggregate([
      {
        $project: {
          likesCount: { $size: { $ifNull: ["$likes", []] } },
        },
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likesCount" },
        },
      },
    ]);
    const totalLikes =
      totalLikesAgg.length > 0 ? totalLikesAgg[0].totalLikes : 0;

    return res.status(200).json({
      totalUsers,
      totalBlogs,
      totalComments,
      totalLikes,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};
