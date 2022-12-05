import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { generateHeaders } from './prepareHeaders';

import { API_ENDPOINT } from '@/app/constants';
import { IBoard, IBoardPost, IBoardResponse } from '@/app/types';

const normBoardsId = (response: IBoardResponse ) => {
  const { owner, title, users, _id: id } = response;
  return { owner, title, users, id };
};

const normBoardsArrayId =  (response: IBoardResponse[]) =>
  response.map(board=>normBoardsId(board));

export const boardsApi = createApi({
  reducerPath: 'boardsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: API_ENDPOINT,
    prepareHeaders: generateHeaders,
  }),

  tagTypes: ['Boards', 'Columns'],

  endpoints: build => ({

    getAllBoards: build.query<IBoard[], void>({
      query: () => ({
        url: '/boards',
      }),
      transformResponse: normBoardsArrayId,

      providesTags: () => ['Boards'],
    }),

    getBoard: build.query<IBoard, string>({
      query: id => ({
        url: `/boards/${id}`,
      }),
      transformResponse: normBoardsId,
      providesTags: () => ['Boards'],
    }),

    createBoard: build.mutation<IBoard, IBoardPost>({
      query: board => ({
        url: '/boards',
        method: 'POST',
        body: board,
      }),
      invalidatesTags: ['Boards'],
    }),

    updateBoard: build.mutation<IBoard, {board: IBoardPost; boardId:string}>({
      query: data => ({
        url: `/boards/${data.boardId}`,
        method: 'PUT',
        body: data.board,
      }),
      invalidatesTags: ['Boards'],
    }),

    deleteBoard: build.mutation<IBoard, string>({
      query: id => ({
        url: `/boards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Boards'],
    }),
  }),
});
