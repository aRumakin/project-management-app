import { BaseQueryApi } from '@reduxjs/toolkit/dist/query';

import type { RootState } from '@/store/store';

export const generateHeaders = (
  headers: Headers,
  api: Pick<BaseQueryApi, 'getState' | 'extra' | 'endpoint' | 'type' | 'forced'>,
) => {
  const  { token } = (api.getState() as RootState).authReducer;
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Accept', 'application/json');
  return headers;
};
