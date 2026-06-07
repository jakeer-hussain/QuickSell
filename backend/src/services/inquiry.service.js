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

const getInquiriesByListing = async (listingId) => {
    return Inquiry.find({ listing: listingId })
        .populate("buyer", "name email")
        .sort({ createdAt: 1 });
};

const answerInquiry = async (inquiryId, sellerId, answerText) => {
    const inquiry = await Inquiry.findById(inquiryId).populate("listing");
    if (!inquiry) {
        throw new Error("Inquiry not found");
    }
    if (inquiry.listing.seller.toString() !== sellerId) {
        throw new Error("Forbidden: Only the seller can answer this inquiry");
    }
    inquiry.answer = answerText;
    await inquiry.save();
    return inquiry;
};

module.exports = {
    createInquiry,
    getInquiriesByListing,
    answerInquiry
};