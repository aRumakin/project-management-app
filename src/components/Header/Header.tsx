import { Link } from '@tanstack/react-location';
import Hamburger from 'hamburger-react';
import { useTranslation } from 'react-i18next';

import { useState } from 'react';

import { LangSwitcher } from '../LangSwitcher/LangSwitcher';
import { SearchBar } from '../SearchBar/SearchBar';

import { saveLocalOnLogout } from '@/app/auth';
import appLogoPath from '@/assets/png/app-logo.png';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { authSlice } from '@/store/reducers/AuthSlice';

import './Header.pcss';

export const Header = (): JSX.Element => {
  const { t } = useTranslation();
  const { isLoggedIn } = useAppSelector(state => state.authReducer);
  const { logOff } = authSlice.actions;
  const dispatch = useAppDispatch();

  const [navClass, setNavClass] = useState('nav');
  const [overlayClass, setOverlayClass] = useState('overlay hidden');
  const [isOpen, setOpen] = useState(false);

  const onNavListClick = () => {
    setNavClass('nav');
    setOverlayClass('overlay hidden');
    setOpen(!isOpen);
  };

  const logOut = () =>{
    dispatch(logOff());
    saveLocalOnLogout();
    onNavListClick();
  };

  const appLogo = <img src={appLogoPath} alt="app-logo" className='header__app-logo' />;

  const onToggle = () => {
    if (navClass === 'nav') {
      setNavClass('nav_visible');
      setOverlayClass('overlay visible');
      setOpen(true);
    } else {
      setNavClass('nav');
      setOverlayClass('overlay hidden');
      setOpen(false);
    }
  };

  return (

    <header className='header'>
      <div className="container">
        <div className='header-wrapper'>
          <div className='app-logo'>
            <Link to='/'>
              {appLogo}
            </Link>
          </div>

          <div className="header-items">

            {isLoggedIn && (
              <SearchBar/>
            )}

            <nav className={navClass}>

              <ul className='nav-list'>
                {!isLoggedIn && (
                  <>
                    <li className='nav-button'>
                      <Link to='/signin' onClick={onNavListClick}>{t('AUTH.LOG_IN')}</Link>
                    </li>

                    <li className='nav-button'>
                      <Link to='/signup' onClick={onNavListClick}>{t('AUTH.SIGN_UP')}</Link>
                    </li>
                  </>
                )}

                {isLoggedIn && (
                  <>

                    <li className='nav-button'>
                      <Link to='/boards' onClick={onNavListClick}>{t('HEADER.BOARDS')}</Link>
                    </li>

                    <li className='nav-button'>
                      <Link to='/profile' onClick={onNavListClick}>{`${t('HEADER.PROFILE')}`}</Link>
                    </li>

                    <li className='nav-button'>
                      <Link to='/' onClick={logOut}>{t('AUTH.SIGN_OUT')}</Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>

          </div>

          <LangSwitcher />
          <Hamburger toggled={isOpen} onToggle={onToggle} color="white" rounded />

          <div className={overlayClass} />

        </div>

      </div>
    </header>
  );
};
