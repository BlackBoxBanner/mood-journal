import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import MoodForm from "@/app/dashboard/mood/components/moodForm";
import {getUniqueUser} from "@/lib/prisma/query/user";
import {getUniqueMood} from "@/lib/prisma/query/mood";

const MoodPageWithDetail = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await getSession();

  if (!session?.email) {
    return redirect("/dashboard/mood");
  }

  const user = await getUniqueUser({
    where: {
      email: session.email,
    },
  })

  if (!user) {
    return redirect("/dashboard/mood");
  }

  const mood = await getUniqueMood({
    where: {
      id,
    },
  })

  if (!mood || mood.userId !== user.id) {
    return redirect("/dashboard/mood");
  }

  return <><MoodForm {...mood} method={"edit"}/></>;
};

export default MoodPageWithDetail;
