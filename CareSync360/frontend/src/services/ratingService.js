import api from "./api";

export const ratingService = {
  async createRating(payload) {
    const { data } = await api.post("/ratings", payload);
    return data;
  },

  async getMyRatings() {
    const { data } = await api.get("/ratings/my");
    return data;
  },

  async getRatingsByDoctor(doctorProfileId) {
    const { data } = await api.get(`/ratings/doctor/${doctorProfileId}`);
    return data;
  }
};
