import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { findUserByCredentials } from './db-util';
import Credentials from 'next-auth/providers/credentials';
import { Provider } from 'next-auth/providers';
import { prisma } from './prisma';

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
      try {
        return findUserByCredentials(
          credentials.email as string,
          credentials.password as string
        );
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== 'credentials');

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: providers,
  session: {
    strategy: 'jwt',
    maxAge: 3000,
  },
  pages: {
    signIn: '/signin',
    signOut: '/signout',
    error: '/signin',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session({ session, user }) {
      return session;
    },
  },
});

export function translateError(error: string): string {
  switch (error) {
    case 'CredentialsSignin':
      return 'Invalid email or password';
    case 'OAuthCallbackError':
      return 'Authentication was not finished';
    default:
      return 'An error occurred';
  }
}
