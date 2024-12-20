import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import prisma, { findUserByCredentials } from './db-util';
import Credentials from 'next-auth/providers/credentials';
import { Provider } from 'next-auth/providers';

export const providers: Provider[] = [
  GitHub({
    clientId: process.env.AUTH_GITHUB_CLIENT_ID,
    clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
  }),
  Google({
    clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
  }),
  Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: async (credentials) => {
      return await findUserByCredentials(
        credentials.email as string,
        credentials.password as string
      );
    },
  })
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: providers
});
