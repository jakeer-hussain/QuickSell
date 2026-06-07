import api from "./api";

const listingService = {
  getAllListings: async (filters = {}) => {
    const response = await api.get("/listings", { params: filters });
    return response.data;
  },

  getListingById: async (listingId) => {
    const response = await api.get(`/listings/${listingId}`);
    return response.data;
  },

  getMyListings: async () => {
    const response = await api.get("/listings/me");
    return response.data;
  },

  createListing: async (listingData) => {
    const response = await api.post("/listings", listingData);
    return response.data;
  },

  updateListing: async (listingId, listingData) => {
    const response = await api.put(`/listings/${listingId}`, listingData);
    return response.data;
  },

  deleteListing: async (listingId) => {
    const response = await api.delete(`/listings/${listingId}`);
    return response.data;
  },

  markAsSold: async (listingId) => {
    const response = await api.patch(`/listings/${listingId}/sold`);
    return response.data;
  },
};

export default listingService;
