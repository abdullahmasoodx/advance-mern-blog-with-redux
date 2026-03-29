const express = require("express");
const cores = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const { protect, admin } = require("./middleware/authMiddleware");
const { errorHandler } = require("./middleware/errorMiddleware");
const commentRoutes = require("./routes/commentRoutes");

dotenv.config();

connectDb();
const app = express();
app.use(cores());
app.use(express.json());
app.use(errorHandler);
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
