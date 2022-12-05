import { API_ENDPOINT } from '@/app/constants';
import { IUser, IUserSignInData, IUserSignUpData } from '@/app/types';

export interface ISignInOk {
  token: string;
  id: string;
  name: string;
  login: string;
}

interface ISignInError {
  statusCode: string | number;
  message: string;
}

export interface ISignInResponse {
  success: boolean;
  data?: ISignInOk;
  errors?: ISignInError;
}

export interface ISignUpResponse {
  success: boolean;
  data?: IUser;
  errors?: ISignInError;
}

export async function userSignIn (userData: IUserSignInData){

  const url = `${API_ENDPOINT}/auth/signin`;
  const method = 'POST';
  const headers = {
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify(userData);

  let answer: ISignInResponse;

  try {
    const response = await fetch(url, { method, headers, body });

    if (response.status === 200) {
      answer = {
        success: true,
        data: await response.json() as ISignInOk,
      };
    } else {
      answer = {
        success: false,
        errors: await response.json() as ISignInError,
      };
    }
  } catch (e) { throw new Error(); }

  return answer;

}

export async function userSignUp (userData: IUserSignUpData){

  const url = `${API_ENDPOINT}/auth/signup`;
  const method = 'POST';
  const headers = {
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify(userData);

  let answer: ISignUpResponse;

  try {
    const response = await fetch(url, { method, headers, body });

    if (response.status === 200) {
      const data = await response.json() as IUser;
      answer = {
        success: true,
        data,
      };

    } else {
      const errors = await response.json() as ISignInError;
      answer = {
        success: false,
        errors,
      };

    }
  } catch (e) { throw new Error(); }

  return answer;

}
