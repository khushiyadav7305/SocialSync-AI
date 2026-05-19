const { Worker } = require("bullmq");
const Post = require("../models/Post");
const redis = require("../config/redis");

// Worker starts listening to queue
const postWorker = new Worker(
  "publishPost",
  async (job) => {
    const { postId } = job.data;

    console.log("⏳ Processing Post:", postId);

    const post = await Post.findById(postId);

    if (!post) {
      console.log("❌ Post not found");
      return;
    }

    // Simulate publishing
    post.status = "published";
    await post.save();

    console.log("✅ Post Published:", post._id);
  },
  {
    connection: redis,
  }
);

// Logs
postWorker.on("completed", (job) => {
  console.log(`🎉 Job completed: ${job.id}`);
});

postWorker.on("failed", (job, err) => {
  console.log(`❌ Job failed: ${job.id}`, err.message);
});

console.log("🚀 Post Worker Running...");

module.exports = postWorker;