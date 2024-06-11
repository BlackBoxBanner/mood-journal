import {getSession} from "@/lib/auth";

const MoodPage = async () => {
  const session = await getSession();
  const email = session.email;

  if (!email) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="">
    </div>
  );
};

export default MoodPage;
