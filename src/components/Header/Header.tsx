import toast from 'react-hot-toast';

import { LangSwitcher } from '../LangSwitcher/LangSwitcher';
import { Link } from '../Link/Link';

import { saveLocalOnLogout } from '@/app/auth';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { authSlice } from '@/store/reducers/AuthSlice';

import './Header.pcss';

export const Header = (): JSX.Element => {
  const { isLoggedIn } = useAppSelector(state => state.authReducer);
  const { logOff } = authSlice.actions;
  const dispatch = useAppDispatch();

  const logOut = () =>{
    dispatch(logOff());
    saveLocalOnLogout();
    toast.success('Logged out...');
  };

  return (
    <header className='header'>

      <div className='header-nav'>
        <nav>
          <ul className='nav-list'>

            <li>
              <LangSwitcher />
            </li>

            <li>
              <Link
                href='/'
                text='Home'
              />
            </li>

            {!isLoggedIn && (
              <>

                <li>
                  <Link
                    href='/signin'
                    text='Sign In'
                  />
                </li>

                <li>
                  <Link
                    href='/signup'
                    text='Sign Up'
                  />
                </li>
              </>
            )}

            {isLoggedIn && (
              <>
                <li>
                  <Link
                    href='/main'
                    text='Boards'
                  />

                </li>

                <li>
                  <Link
                    href='/profile'
                    text='Profile'
                  />
                </li>

                <li>
                  <button
                    type='button'
                    onClick={logOut}
                  >
                    Sign Out
                  </button>
                </li>
              </>

            )}

          </ul>
        </nav>
      </div>

    </header>

  );
};
