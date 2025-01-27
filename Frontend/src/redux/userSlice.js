import { createSlice } from '@reduxjs/toolkit'

// Step1:- Define intial state here

const initialState = {
    isAuthenticated : false,
    role : null,
    email : null,
}

//Step2:- Create a slice 

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers : {
        loginSuccess( state, action ) {
            state.isAuthenticated = true;
            state.role = action.payload.role;
            state.email = action.payload.email;
        },
        logout( state ) {
            state.isAuthenticated = false;
            state.role = null;
            state.email = null;
        }
    }
});

//Step 3: Export the reducer functions and slice

export const {loginSuccess, logout} = userSlice.actions;

export default userSlice.reducer;