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

module.exports = {
    createInquiry
};