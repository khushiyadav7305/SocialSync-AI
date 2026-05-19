const express = require("express");
const router = express.Router();

// Middleware imports
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Controllers
const {
  createPost,
  getPosts,
  deletePost,
  updatePost,
} = require("../controllers/postController");

// Create Post
router.post(
  "/",
  protect,
  upload.single("image"),
  createPost
);

// Get Posts
router.get(
  "/",
  protect,
  getPosts
);

// Update Post (Reschedule / Edit)
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updatePost
);

// Delete Post
router.delete(
  "/:id",
  protect,
  deletePost
);

module.exports = router;