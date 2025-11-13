import { INotifSlice } from "@/interface/iAll";
import { NotifType } from "@/interface/tAll";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: INotifSlice = {
  id: 0,
  message: "",
  type: "info",
  show: false,
};

const notifSlice = createSlice({
  name: "notif",
  initialState,
  reducers: {
    showNotif: (
      state,
      action: PayloadAction<{
        message: string;
        type?: NotifType;
      }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
      state.show = true;
      state.id = Date.now()
    },
    hideNotif: (state) => {
      state.message = "";
      state.show = false;
      state.type = "info";
    },
  },
});

export const { showNotif, hideNotif } = notifSlice.actions;
export default notifSlice.reducer;
