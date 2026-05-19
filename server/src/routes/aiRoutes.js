const express =
  require("express");

const router =
  express.Router();

const {
  generateAI,
} = require(
  "../controllers/aiController"
);

router.post(
  "/generate",
  generateAI
);

module.exports =
  router;