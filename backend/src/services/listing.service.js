const Listing = require("../models/Listing");

const createListing = async (listingData,sellerId) => {

    const listing = await Listing.create({
        ...listingData,
        seller: sellerId
    });

    return listing;
};

const getAllListings = async () => {

    const listings = await Listing
        .find({ status: "ACTIVE" })
        .populate(
            "seller",
            "name email"
        );

    return listings;
};

const getListingById = async (
    listingId
) => {

    const listing = await Listing
        .findById(listingId)
        .populate(
            "seller",
            "name email"
        );

    return listing;
};

const updateListing = async (
    listingId,
    userId,
    updateData
) => {

    const listing =
        await Listing.findById(listingId);

    if (!listing) {
        throw new Error("Listing not found");
    }

    if (
        listing.seller.toString() !== userId
    ) {
        throw new Error("Forbidden");
    }

    Object.assign(
        listing,
        updateData
    );

    await listing.save();

    return listing;
};

const deleteListing = async (
    listingId,
    userId
) => {

    const listing =
        await Listing.findById(listingId);

    if (!listing) {
        throw new Error("Listing not found");
    }

    if (
        listing.seller.toString() !== userId
    ) {
        throw new Error("Forbidden");
    }

    await listing.deleteOne();
};

const markAsSold = async (
    listingId,
    userId
) => {

    const listing =
        await Listing.findById(listingId);

    if (!listing) {
        throw new Error("Listing not found");
    }

    if (
        listing.seller.toString() !== userId
    ) {
        throw new Error("Forbidden");
    }

    listing.status = "SOLD";

    await listing.save();

    return listing;
};

const getMyListings = async (
    userId
) => {

    return Listing.find({
        seller: userId
    });
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