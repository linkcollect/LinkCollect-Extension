import { AUTH_SUCCESS, AUTH_START, AUTH_FAILURE } from "../constants/authConstants";
const initilaState = {
    token:"",
    user:{},
    loading:false,
    error:false
}
const authReducer = (state=initilaState,action) => {
    const {type,data} = action;
    switch(type) {
        case AUTH_START :
            return {
                ...state,
                loading:true,
                error:false
            }
        case AUTH_SUCCESS : 
            return  {
                ...state,
                token:data,
                loading:false,
            }
        case AUTH_FAILURE :
            return {
            ...state,
            loading:false,
            error:true
        }
        default:
            return state
    }
}

export default authReducer