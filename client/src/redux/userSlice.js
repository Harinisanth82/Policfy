import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    loading: false,
    error: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        addApplication: (state, action) => {
            if (state.currentUser) {
                if (!state.currentUser.applications) {
                    state.currentUser.applications = [];
                }
                state.currentUser.applications.push(action.payload);
            }
        },
        deleteApplication: (state, action) => {
            if (state.currentUser && state.currentUser.applications) {
                state.currentUser.applications = state.currentUser.applications.filter(
                    app => app.id !== action.payload
                );
            }
        },
        setApplications: (state, action) => {
            if (state.currentUser) {
                state.currentUser.applications = action.payload;
            }
        }
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, addApplication, deleteApplication, setApplications } = userSlice.actions;

export default userSlice.reducer;
