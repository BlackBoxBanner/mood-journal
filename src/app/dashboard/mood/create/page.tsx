import MoodForm from "@/app/dashboard/mood/components/moodForm";
import {getSession} from "@/lib/auth";
import {getUniqueUser} from "@/lib/prisma/query/user";

const CreateMoodPage = async () => {
  const session = await getSession();
  const email = session.email;

  if (!email) {
    return <div>Redirecting...</div>;
  }

  const user = await getUniqueUser({
    where: {
      email
    }
  })

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return (
    <>
      <MoodForm userId={user.id} method={"create"}/>
    </>
  );
};

export default CreateMoodPage;
