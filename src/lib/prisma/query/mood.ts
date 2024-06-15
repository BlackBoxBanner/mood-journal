import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const getUniqueMood = async (props: Prisma.MoodFindUniqueArgs) => {
	const query = await prisma.mood.findUnique(props);
	await prisma.$disconnect();
	return query;
};

export const getManyMood = async (props: Prisma.MoodFindManyArgs) => {
	const query = await prisma.mood.findMany(props);
	await prisma.$disconnect();
	return query;
};

export const createMood = async (props: Prisma.MoodCreateArgs) => {
	const query = await prisma.mood.create(props);
	await prisma.$disconnect();
	return query;
};

export const updateMood = async (props: Prisma.MoodUpdateArgs) => {
	const query = await prisma.mood.update(props);
	await prisma.$disconnect();
	return query;
};

export const updateNewStatus = (id: string) => {
	return updateMood({
		where: { id },
		data: { isNew: false },
	});
};
