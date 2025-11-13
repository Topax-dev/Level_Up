import { configureStore } from "@reduxjs/toolkit";
import notifReducer from './notifSlice'
import userReducer from './userSlice'
import progressReducer from './progressSlice'
import renderReducer from './notRenderSlice'
import loadingReducer from './loadingSlice'
import adminReducer from './adminSlice'
export const store = configureStore({
    reducer: {
        notif: notifReducer,
        user: userReducer,
        progress: progressReducer,
        render: renderReducer,
        loading: loadingReducer,
        admin: adminReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch