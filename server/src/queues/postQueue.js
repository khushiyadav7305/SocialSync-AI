const { Queue } = require("bullmq");
const redis = require("../config/redis");

const postQueue = new Queue("publishPost", {
  connection: redis,
});

module.exports = postQueue;