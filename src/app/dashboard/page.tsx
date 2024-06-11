import {getSession} from "@/lib/auth";
import {permanentRedirect} from "next/navigation";
import {getUniqueUser} from "@/lib/prisma/query/user";
import {format} from "date-fns";
import {getManyMood} from "@/lib/prisma/query/mood";
import {Mood} from "@prisma/client";
import LineChart from "@/components/chart/line";
import {LineChartProps} from "@/components/chart";

const DashboardPage = async () => {
  const session = await getSession()

  if (!session.email) return permanentRedirect('/')

  const user = await getUniqueUser({
    where: {
      email: session.email
    },
  })

  if (!user) return permanentRedirect('/')

  const moods = await getManyMood({
    take: 30,
    where: {
      userId: user.id
    },
    orderBy: {
      date: 'asc'
    },
  })

  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const startDate = new Date(moods[0].date);
  const endDate = new Date(moods[moods.length - 1].date);
  const dateArray: Date[] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  const moodMap = new Map<string, Mood>(moods.map(mood => [mood.date.toISOString().split('T')[0], mood]));

  const chartMoodData: Mood[] = dateArray.map(date => {
    const dateString = date.toISOString().split('T')[0];
    if (moodMap.has(dateString)) {
      return moodMap.get(dateString) as Mood;
    } else {
      // Fill with default mood data
      return {
        id: '',
        userId: user.id,
        date: date,
        mood: 'neutral', // or any default value
        stress: 0, // or any default value
        energy: 0, // or any default value
        well: '',
        notWell: '',
        feel: 0, // or any default value
        activities: '',
        grateful: '',
      };
    }
  });

  const stressLevelBarChart: LineChartProps = {
    labels: chartMoodData.map((mood) => {
      console.log(mood)
      return format(mood.date, "d")
    }),
    datasets: [
      {
        label: 'Stress',
        data: chartMoodData.map(v => v.stress)
      },
      {
        label: 'Energy',
        data: chartMoodData.map(v => v.energy)
      },
    ],
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <LineChart {...stressLevelBarChart}/>
    </div>
  );
};

export default DashboardPage;
