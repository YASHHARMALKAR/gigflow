import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/bids';

// Create Bid
export const createBid = createAsyncThunk('bids/create', async (bidData, thunkAPI) => {
    try {
        const response = await axios.post(API_URL, bidData);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Get Bids for Gig (Owner)
export const getBidsByGigId = createAsyncThunk('bids/getByGig', async (gigId, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/${gigId}`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Hire Freelancer
export const hireFreelancer = createAsyncThunk('bids/hire', async ({ bidId }, thunkAPI) => {
    try {
        const response = await axios.patch(`${API_URL}/${bidId}/hire`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Get My Bids (Freelancer)
export const getMyBids = createAsyncThunk('bids/getMyBids', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/my-bids`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});


const initialState = {
    bids: [], // Current view bids
    myBids: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

export const bidSlice = createSlice({
    name: 'bids',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBid.pending, (state) => { state.isLoading = true; })
            .addCase(createBid.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.myBids.push(action.payload);
                state.message = 'Bid placed successfully';
            })
            .addCase(createBid.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getBidsByGigId.pending, (state) => { state.isLoading = true; })
            .addCase(getBidsByGigId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bids = action.payload;
            })
            .addCase(getBidsByGigId.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMyBids.pending, (state) => { state.isLoading = true; })
            .addCase(getMyBids.fulfilled, (state, action) => {
                state.isLoading = false;
                state.myBids = action.payload;
            })
            .addCase(hireFreelancer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Freelancer hired!';
                // Need to update local state logic if complex, but simple reload or selector update is fine
            });
    }
});

export const { reset } = bidSlice.actions;
export default bidSlice.reducer;
