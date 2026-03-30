const User = require("../models/User");
const Blog = require("../models/Blog");
const bcrypt = require("bcryptjs");

// Get current user profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

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

// Update current user profile
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //  Check email uniqueness
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return res.status(400).json({
          message: "Email is already in use",
        });
      }

      user.email = email.toLowerCase();
    }

    // update name
    if (name) {
      user.name = name;
    }

    // update password
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

// Get my blogs
exports.getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user._id });

    const totalPosts = blogs.length;

    const totalLikes = blogs.reduce((sum, blog) => {
      return sum + blog.likes.length;
    }, 0);

    const totalComments = 0; // we can improve this in next step

    return res.status(200).json({
      totalPosts,
      totalLikes,
      totalComments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};