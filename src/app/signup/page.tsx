import { SessionProvider } from 'next-auth/react';
import Register from './register';

export default function SignUp() {
  return (
    <SessionProvider>
      <Register />
    </SessionProvider>
  );
}
