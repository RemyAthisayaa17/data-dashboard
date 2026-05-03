const express = require("express");
const router = express.Router();
const { uploadData, getData } = require("../controllers/data.controller");

router.post("/upload", uploadData);
router.get("/data", getData);

module.exports = router;