import { createSlice } from "@reduxjs/toolkit";
import { dataSortByType } from "../utils/utilty";

const initialState = {
  loading: false,
  error: false,
  data: null,
};

const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    //start fetching the data
    getCollectionDataStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    //Setiing up all the data
    getCollectionSuccess: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data = payload;
    },

    // Fecthig the data is failed
    getCollectionFailed: (state) => {
      state.loading = false;
      state.error = true;
    },

    //Adding the new data
    addNewCollecton: (state, { payload }) => {
      console.log(payload);
      state.data = payload.isRecentlySorted
        ? [payload.newCollection, ...state.data]
        : [...state.data, payload.newCollection];
      console.log(state.data, payload);
    },

    //Updating the collection
    setUpdateCollection: (state, { payload }) => {
      const collectionIndex = state.data.findIndex(
        (collection) => collection._id === payload.collectionId
      );
      // As the api is returning updated data with timelines' id only , to persist the original timelines info we are storing it in the orignal timelines
      const originaltimelines = state.data[collectionIndex].timelines
      const {timelines,...data} = payload.updatedCollectio
      state.data[collectionIndex] = { timelines:[...originaltimelines],...data };
    },

    //Pin Collection
    pinCollectionToggle: (state, { payload }) => {
      const  collectionIndex = state.data.findIndex(
        (collection) => collection._id === payload.collectionId
      );
      state.data[collectionIndex] = { ...state.data[collectionIndex], isPinned: !state.data[collectionIndex].isPinned, pinnedTime: Date.now()}},

    //Removing particular collection
    removeCollection: (state, { payload }) => {
      state.data = state.data.filter(
        (collection) => collection._id !== payload.collectionId
      );
    },

    //Sorting collection and set sorted data
    sortCollection: (state, { payload }) => {
      const sortedData = dataSortByType(state.data, payload);
      state.data = sortedData;
      console.log(payload);
    },

    //Add bookmarkd to the collection
    addBookmark: (state, { payload }) => {
      const collectionIndex = state.data.findIndex(
        (collection) => collection._id === payload.collectionId
      );
      state.data[collectionIndex].timelines = [
        payload.bookmark,
        ...state.data[collectionIndex].timelines,
      ];
    },

    //Delete Bookmark
    deleteBookmark: (state, { payload }) => {
      const collectionIndex = state.data.findIndex(
        (collection) => collection._id === payload.collectionId
      );
      state.data[collectionIndex].timelines = state.data[
        collectionIndex
      ].timelines.filter((timeLine) => payload.timeLineId !== timeLine._id);
    },
  },
});

export const {
  getCollectionDataStart,
  getCollectionSuccess,
  getCollectionFailed,
  addNewCollecton,
  setUpdateCollection,
  pinCollectionToggle,
  removeCollection,
  sortCollection,
  addBookmark,
  deleteBookmark,
} = collectionSlice.actions;

export default collectionSlice;
