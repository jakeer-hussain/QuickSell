const listingService = require("../services/listing.service");

const createListing = async (req, res) => {
    try {
        const listing = await listingService.createListing(
            req.body,
            req.user.id
        );

        res.status(201).json(listing);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAllListings = async (req, res) => {
    try {
        const listings =
            await listingService.getAllListings();

        res.json(listings);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getListingById = async (req, res) => {
    try {
        const listing =
            await listingService.getListingById(
                req.params.listingId
            );

        if (!listing) {
            return res.status(404).json({
                message: "Listing not found"
            });
        }

        res.json(listing);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateListing = async (req, res) => {
    try {
        const listing =
            await listingService.updateListing(
                req.params.listingId,
                req.user.id,
                req.body
            );

        res.json(listing);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const deleteListing = async (req, res) => {
    try {

        await listingService.deleteListing(
            req.params.listingId,
            req.user.id
        );

        res.json({
            message: "Listing deleted"
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const markAsSold = async (req, res) => {
    try {

        const listing =
            await listingService.markAsSold(
                req.params.listingId,
                req.user.id
            );

        res.json(listing);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const getMyListings = async (req, res) => {
    try {

        const listings =
            await listingService.getMyListings(
                req.user.id
            );

        res.json(listings);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createListing,
    getAllListings,
    getListingById,
    updateListing,
    deleteListing,
    markAsSold,
    getMyListings
};