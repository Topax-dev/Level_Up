import { IUserSlice } from "@/interface/iAll";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IUserSlice = {
  id: 0,
  avatar: "",
  username: "",
  email: "",
  createdAt: "",
  updatedAt: "",
  purpose: "",
  selectedPath: null
};

const loadFromLocalStorage = (): IUserSlice => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("user");
    if (saved) {
      return JSON.parse(saved) as IUserSlice;
    }
  }
  return initialState;
};

const userSlice = createSlice({
  name: "User Data",
  initialState: loadFromLocalStorage(), 
  reducers: {
    saveUserData: (state, action: PayloadAction<IUserSlice>) => {
      const newState = { ...state, ...action.payload };
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(newState));
      }
      return newState;
    },
    clearUserData: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      return initialState;
    },
  },
});

export const { clearUserData, saveUserData } = userSlice.actions;
export default userSlice.reducer;
