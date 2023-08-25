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

export function togglePin(collectionId) {
    return http.post(`${apiEndpoint}/togglePin/${collectionId}`)
}

export async function getLiveMessage() {
  try {
  // return http.get(`${apiEndpoint}/linkcollect/live-message`);
  let res2 = await http.get(api.baseUrl + "/analytics/live-message");
  console.log(res2.data.data);
  let res = {message: "Hi 👋, enjoying linkcollect? need more? click here to provide feedback :)", cta: "https://twitter.com/linkcollect_io"}
  if(res2.data) {
    res.message = await res2.data.data.message;
    res.cta = await res2.data.data.cta;
  }

  // return res2.data.data;
  return res;
  } catch (error) {
    console.log(error);
  }

}