import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Languages } from '@/app/types';

interface LanguageState {
  currentLang: Languages;
}

const language = localStorage.getItem('i18nextLng') as Languages;

const initialState: LanguageState = {
  currentLang: language || 'en',
};

export const langSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage (state, action: PayloadAction<Languages>) {
      state.currentLang = action.payload;
    },
  },
});

export default langSlice.reducer;
