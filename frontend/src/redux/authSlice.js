import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        email: null,
        token: null,
    },
    reducers: {
        loginUser: (state, action) => {
            state.isAuthenticated = true;
            state.email = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.role;
        },
        logoutUser: (state) => {
            state.isAuthenticated = false;
            state.email = null;
            state.token = null;
            state.role = null;
        },
    },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
