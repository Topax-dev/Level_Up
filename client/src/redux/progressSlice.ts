import { IProgresSlice } from "@/interface/iAll";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState : IProgresSlice = {
    id: 0,
    status: '',
    completedAt: '',
    userId: 0,
    lessonId: 0
}

const progressSlice = createSlice({
    name: "Progress Slice",
    initialState,
    reducers: {
         saveProgress: (
            state,
            action: PayloadAction<IProgresSlice>
         ) => {
            return { ...state, ...action.payload }
         }
    }
})

export const { saveProgress } = progressSlice.actions
export default progressSlice.reducer