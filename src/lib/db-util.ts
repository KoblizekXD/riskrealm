'use server';

import { hash } from 'crypto';
import { signIn } from './auth';
import { prisma } from './prisma';

export const hashPassword = async (password: string) => {
  return hash('sha256', password);
};

export const findUserByCredentials = async (
  email: string,
  password: string
) => {
  return await prisma.user.findFirst({
    where: {
      email: email,
      password: await hashPassword(password),
    },
  });
};

export const createUser = async (prevState: any, formData: FormData) => {
  const res = await prisma.user.create({
    data: {
      name: formData.get('username') as string,
      email: formData.get('email') as string,
      password: await hashPassword(formData.get('password') as string),
    },
  });
  const signInResult = await signIn('credentials', {
    email: formData.get('email') as string,
    password: formData.get('email') as string,
    redirect: false
  });

  console.log(signInResult);
  return signInResult;
}