import { useNavigate, Link } from '@tanstack/react-location';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { useEffect, useRef } from 'react';

import { SignFormTypes } from './SignFormLabels';

import { authApi } from '@/api/services/AuthService';
import { saveLocalAuthState } from '@/app/auth';
import { IErrorResponse } from '@/app/types';
import { Loader } from '@/components/Loader/Loader';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import './SignForm.pcss';
import { authSlice } from '@/store/reducers/AuthSlice';

interface SignFormProps {
  type: SignFormTypes;
}

export const SignForm = ({ type }: SignFormProps): JSX.Element => {
  const [signin, {
    data: sInData,
    isLoading: sInLoading,
    error: sInError,
  }] = authApi.useSigninMutation();

  const [signup, {
    isLoading: sUpLoading,
    error: sUpError,
    isSuccess: sUpSuccess,
  }] = authApi.useSignupMutation();

  const loginRef = useRef<string>('');
  const passwordRef = useRef<string>('');

  const { t } = useTranslation();

  const { isLoggedIn, user, token } = useAppSelector(
    state => state.authReducer,
  );
  const { signIn } = authSlice.actions;
  const dispatch = useAppDispatch();

  const signInAction = async (login:string, password: string) => {
    await signin({ login, password });
  };

  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: Record<string, string>) => {
    const { login, password, name } = data;

    if (type === 'SIGN_IN') {
      await signin({ login, password });

    } else if (type === 'SIGN_UP'){
      [loginRef.current, passwordRef.current] = [login, password];
      await signup({ login, password, name });
    }
  };
  useEffect(() => {
    if(sInData){
      toast.success(`${t('TOASTER.AUTH_OK')}, ${sInData.name}!`);
      dispatch(signIn( sInData ));
    }
  }, [sInData]); // that is enough

  useEffect(() => {
    if(isLoggedIn){
      saveLocalAuthState({ isLoggedIn, user, token });
      navigate({ to: '/boards' });
    }
  }, [isLoggedIn]); // that is enough

  useEffect(() => {
    if(sUpSuccess){
      toast.success(t('TOASTER.REG_OK'));
      signInAction(loginRef.current, passwordRef.current)
        .catch(()=>{});
    }
  }, [sUpSuccess]); // do not include signInAction to deps (inf loop)

  useEffect(() => {
    if(sInError){
      if ((sInError as IErrorResponse).status === 401){
        toast.error(t('TOASTER.AUTH_ERR'));
      } else {
        toast.error(t('TOASTER.BAD_REQUEST'));
      }
    }
    if(sUpError){
      if ((sUpError as IErrorResponse).status === 409){
        toast.error(t('TOASTER.REG_ERR'));
      } else {
        toast.error(t('TOASTER.BAD_REQUEST'));
      }
    }
  }, [sUpError, sInError]);

  return (
    <>
      {((sInLoading || sUpLoading) && <Loader/> )}

      <div className='signform-wrapper'>
        <form className="signform" onSubmit={(handleSubmit(onSubmit))}>

          <div className="signform-item">
            <h2 className="signform-header">{t(`${type}.HEADING`)}</h2>
          </div>

          <div className="signform-item">

            <input
              placeholder={`${t(`${type}.LOGIN`)}` }
              className='signform-input'
              {...register('login', { required: true,
                pattern: {
                  value: /[A-Za-z0-9]{4,20}/i,
                  message: '',
                },
              })}
              aria-invalid={errors.login ? 'true' : 'false'}
              type="mail"
            />

            <div className="error-field">
              {errors.login?.type === 'required' && (
                <span role="alert">{t('SIGN_UP.ENTER_LOGIN')}</span>
              )}
              {errors.login?.type === 'pattern' && (
                <span role="alert">{t('SIGN_UP.LOGIN_WRONG')}</span>
              )}
            </div>
          </div>

          {type === 'SIGN_UP' && (
            <div className="signform-item">

              <input
                placeholder={`${t(`${type}.NAME`)}` }
                className='signform-input'
                {...register('name', { required: true,
                  pattern: {
                    value: /[A-Za-z]{3,30}/i,
                    message: '',
                  },
                  minLength: 3 })}
                aria-invalid={errors.name ? 'true' : 'false'}
                type="text"
              />

              <div className="error-field">
                {errors.name?.type === 'required' && (
                  <span role="alert">{t('SIGN_UP.ENTER_NAME')}</span>
                )}
                {errors.name?.type === 'minLength' && (
                  <span role="alert">{t('SIGN_UP.NAME_MIN')}</span>
                )}
                {errors.name?.type === 'pattern' && (
                  <span role="alert">{t('SIGN_UP.NAME_WRONG')}</span>
                )}
              </div>
            </div>
          )}

          <div className="signform-item">

            <input
              placeholder={`${t(`${type}.PASSWORD`)}` }
              className='signform-input'
              {...register('password', {
                required: true,
                minLength: (type === 'SIGN_UP'? 8 : undefined),
              })}
              aria-invalid={errors.password ? 'true' : 'false'}
              type="password"
            />

            <div className="error-field">
              {errors.password?.type === 'required' && (
                <span role="alert">{t('SIGN_UP.ENTER_PASSWORD')}</span>
              )}
              {errors.password?.type === 'minLength' && (
                <span role="alert">{t('SIGN_UP.PASSWORD_MIN')}</span>
              )}
            </div>
          </div>

          <div className="signform-item">
            <input
              type="submit"
              className='signform-button'
              value={`${t(`${type}.${type}`)}` }/>
          </div>

          <div className="signform-item">
            <p className="signform-footer">
              {t(`${type}.BOTTOM_TEXT`)}
              <Link className='signform-footer-link' to={type === 'SIGN_IN' ? '/signup' : '/signin'}>
                {t(`${type}.BOTTOM_LINK`) }
              </Link>
            </p>
          </div>

        </form>
      </div>
    </>
  );
};
