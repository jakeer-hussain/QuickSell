const inquiryService = require(
    "../services/inquiry.service"
);

const createInquiry = async (
    req,
    res
) => {
    try {

        const inquiry =
            await inquiryService.createInquiry(
                req.body.listingId,
                req.user.id,
                req.body.message
            );

        res.status(201).json(inquiry);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};

const getListingInquiries = async (req, res) => {
    try {
        const inquiries = await inquiryService.getInquiriesByListing(req.params.listingId);
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const answerInquiry = async (req, res) => {
    try {
        const inquiry = await inquiryService.answerInquiry(
            req.params.inquiryId,
            req.user.id,
            req.body.answer
        );
        res.json(inquiry);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const getSellerInquiries = async (req, res) => {
    try {
        const inquiries = await inquiryService.getInquiriesBySeller(req.user.id);
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createInquiry,
    getListingInquiries,
    answerInquiry,
    getSellerInquiries
};