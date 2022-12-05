import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { generateHeaders } from './prepareHeaders';

import { API_ENDPOINT } from '@/app/constants';
import { ITransformUser, IUser, IUserSignUpData } from '@/app/types';

const transformUserProps = (response: IUser) => {
  const { _id: id, name, login } = response;
  return { id, name, login };
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_ENDPOINT,

    prepareHeaders: generateHeaders,
  }),
  tagTypes: ['Users'],
  endpoints: build => ({
    getUser: build.query<ITransformUser, string>({
      query: id => ({
        url: `/users/${id}`,
      }),
      transformResponse: transformUserProps,
    }),
    updateUser: build.mutation<IUser, { id: string; userData: IUserSignUpData}>({
      query: ({ id, userData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),
    removeUser: build.mutation<IUser, string>({
      query: user => ({
        url: `/users/${user}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});
