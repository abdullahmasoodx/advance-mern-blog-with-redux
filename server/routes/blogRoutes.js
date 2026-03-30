const express = require("express");
const router = express.Router();

const {createBlog,getBlogs,getSingleBlog,updateBlog,deleteBlog,toggleLikeBlog} = 
require("../controllers/blogController");

const {protect} = require("../middleware/authMiddleware");
const {createBlogValidation,validate} = require("../middleware/validationMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.get("/",getBlogs);
router.get("/:id",getSingleBlog);
router.post("/",protect,upload.single("image"),createBlogValidation,validate,createBlog);
router.put("/:id",protect,upload.single("image"),updateBlog);
router.delete("/:id",protect,deleteBlog);
router.put("/:id/like",protect,toggleLikeBlog);

module.exports = router;