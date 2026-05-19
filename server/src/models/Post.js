const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    caption: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    scheduledTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "published"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);