"use server";

import {decrypt} from "@/lib/crypto";
import {z} from "zod";
import {feelsToBinary} from "@/lib/feel";
import {revalidatePath} from "next/cache";
import {createMood, getManyMood, updateMood} from "@/lib/prisma/query/mood";
import {permanentRedirect} from "next/navigation";
import {subDays} from "date-fns";

const moodFormSchema = z.object({
  mood: z.string().min(1, "Please select a mood"),
  stress: z
    .number()
    .int("Please select a stress level")
    .min(1, "Please select a stress level")
    .refine((v) => v >= 1 && v <= 10, {
      message: "Stress level should be between 1 and 10",
    }),
  energy: z
    .number()
    .int("Please select an energy level")
    .min(1, "Please select a stress level")
    .refine((v) => v >= 1 && v <= 10, {
      message: "Energy level should be between 1 and 10",
    }),
  well: z.string().min(1, "Please add at least one thing you are well"),
  notWell: z.string(),
  feel: z.array(z.string()).min(1, "Please add at least one feeling"),
  activities: z.array(z.string()).min(1, "Please add at least one activity"),
  grateful: z
    .string()
    .min(1, "Please add at least one thing you are grateful for"),
  date: z.string(),
  userId: z.string(),
});

export const createMoodAction = async (data: string) => {
  const decryptedData = await decrypt(data);
  const mood = await moodFormSchema.parseAsync(decryptedData);

  const userMood = await getManyMood({
    where: {
      userId: mood.userId,
      date: {
        lte: mood.date,
        gte: subDays(mood.date,1)
      }
    }
  })

  if(userMood.length > 0) throw new Error("Your mood is already been record.")

  try {
    await createMood({
      data: {
        userId: mood.userId,
        date: new Date(mood.date),
        mood: mood.mood,
        energy: mood.energy,
        stress: mood.stress,
        feel: feelsToBinary(mood.feel),
        notWell: mood.notWell,
        activities: mood.activities.join(" "),
        well: mood.well,
        grateful: mood.grateful
      }
    })
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message)
    }
    throw new Error("Something went wrong!")
  }
  revalidatePath("/dashboard/mood")
  permanentRedirect("/dashboard/mood")
};

const editMoodSchema = moodFormSchema.omit({}).extend({
  id: z.string()
})

export const editMoodAction = async (data: string) => {
  const decryptedData = await decrypt(data);
  const mood = await editMoodSchema.parseAsync(decryptedData);

  try {
    await updateMood({
      where: {
        id: mood.id
      },
      data: {
        date: new Date(mood.date),
        mood: mood.mood,
        energy: mood.energy,
        stress: mood.stress,
        feel: feelsToBinary(mood.feel),
        notWell: mood.notWell,
        activities: mood.activities.join(" "),
        well: mood.well,
        grateful: mood.grateful
      }
    })
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message)
    }
    throw new Error("Something went wrong!")
  }
  revalidatePath("/dashboard/mood")
  permanentRedirect("/dashboard/mood")
};
