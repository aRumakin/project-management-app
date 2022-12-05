import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { generateHeaders } from './prepareHeaders';

import { API_ENDPOINT } from '@/app/constants';
import { ITask, ITaskPost, ITaskResponse, ITasksByColumn, ITaskSet } from '@/app/types';

const normTasksId = (response: ITaskResponse ) => {
  const { title, boardId, order, columnId, description, userId, users, _id: id } = response;
  return { title, boardId, order, columnId, description, userId, users, id };
};

const normTasksArrayId =  (response: ITaskResponse[]) => {
  const result = response.map(task=>normTasksId(task));
  return result;
};

export const tasksApi = createApi({
  reducerPath: 'tasksApi',

  baseQuery: fetchBaseQuery({
    baseUrl: API_ENDPOINT,
    prepareHeaders: generateHeaders,
  }),

  tagTypes: ['Tasks'],

  endpoints: build => ({

    getTasks: build.query<ITask[], {boardId: string; colId: string}>({
      query: data => ({
        url: `/boards/${data.boardId}/columns/${data.colId}/tasks`,
      }),
      transformResponse: normTasksArrayId,
      providesTags: () => ['Tasks'],
    }),

    getTasksByColumn: build.mutation<ITasksByColumn, {boardId: string; colId: string}>({
      query: data => ({
        url: `/boards/${data.boardId}/columns/${data.colId}/tasks`,
      }),
      invalidatesTags: ['Tasks'],
    }),

    createTask: build.mutation<ITask, {task: ITaskPost; colId: string; boardId: string }>({
      query: data => ({
        url: `/boards/${data.boardId}/columns/${data.colId}/tasks`,
        method: 'POST',
        body: data.task,
      }),
      invalidatesTags: ['Tasks'],
    }),

    updateTask: build.mutation<ITask, {task: ITaskPost; colId: string; boardId: string; taskId: string }>({
      query: data => ({
        url: `/boards/${data.boardId}/columns/${data.colId}/tasks/${data.taskId}`,
        method: 'PUT',
        body: data.task,
      }),
      invalidatesTags: ['Tasks'],
    }),

    deleteTask: build.mutation<ITask, {task: ITask; colId: string; boardId: string}>({
      query: data => ({
        url: `/boards/${data.boardId}/columns/${data.colId}/tasks/${data.task.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'],
    }),

    getTasksSetbySearch: build.mutation<ITask[], string>({
      query: data => ({
        url: `/tasksSet?search=${data}`,
        method: 'GET',
      }),
      transformResponse: normTasksArrayId,
    }),

    getTasksSet: build.mutation<ITask[], string[]>({
      query: data => ({
        url: `/tasksSet?ids=${data.join(',')}`,
        method: 'GET',
      }),
      transformResponse: normTasksArrayId,
      invalidatesTags: ['Tasks'],
    }),

    updateTasksSet: build.mutation<ITask[], ITaskSet[]>({
      query: data => ({
        url: '/tasksSet',
        method: 'PATCH',
        body: data,
      }),
      transformResponse: normTasksArrayId,
      invalidatesTags: ['Tasks'],
    }),

  }),
});
