import { createSlice } from "@reduxjs/toolkit";

interface Istate {
  isRender: boolean;
}

const initialState: Istate = {
  isRender: true,
};

const renderSlice = createSlice({
  name: "Course Slice",
  initialState,
  reducers: {
    notRender: (state) => {
      return { ...state, isRender: false }
    }, 
    startRender: (state) => {
        return { ...state, isRender: true }
    }
  },
});

export const { notRender, startRender } = renderSlice.actions;
export default renderSlice.reducer;
