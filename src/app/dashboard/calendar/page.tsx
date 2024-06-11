import Link from "next/link";
import {Button} from "@/components/ui/button";
import Calendar from "@/components/ui/calendar-event";
import {calendarOptions} from "./components/calendar-option";
import {getSession} from "@/lib/auth";
import {getUniqueUserWithMood} from "@/lib/prisma/query/user";

const MoodPage = async () => {
  const session = await getSession();
  const email = session.email;

  if (!email) {
    return <div>Redirecting...</div>;
  }

  const user = await getUniqueUserWithMood({
    where: {
      email
    }
  })

  return (
    <div className="">
      <Link
        href={{
          pathname: "/dashboard/mood/create",
        }}
        passHref
        legacyBehavior
      >
        <Button className="mb-4">Add your journal</Button>
      </Link>
      <section className="">
        <Calendar events={user?.Mood} options={calendarOptions}/>
      </section>
    </div>
  );
};

export default MoodPage;
