import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/AuthSlice';
import langReducer from './reducers/LanguageSlice';

import { authApi } from '@/api/services/AuthService';
import { boardsApi } from '@/api/services/BoardsService';
import { columnsApi } from '@/api/services/ColumnsService';
import { tasksApi } from '@/api/services/TasksService';
import { userApi } from '@/api/services/userService';

export const rootReducer = combineReducers({
  langReducer,
  authReducer,
  [boardsApi.reducerPath]: boardsApi.reducer,
  [columnsApi.reducerPath]: columnsApi.reducer,
  [tasksApi.reducerPath]: tasksApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
});

export const setupStore = () => configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(boardsApi.middleware)
      .concat(columnsApi.middleware)
      .concat(tasksApi.middleware)
      .concat(userApi.middleware)
      .concat(authApi.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
