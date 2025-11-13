import { ILoadingSlice } from "@/interface/iAll";
import { createSlice } from "@reduxjs/toolkit";

const initialState : ILoadingSlice = {
    show: false
}

const loadingSlice = createSlice({
    name: "Loading Slice",
    initialState,
    reducers: {
        showLoading : (
            state,
        ) => {
            state.show = true
        },
        hideLoading : () => initialState
    }
})

export const { hideLoading, showLoading } = loadingSlice.actions
export default loadingSlice.reducer