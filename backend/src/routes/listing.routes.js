const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../middleware/auth.middleware"
);

const listingController = require(
    "../controllers/listing.controller"
);

router.post(
    "/",
    authMiddleware,
    listingController.createListing
);

router.get(
    "/",
    listingController.getAllListings
);

router.get(
    "/me",
    authMiddleware,
    listingController.getMyListings
);

router.get(
    "/:listingId",
    listingController.getListingById
);

router.put(
    "/:listingId",
    authMiddleware,
    listingController.updateListing
);

router.delete(
    "/:listingId",
    authMiddleware,
    listingController.deleteListing
);

router.patch(
    "/:listingId/sold",
    authMiddleware,
    listingController.markAsSold
);

module.exports = router;