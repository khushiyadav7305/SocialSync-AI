require("dotenv").config();

const redis = require("./src/config/redis");

redis.set("test", "SocialSync");

redis.get("test").then(console.log);