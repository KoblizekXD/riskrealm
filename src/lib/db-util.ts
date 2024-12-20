import { PrismaClient } from '@prisma/client';
import { hash } from 'crypto';

const prisma = new PrismaClient();

export default prisma;

export const hashPassword = (password: string) => {
  return hash('sha256', password);
};

export const findUserByCredentials = async (
  email: string,
  password: string
) => {
  return await prisma.user.findFirst({
    where: {
      email: email,
      password: hashPassword(password),
    },
  });
};
