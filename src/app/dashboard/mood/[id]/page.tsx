import {getSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {getUniqueUser} from "@/lib/prisma/query/user";
import {getUniqueMood} from "@/lib/prisma/query/mood";
import {Mood} from "@prisma/client";
import {binaryToFeels} from "@/lib/feel";
import {Progress} from "@/components/ui/progress";

const MoodPageWithDetail = async ({params: {id}}: { params: { id: string } }) => {
  const session = await getSession();

  if (!session?.email) {
    return redirect("/dashboard/mood");
  }

  const user = await getUniqueUser({
    where: {
      email: session.email
    }
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

  return <>
    <div className={"flex flex-col gap-8 lg:px-[12rem]"}>
      <div>
        <h2 className={cn("text-2xl")}>{format(new Date(mood.date), "EEEE, dd MMMM yyyy")}</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{getMood(mood.mood)}</CardTitle>
        </CardHeader>
        <CardContent>
          {getMotto(mood.mood)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Energy and Stress</CardTitle>
        </CardHeader>
        <CardContent className={"grid gap-4"}>
          <div className={"flex flex-col gap-2"}>
            <h3>Energy - {`${mood.energy} / 10`}</h3>
            <Progress value={mood.energy * 10}/>
          </div>
          <div className={"flex flex-col gap-2"}>
            <h3>Stress - {`${mood.stress} / 10`}</h3>
            <Progress value={mood.stress * 10}/>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{`What activities did you do?`}</CardTitle>
        </CardHeader>
        <CardContent className={"flex gap-2 flex-wrap"}>
          {mood.activities.split(" ").map((value, index) => {
            return (
              <span key={`${value}-${index}`} className={cn("bg-muted px-2 rounded")}>
              {value}
            </span>
            )
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{`How did you feel?`}</CardTitle>
        </CardHeader>
        <CardContent className={"flex gap-2 flex-wrap"}>
          {binaryToFeels(mood.feel).map((value, index) => {
            return (
              <span key={`${value}-${index}`} className={cn("bg-muted px-2 rounded")}>
              {value}
            </span>
            )
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{`I'm grateful for...`}</CardTitle>
        </CardHeader>
        <CardContent>
          {mood.grateful}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{`What went well?`}</CardTitle>
        </CardHeader>
        <CardContent>
          {mood.well}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{`What didn't work`}</CardTitle>
        </CardHeader>
        <CardContent>
          {mood.notWell}
        </CardContent>
      </Card>
    </div>
  </>;
};

export default MoodPageWithDetail;

const getMood = (mood: Mood["mood"]) => {
  switch (mood) {
    case "very-sad":
      return "Very sad"
    case "sad":
      return "Sad"
    case "normal":
      return "Normal"
    case "happy":
      return "Happy"
    case "very-happy":
      return "Very happy"
    default:
      return ""
  }
}

const getMotto = (mood: Mood["mood"]) => {
  const randNum = Math.floor(Math.random() * 10);

  switch (mood) {
    case "very-sad":
      return verySad[randNum]
    case "sad":
      return sad[randNum]
    case "normal":
      return normal[randNum]
    case "happy":
      return happy[randNum]
    case "very-happy":
      return veryHappy[randNum]
    default:
      return ""
  }
}

const verySad = [
  "It's okay to feel this way. Take a deep breath and give yourself some love.",
  "You are stronger than you think. One step at a time.",
  "Reach out to a friend. You're not alone.",
  "Try to focus on one positive thing today. Small steps matter.",
  "It's okay to cry. Let it out and let yourself heal.",
  "Take a walk outside and breathe in some fresh air.",
  "Remember, this feeling is temporary. Better days are ahead.",
  "Write down what you're feeling. Sometimes, getting it out helps.",
  "Give yourself permission to rest. You deserve it.",
  "Listen to your favorite calming music. Let it soothe you.",
]

const sad = [
  "Take it easy today. You're doing your best.",
  "Call a loved one. Their voice can be comforting.",
  "Do something small that makes you happy.",
  "Find a quiet place and meditate for a few minutes.",
  "Drink a warm cup of tea and relax.",
  "Remind yourself of your strengths. You've got this.",
  "Take a few moments to stretch and breathe deeply.",
  "Distract yourself with a favorite hobby or book.",
  "Remember, it's okay to feel down sometimes. It will pass.",
  "Think of three things you're grateful for today.",
]

const normal = [
  "You’re steady and balanced. Keep it up!",
  "A great day for some self-care. Treat yourself!",
  "Keep moving forward, you're doing great!",
  "Smile at a stranger today; spread some joy.",
  "Take a moment to appreciate your journey.",
  "Stay hydrated and take a little break.",
  "Embrace today’s opportunities with a positive mindset.",
  "Challenge yourself to learn something new.",
  "Spend some time outdoors and enjoy the fresh air.",
  "Reflect on your progress. You’ve come so far!",
]

const happy = [
  "You're shining bright today! Spread that joy around!",
  "Embrace the happiness and let it inspire you!",
  "Share your smile with the world. It’s contagious!",
  "Celebrate your happiness with a small treat!",
  "Channel this energy into something creative!",
  "Take a moment to dance and feel the rhythm of joy!",
  "Your positivity is powerful. Keep it flowing!",
  "Write down this moment of happiness to remember it.",
  "Do something kind for someone else today!",
  "Use this happy energy to tackle something new!",
]

const veryHappy = [
  "You’re on top of the world! Keep soaring high!",
  "Your joy is magnetic. Let it shine brightly!",
  "Celebrate this moment and make it memorable!",
  "Share your happiness with someone you love!",
  "Let this incredible energy fuel your dreams!",
  "Take a moment to reflect on what made you this happy.",
  "Spread the love and positivity wherever you go!",
  "Embrace the euphoria and enjoy every second!",
  "Use this high energy to inspire others around you!",
  "Remember, happiness looks great on you!",
]