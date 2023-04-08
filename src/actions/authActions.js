import { AUTH_SUCCESS , AUTH_START , AUTH_FAILURE } from "../constants/authConstants"
export const authStart = () =>({
    type:AUTH_START,
})
export const authSuccess = (data) => ({
    type:AUTH_SUCCESS,
    data
})

export const authFailure = (error) => ({
    type: AUTH_FAILURE
})