import http from "./httpService";
import api from "./apiConfig.json";

const apiEndpoint = api.baseUrl + "/user";

// Get user details
export function getUser(userId) {
    return http.get(`${apiEndpoint}/get-user/${userId}`);
}

