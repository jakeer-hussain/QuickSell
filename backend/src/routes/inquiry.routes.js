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

router.get(
    "/listing/:listingId",
    inquiryController.getListingInquiries
);

router.patch(
    "/:inquiryId/answer",
    authMiddleware,
    inquiryController.answerInquiry
);

module.exports = router;