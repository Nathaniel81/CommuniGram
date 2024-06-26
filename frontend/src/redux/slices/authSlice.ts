import { createSlice, createAsyncThunk, PayloadAction  } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { IUser } from '../../types'


interface UserState {
  userInfo: IUser | null;
  loading: boolean;
  error: string | null;
}

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo') as string)
  : null;

const initialState: UserState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null
}

export const login = createAsyncThunk(
  'user/login',
  async (
    { email, password }: { email: string; password: string }, 
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `/api/user/login/`,
        { email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data);
    }
  }
);


export const register = createAsyncThunk(
  'user/register',
  async (
    { name, username, email, password, confirmPassword }: 
    { 
      name: string; 
      username: string; 
      email: string; 
      password: string, 
      confirmPassword: string 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          'Content-type': 'application/json'
        }
      };

      const userData = { 
        name, 
        username, 
        email, 
        password, 
        confirmPassword 
      };

      const { data } = await axios.post(
        `/api/user/register/`, 
        userData, 
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetUserInfo: () => initialState,
    //eslint-disable-next-line
    updateUser: (state, action: PayloadAction<any>) => {
      if (state.userInfo) {
        state.userInfo = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.userInfo = null;
        state.error = action.payload ? Object.values(action.payload).join('\n') : 'Registration failed';
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.userInfo = null;
        state.error = action.error.message || null;
      })
  }
});

export default authSlice.reducer;
export const { resetUserInfo, updateUser } = authSlice.actions;
