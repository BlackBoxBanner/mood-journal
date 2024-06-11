import prisma from "@/lib/prisma";
import {Prisma} from "@prisma/client";

export const getUniqueUser = async (props: Prisma.UserFindUniqueArgs) => {
  const query = await prisma.user.findUnique(props);
  await prisma.$disconnect();
  return query;
};

export const getUniqueUserWithMood = async (props: Omit<Prisma.UserFindUniqueArgs, "include">) => {
  const query = await prisma.user.findUnique({
    ...props,
    include: {
      Mood: true
    },
  })
  await prisma.$disconnect();
  return query;
}

export const getFirstUsers = async (props: Prisma.UserFindFirstArgs) => {
  const query = await prisma.user.findFirst(props);
  await prisma.$disconnect();
  return query;
}

export const getManyUsers = async (props: Prisma.UserFindManyArgs) => {
  const query = await prisma.user.findMany(props);
  await prisma.$disconnect();
  return query;
}

export const createUser = async (props: Prisma.UserCreateArgs) => {
  const user = await prisma.user.create(props)
  await prisma.$disconnect();
  return user
}