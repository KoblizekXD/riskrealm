'use client';

import { providerMap, translateError } from '@/lib/auth';
import '@/app/globals.css';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { AuthError } from 'next-auth';
import { GenericErrorPopup } from '@/components/generic-error';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  return (
    <main
      className={'flex bg-[#1e1e2e] justify-center items-center min-h-screen'}>
      <div className='lg:w-1/4 z-10 lg:bg-[#181825] lg:shadow-lg lg:flex-none flex-1 rounded-md flex flex-col p-4'>
        <form
          className='flex flex-col'
          action={(formData) => {
            try {
              signIn('credentials', {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
                redirectTo: '/',
              });
            } catch (error) {
              if (error instanceof AuthError) {
                return redirect(`/signin?error=${error.type}`);
              }
            }
          }}>
          <h1 className={'font-extrabold text-2xl'}>Sign in to Risk Realm</h1>
          <label className={'mt-4'}>
            <span>Email</span>
            <input
              required
              type={'email'}
              name={'email'}
              className={
                'block bg-[#11111b] rounded w-full p-2 mt-1 outline-none'
              }
            />
          </label>
          <label className={'mt-4'}>
            <span>Password</span>
            <input
              required
              type={'password'}
              name={'password'}
              className={
                'block bg-[#11111b] rounded w-full p-2 mt-1 outline-none'
              }
            />
          </label>
          <button
            type={'submit'}
            className={
              'bg-blue-600 font-semibold text-white rounded flex items-center justify-center gap-x-2 p-2 mt-4'
            }>
            Continue
          </button>
        </form>
        <div className='flex my-2 text-center items-center'>
          <hr className='flex-1 border-[#cdd6f4]' />
          <span className='px-2 text-[#cdd6f4]'>or</span>
          <hr className='flex-1 border-[#cdd6f4]' />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          {Object.values(providerMap).map((provider) => (
            <form
              className='text-center bg-[#11111b] flex rounded-md'
              key={provider.name}
              action={async () => {
                try {
                  await signIn(provider.id, {
                    redirectTo: '/',
                  });
                } catch (error) {
                  if (error instanceof AuthError) {
                    return redirect(`/signin?error=${error.type}`);
                  }
                  throw error; // This thing has to be here for some reason???
                }
              }}>
              <button
                type={'submit'}
                className={
                  'flex-1 hover:text-black h-full p-2 flex justify-center items-center gap-x-2 hover:bg-white transition-colors'
                }>
                <Image
                  width={32}
                  height={32}
                  alt='e'
                  src={`https://raw.githubusercontent.com/nextauthjs/next-auth/refs/heads/main/docs/public/img/providers/${provider.id}.svg`}
                />
                Continue with {provider.name}
              </button>
            </form>
          ))}
        </div>
        <Link
          className='mt-2 text-center text-emerald-500 underline'
          href={'/signup'}>
          Not a member yet?
        </Link>
      </div>
      {error && <GenericErrorPopup message={translateError(error)} />}
      <div
        className={
          'fixed invisible lg:visible w-full -translate-y-16 h-full rotate-2'
        }>
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className={
              'flex select-none animate-[moveToRight_20s_infinite_linear] gap-x-2 text-5xl opacity-20'
            }>
            {Array.from({ length: 100 })
              .fill('🎰💸', 0)
              .map((emoji, i) => {
                return <span key={i}>{emoji as string}</span>;
              })}
          </div>
        ))}
      </div>
    </main>
  );
}
