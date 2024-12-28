'use client';

import { GenericErrorPopup } from '@/components/generic-error';
import { providerMap, translateError } from '@/lib/auth';
import { createUser } from '@/lib/db-util';
import { LoaderCircle } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';


export default function Register() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [state, formAction, isPending] = useActionState(createUser, undefined);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session]);

  return (
    <main
      className={
        'min-h-screen md:h-screen lg:bg-black from-[#1e1e2e] to-[#181825] bg-gradient-to-br flex justify-center p-16 items-center'
      }>
      {state && (
        <GenericErrorPopup
          onClose={() => setError(undefined)}
          closeable
          message={translateError(state)}
        />
      )}
      <div
        className={'w-full h-full z-10 flex flex-col gap-x-2 lg:flex-row p-2'}>
        <div className='flex-1 flex justify-center flex-col items-center'>
          <h1 className={'text-4xl mt-12 font-extrabold text-center'}>
            Let&#39;s start your journey here!
          </h1>
          <h2
            className={
              'text-2xl mt-4 font-extrabold text-center text-[#bac2de]'
            }>
            Start today and get a chance to win
            <span className={'text-emerald-500'}> big</span>
          </h2>
          <h3 className='font-semibold text-center mt-4'>
            You will be rewarded with
            <span
              className={
                'from-yellow-300 text-transparent to-yellow-600 bg-gradient-to-r bg-clip-text font-bold'
              }>
              {' '}
              500 tickets{' '}
            </span>
            by registering.
          </h3>
          <form
            action={(fd: FormData) => {
              if (!fd.get('age-required')) {
                setError(
                  'You must comply with the age requirement in order to register.'
                );
                return;
              }
              formAction(fd);
            }}
            className={'mt-24 lg:w-[70%] flex flex-col gap-y-4'}>
            <label className={'mt-4 font-semibold'}>
              <span>Username</span>
              <input
                required
                type={'text'}
                maxLength={32}
                minLength={3}
                name={'username'}
                className={
                  'block border-[#313244] border bg-[#11111b] rounded w-full p-2 mt-1 outline-none'
                }
              />
            </label>
            <label className={'mt-4 font-semibold'}>
              <span>Email</span>
              <input
                required
                type={'email'}
                name={'email'}
                className={
                  'block border-[#313244] border bg-[#11111b] rounded w-full p-2 mt-1 outline-none'
                }
              />
            </label>
            <label className={'mt-4 font-semibold'}>
              <span>Password</span>
              <input
                required
                type={'password'}
                name={'password'}
                className={
                  'block border-[#5d5e6e] border bg-[#11111b] rounded w-full p-2 mt-1 outline-none'
                }
              />
            </label>
            <label className={'flex gap-x-4'}>
              <input name='age-required' required type={'checkbox'} />
              <span>
                I&#39;m <span className='font-semibold'>18 years</span> or older,
                have read our Terms Of Service,
                <br />
                or{' '}
                <span className='font-semibold'>
                  was granted explicit permission to use
                </span>
              </span>
            </label>
            <button
              type={'submit'}
              className={
                'bg-transparent border hover:text-black hover:bg-white transition-colors font-semibold text-white rounded flex items-center justify-center gap-x-2 p-2 mt-4'
              }>
              {isPending && <LoaderCircle className={'animate-spin'} />}
              Sign me up!
            </button>
          </form>
        </div>
        <div
          className={
            'flex select-none lg:flex-col items-center gap-x-2 gap-y-2 py-4'
          }>
          <div className='flex-1 border border-[#cdd6f4] rounded' />
          or
          <div className='flex-1 border border-[#cdd6f4] rounded' />
        </div>
        <div className='flex-1 flex flex-col gap-y-8 justify-center items-center'>
          {Object.values(providerMap).map((provider) => (
            <form
              className='text-center hover:bg-white hover:text-black transition-colors border flex rounded-md'
              key={provider.name}
              action={() => {
                signIn(provider.id, {
                  redirect: true,
                  redirectTo: '/',
                }).then((res) => {
                  if (res?.error) {
                    setError(res.error);
                  }
                });
              }}>
              <button
                type={'submit'}
                className={
                  'flex-1 flex gap-x-2 items-center w-full h-full py-2 px-6'
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
          <button
            onClick={() => router.push('/signin')}
            className={
              'bg-transparent border px-12 text-xl hover:text-black hover:bg-white transition-colors font-semibold text-white rounded flex items-center justify-center gap-x-2 p-2 mt-4'
            }>
            I&#39;m already registered!
          </button>
        </div>
      </div>
      <div
        className={
          'fixed invisible lg:visible w-full brightness-[30%] -translate-y-16 h-full -rotate-2'
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