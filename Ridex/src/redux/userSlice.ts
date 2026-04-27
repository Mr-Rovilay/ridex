import { IUser } from '@/models/userModel'
import { createSlice } from '@reduxjs/toolkit'


type UserPayload = {
  user: IUser;
  success: boolean;
};

interface IuserState {
  userData: UserPayload | null
}

// Define the initial state using that type
const initialState: IuserState = {
  userData: null
}

export const userSlice = createSlice({
  name: 'user',

  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
})

export const { setUserData } = userSlice.actions


export default userSlice.reducer