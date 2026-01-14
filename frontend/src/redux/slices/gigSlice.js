import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/gigs';

// Get gigs
export const getGigs = createAsyncThunk('gigs/getAll', async (search = '', thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}?search=${search}`);
        return response.data;
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create new gig
export const createGig = createAsyncThunk(
    'gigs/create',
    async (gigData, thunkAPI) => {
        try {
            const response = await axios.post(API_URL, gigData);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get gig details
export const getGigById = createAsyncThunk(
    'gigs/getOne',
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
)

const initialState = {
    gigs: [],
    currentGig: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const gigSlice = createSlice({
    name: 'gigs',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGigs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getGigs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.gigs = action.payload;
            })
            .addCase(getGigs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createGig.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createGig.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.gigs.unshift(action.payload); // Add to beginning
            })
            .addCase(createGig.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getGigById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getGigById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentGig = action.payload;
            })
            .addCase(getGigById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    },
});

export const { reset } = gigSlice.actions;
export default gigSlice.reducer;
