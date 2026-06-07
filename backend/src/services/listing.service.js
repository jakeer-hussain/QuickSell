const Listing = require("../models/Listing");

const createListing = async (listingData,sellerId) => {

    const listing = await Listing.create({
        ...listingData,
        seller: sellerId
    });

    return listing;
};

const getAllListings = async (
    filters = {}
) => {

    const {
        search,
        category,
        minPrice,
        maxPrice,
        status
    } = filters;

    const query = {};

    if (status) {
        query.status = status;
    }

    if (search) {

        query.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];

    }

    if (category) {
        query.category = category;
    }

    if (minPrice || maxPrice) {

        query.price = {};

        if (minPrice) {
            query.price.$gte =
                Number(minPrice);
        }

        if (maxPrice) {
            query.price.$lte =
                Number(maxPrice);
        }
    }

    return Listing.find(query)
        .populate(
            "seller",
            "name email"
        );

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