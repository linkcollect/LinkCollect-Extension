import http from "./httpService";
import api from "./apiConfig.json";

const apiEndpoint = api.baseUrl + "/collections";

const boundary = "---------------------------" + Date.now().toString(16);

// With Timelines
export function getAllCollections() {
  return http.get(`${apiEndpoint}/`);
}

// With Timelines
export function getCollection(collectionId,userId) {
  return http.get(`${apiEndpoint}/${collectionId}`,{
    user:userId
  });
}

export function createCollection(collectionData) {
  return http.post(`${apiEndpoint}`, collectionData);
}

export function togglePrivacy(collectionId) {
  return http.post(`${apiEndpoint}/togglePrivacy/${collectionId}`)
}

export function updateCollection(collectionId, collectionData) {
  return http.patch(`${apiEndpoint}/${collectionId}`, collectionData);
}

export function deleteCollection(collectionId) {
  return http.delete(`${apiEndpoint}/${collectionId}`);
}


// Special API call
// Without timelines
export function getAllCollectionsWithoutTimelines() {
  return http.get(`${apiEndpoint}/without-timelines`);
}

export function getAllByUsername(username) {
  return http.get(`${apiEndpoint}/user/${username}`);
}