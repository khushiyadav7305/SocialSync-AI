const cloudinary = require("cloudinary").v2;

// 👑 Central index.js se process.env pehle hi active ho chuka hai, 
// isiliye yahan direct variables map ho jayenge bina kisi path issue ke.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;