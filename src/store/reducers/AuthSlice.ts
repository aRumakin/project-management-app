import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import { userLogIn, userLogUp } from './AuthThunks';

import { ISignInResponse, ISignUpResponse } from '@/api/apiAuth';
import { getLocalAuthState } from '@/app/auth';
import { IAuthState, ISignInOk } from '@/app/types';

const getInitalState: () => IAuthState = () => {
  const localData = getLocalAuthState();

  const initialState = {
    awaiting: false,
    userCreated: false,
  };

  if (localData.user){
    return {
      ...initialState,
      isLoggedIn: true,
      user: localData.user,
      token: localData.token,
    };

  } return {
    ...initialState,
    isLoggedIn: false,
    user: null,
    token: '',
  };

};

export const authSlice = createSlice({
  name: 'authentication',
  initialState: getInitalState(),
  reducers: {
    logOff (state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = '';
    },
    signIn (state, action: PayloadAction<ISignInOk>) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.token = action.payload.token;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(userLogIn.fulfilled, (state, action: PayloadAction<ISignInResponse>) => {
        if (action.payload.success){
          state.isLoggedIn = true;

          const { id, login, name, token } = action.payload.data!;
          state.token = token;
          state.user = { login, name, id };

          toast.success(`Greetings, ${name || login}!`);
        }
        else {
          toast.error(action.payload.errors!.message);
        }

        state.awaiting = false;
      })
      .addCase(userLogIn.pending, state => {
        state.awaiting = true;
      })

      .addCase(userLogIn.rejected, state => {
        state.awaiting = false;
        toast.error('Server error');
      })

      .addCase(userLogUp.fulfilled, (state, action: PayloadAction<ISignUpResponse>) => {
        if (action.payload.success){
          state.userCreated = true;
          toast.success('Registration succesful');
        }
        else {
          toast.error(action.payload.errors!.message);
        }
        state.awaiting = false;
      })
      .addCase(userLogUp.pending, state => {
        state.awaiting = true;
      })

      .addCase(userLogUp.rejected, state => {
        state.awaiting = false;
        toast.error('Server error');
      });
  },

});

export default authSlice.reducer;
