import { createAsyncThunk } from '@reduxjs/toolkit';

import { userSignIn, userSignUp } from '@/api/apiAuth';
import { IUserSignInData, IUserSignUpData } from '@/app/types';

export const userLogIn = createAsyncThunk(
  'user/login',
  async (userData: IUserSignInData, thunkAPI) => {

    try {
      return await userSignIn(userData);
    } catch (e) {
      return thunkAPI.rejectWithValue('Error loading data');
    }
  });

export const userLogUp = createAsyncThunk(
  'user/singnup',
  async (userData: IUserSignUpData, thunkAPI) => {

    try {
      return await userSignUp(userData);
    } catch (e) {
      return thunkAPI.rejectWithValue('Error loading data');
    }
  });
