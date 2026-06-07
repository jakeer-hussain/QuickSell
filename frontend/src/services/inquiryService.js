import api from "./api";

const inquiryService = {
  createInquiry: async (listingId, message) => {
    const response = await api.post("/inquiries", { listingId, message });
    return response.data;
  },

  getInquiriesByListing: async (listingId) => {
    const response = await api.get(`/inquiries/listing/${listingId}`);
    return response.data;
  },

  answerInquiry: async (inquiryId, answer) => {
    const response = await api.patch(`/inquiries/${inquiryId}/answer`, { answer });
    return response.data;
  },
};

export default inquiryService;
