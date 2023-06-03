import { configureStore } from "@reduxjs/toolkit";
import userSclice from "./userSlice";
import collectionSlice from "./collectionsSlice";


//Configuring the reducer object
const reducer = {
    user: userSclice.reducer, // all user controller
    collection: collectionSlice.reducer // all collection controller :  CRUD
}


const store  = configureStore({
    reducer:reducer,

})

export default store;