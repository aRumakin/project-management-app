import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { generateHeaders } from './prepareHeaders';

import { API_ENDPOINT } from '@/app/constants';
import { IColumn, IColumnPost, IColumnResponse } from '@/app/types';

const normColumnsId = (response: IColumnResponse ) => {
  const {  title, boardId, order,  _id: id } = response;
  return { title, boardId, order, id };
};

const normColumnsArrayId =  (response: IColumnResponse[]) =>
  response.map(col=>normColumnsId(col));

export const columnsApi = createApi({
  reducerPath: 'columnsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: API_ENDPOINT,
    prepareHeaders: generateHeaders,
  }),

  tagTypes: ['Columns'],

  endpoints: build => ({

    getColumns: build.query<IColumn[], string>({
      query: boardId => ({
        url: `/boards/${boardId}/columns`,
      }),
      transformResponse: normColumnsArrayId,
      providesTags: () => ['Columns'],
    }),

    createColumn: build.mutation<IColumn, {col: IColumnPost; boardId: string}>({
      query: data => ({
        url: `/boards/${data.boardId}/columns`,
        method: 'POST',
        body: data.col,
      }),
      invalidatesTags: ['Columns'],
    }),

    updateColumn: build.mutation<IColumn, {col: IColumnPost; boardId: string; colId: string }>({
      query: data => ({
        url: `/boards/${data.boardId}/columns/${data.colId}`,
        method: 'PUT',
        body: data.col,
      }),
      invalidatesTags: ['Columns'],
    }),

    getColumnSet: build.mutation<IColumn[], string[]>({
      query: data => ({
        url: `/columnsSet?ids=${data.join(',')}`,
        method: 'GET',
      }),
      transformResponse: normColumnsArrayId,
      invalidatesTags: ['Columns'],
    }),

    updateColumnSet: build.mutation<IColumn, Array<{_id: string; order: number}>>({
      query: data => ({
        url: '/columnsSet',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Columns'],
    }),

    deleteColumn: build.mutation<IColumn, {col: IColumn; boardId: string}>({
      query: data => ({
        url: `/boards/${data.boardId}/columns/${data.col.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Columns'],
    }),

  }),
});
