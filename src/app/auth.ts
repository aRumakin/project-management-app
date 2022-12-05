import { tokenExpirationValue } from './constants';
import { IAuthState, ITransformUser } from './types';

export const getLocalAuthState = () => {
  const token = localStorage.getItem('userToken');
  const lastAuthDate = localStorage.getItem('userAuthDate');
  const user = localStorage.getItem('user');

  const now = new Date().getTime();
  if (
    token && lastAuthDate && user &&
    (now - +lastAuthDate < tokenExpirationValue )
  ){
    return {
      user: JSON.parse(user) as ITransformUser,
      token,
    };
  }
  return {
    user: null,
    token,
  };
};

export const saveLocalAuthState = (auth: IAuthState) => {
  if (auth.user){
    localStorage.setItem('user', JSON.stringify(auth.user));
    localStorage.setItem('userToken', auth.token);
    localStorage.setItem('userAuthDate', `${new Date().getTime()}`);
  }
};

export const saveLocalOnLogout = () =>{
  const items = ['userToken', 'user', 'userAuthDate'];
  items.map(item=>localStorage.removeItem(item));
};
