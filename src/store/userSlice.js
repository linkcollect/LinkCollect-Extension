import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token:"",
    user:{},
    loading:false,
    error:false
}

const userSclice = createSlice({
    name:"user",
    initialState,
    reducers:{
        loginStart:(state,{payload})=>{
            state.loading = true;
            state.error = false;
        },
        loginSucccess : (state,{payload}) =>{
            state.token = payload.token;
            state.error = false;
            state.loading = false;
            state.user = payload.user
        },
        loginFailed:(state,{payload})=>{
            state.loading = false;
            state.error = true;
        },
        logout:(state,{payload})=>{
            state.user={}
            state.token=""
        }
    }
})

export const  {loginStart,loginFailed,loginSucccess,logout} = userSclice.actions;

export default userSclice