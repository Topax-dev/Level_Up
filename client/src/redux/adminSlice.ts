import { IAdminSlice } from "@/interface/iAll";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState : IAdminSlice = {
    avatar: '',
    createdAt: '',
    email: '',
    id: 0,
    role: '',
    updatedAt: '',
    username: ''
}

const loadFromLocalStorage = () => {
    if(typeof window !== "undefined") {
        const saved = localStorage.getItem('admin')
        if(saved) {
            return JSON.parse(saved) as IAdminSlice
        }
    }
    return initialState
}

const adminSlice = createSlice({
    name: 'Admin Data',
    initialState: loadFromLocalStorage(),
    reducers : {
        saveAdminData : (
            state,
            action : PayloadAction<IAdminSlice>
        ) => {
            const newState = { ...state, ...action.payload }
            if(typeof window !== "undefined") {
                localStorage.setItem('admin', JSON.stringify(newState))
            }
            return newState
        },
        clearAdminData: () => {
            if(typeof window !== "undefined") {
                localStorage.removeItem('admin')
            }
            return initialState
        }
    },
})

export const { clearAdminData, saveAdminData } = adminSlice.actions
export default  adminSlice.reducer