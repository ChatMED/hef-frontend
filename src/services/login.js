import instance from "@/axios/axios.js";

export const login = async (username) => {
    try {
        const response = await instance.post("/api/login", {username});

        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Login failed. Please try again.";
    }
};
