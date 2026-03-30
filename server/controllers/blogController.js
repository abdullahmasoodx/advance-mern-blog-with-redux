const Blog = require("../models/Blog");
const { create } = require("../models/User");

exports.createBlog = async (req, res) => {
  try {
    const { title, content, category, tags, image } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
    const blogTags = tags ? tags.split(",").map((tag) => tag.trim()) : [];
    const blog = await Blog.create({
      title,
      content,
      category,
      tags: blogTags,
      image: imagePath,
      user: req.user._id,
    });

    return res.status(201).json(blog);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};
exports.getBlogs = async (req, res) => {
  try {
    // query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const tag = req.query.tag || "";

    const skip = (page - 1) * limit;

    // build filter object
    let filter = {};

    // search (title + content)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // category filter
    if (category) {
      filter.category = category;
    }

    // tag filter
    if (tag) {
      filter.tags = tag;
    }

    // query
    const blogs = await Blog.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    return res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      blogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "user",
      "name email role",
    );
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, content, category, tags, image } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (
      blog.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to update this blog",
      });
    }

    blog.title = title ?? blog.title;
    blog.content = content ?? blog.content;
    blog.category = category ?? blog.category;
    blog.tags = tags ?? blog.tags;
    blog.image = image ?? blog.image;
    blog.image = imagePath || blog.image;

    const updatedBlog = await blog.save();
    return res.status(200).json(updatedBlog);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};
// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (
      blog.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this blog",
      });
    }

    await blog.deleteOne();

    return res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

// Like or unliok blog

exports.toggleLikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = blog.likes.some((id) => id.toString() === userId);
    if (alreadyLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
      await blog.save();

      return  res.status(200).json({
        message: "Blog unliked suscessfully",
        likeCount: blog.likes.length,
        likes:blog.likes,
      });

    } else {
      
      blog.likes.push(userId);
      await blog.save();

      return res.status(200).json({
        message: "Blog liked successfully",
        likeCount: blog.likes.length,
        likes: blog.likes,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};
