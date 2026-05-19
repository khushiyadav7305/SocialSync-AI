const Post = require("../models/Post");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const postQueue = require("../queues/postQueue");
const redis = require("../config/redis");

require("../config/cloudinary");


// ================= CREATE POST =================
exports.createPost = async (req, res) => {
  try {
    const { caption, scheduledTime } = req.body;

    let imageUrl = "";

    // Upload image to cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "socialsync-posts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      imageUrl = result.secure_url;
    }

    // Save post in DB
    const post = await Post.create({
      user: req.user,
      caption,
      image: imageUrl,
      scheduledTime,
    });

    // Delay calculate
    const delay = new Date(scheduledTime).getTime() - Date.now();

    // Queue job
    await postQueue.add(
      "publishPost",
      { postId: post._id },
      { delay: delay > 0 ? delay : 0 }
    );

    // OPTIONAL: Redis scheduling (safe version)
    if (delay > 0) {
      await redis.set(
        `post:${post._id}`,
        JSON.stringify(post),
        "PX",
        delay
      );
    }

    res.status(201).json(post);
  } catch (error) {
    console.log("CREATE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ================= GET POSTS =================
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DELETE POST =================
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }

    res.status(200).json({ message: "Post deleted successfully 🗑️" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= UPDATE POST (EDIT / RESCHEDULE) =================
exports.updatePost = async (req, res) => {
  try {
    const { caption, scheduledTime } = req.body;

    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (caption) post.caption = caption;
    if (scheduledTime) post.scheduledTime = scheduledTime;

    await post.save();

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};