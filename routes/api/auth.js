const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("This is Auth");
});

module.exports = router;
