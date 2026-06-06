const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../middleware/auth.middleware"
);

const inquiryController = require(
    "../controllers/inquiry.controller"
);

router.post(
    "/",
    authMiddleware,
    inquiryController.createInquiry
);

module.exports = router;