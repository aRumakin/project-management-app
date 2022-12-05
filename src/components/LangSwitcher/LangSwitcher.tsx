import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { langSlice } from '@/store/reducers/LanguageSlice';

import './LangSwitcher.pcss';

export const LangSwitcher = (): JSX.Element => {
  const { currentLang } = useAppSelector(state => state.langReducer);
  const { setLanguage } = langSlice.actions;
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();

  const changeLang = () => currentLang === 'en' ? 'ru': 'en';

  const clickHandler = async () =>{
    const newLng = changeLang();
    dispatch(setLanguage(newLng));
    await i18n.changeLanguage(newLng);
  };

  return (
    <div className="lang-switcher">
      <button
        type='button'
        onClick={clickHandler}
      >
        {currentLang.toUpperCase()}
      </button>
    </div>
  );
};
