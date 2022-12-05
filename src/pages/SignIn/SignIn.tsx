import { SignForm } from '@/components/SignForm/SignForm';
import './SignIn.pcss';

export const SignIn = (): JSX.Element => (
  <section className='auth'>
    <SignForm type = 'SIGN_IN'/>
  </section>
);
