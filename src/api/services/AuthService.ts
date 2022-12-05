import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { generateHeaders } from './prepareHeaders';

import { API_ENDPOINT } from '@/app/constants';
import { ISignInOk, IUserSignInData, IUserSignUpData } from '@/app/types';

export const authApi = createApi({
  reducerPath: 'authApi',

  baseQuery: fetchBaseQuery({
    baseUrl: API_ENDPOINT,
    prepareHeaders: generateHeaders,
  }),

  endpoints: build => ({

    signin: build.mutation<ISignInOk, IUserSignInData>({
      query: data => ({
        url: '/auth/signin',
        method: 'POST',
        body: data,
      }),
    }),

    signup: build.mutation<{token: string}, IUserSignUpData>({
      query: data => ({
        url: '/auth/signup',
        method: 'POST',
        body: data,
      }),
    }),

  }),
});
