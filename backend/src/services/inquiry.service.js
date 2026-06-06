const Inquiry = require("../models/Inquiry");
const Listing = require("../models/Listing");

const createInquiry = async (
    listingId,
    buyerId,
    message
) => {

    const listing =
        await Listing.findById(listingId);

    if (!listing) {
        throw new Error("Listing not found");
    }

    if (
        listing.seller.toString() === buyerId
    ) {
        throw new Error(
            "Cannot inquire about your own listing"
        );
    }

    const inquiry =
        await Inquiry.create({
            listing: listingId,
            buyer: buyerId,
            message
        });

    return inquiry;
};

module.exports = {
    createInquiry
};