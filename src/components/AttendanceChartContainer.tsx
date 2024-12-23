import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);

  // Récupérer les présences de la semaine
  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  // Récupérer les présences de la semaine précédente pour la comparaison
  const lastWeekMonday = new Date(lastMonday);
  lastWeekMonday.setDate(lastWeekMonday.getDate() - 7);
  const lastWeekData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastWeekMonday,
        lt: lastMonday,
      },
    },
    select: {
      present: true,
    },
  });

  // Calculer les taux de présence
  const currentWeekPresent = resData.filter(item => item.present).length;
  const currentWeekTotal = resData.length;
  const currentWeekRate = currentWeekTotal > 0 
    ? Math.round((currentWeekPresent / currentWeekTotal) * 100) 
    : 0;

  const lastWeekPresent = lastWeekData.filter(item => item.present).length;
  const lastWeekTotal = lastWeekData.length;
  const lastWeekRate = lastWeekTotal > 0 
    ? Math.round((lastWeekPresent / lastWeekTotal) * 100) 
    : 0;

  const trend = currentWeekRate - lastWeekRate;

  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven"];

  const attendanceMap: { [key: string]: { present: number; absent: number } } = {
    Lun: { present: 0, absent: 0 },
    Mar: { present: 0, absent: 0 },
    Mer: { present: 0, absent: 0 },
    Jeu: { present: 0, absent: 0 },
    Ven: { present: 0, absent: 0 },
  };

  resData.forEach((item) => {
    const itemDate = new Date(item.date);
    const dayOfWeek = itemDate.getDay();
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dayName = daysOfWeek[dayOfWeek - 1];
      
      if (item.present) {
        attendanceMap[dayName].present += 1;
      } else {
        attendanceMap[dayName].absent += 1;
      }
    }
  });

  const chartData = Object.entries(attendanceMap).map(([name, counts]) => {
    const total = counts.present + counts.absent;
    const presentPercentage = total > 0 ? Math.round((counts.present / total) * 100) : 0;
    const absentPercentage = total > 0 ? Math.round((counts.absent / total) * 100) : 0;

    return {
      name,
      present: presentPercentage,
      absent: absentPercentage,
    };
  });

  return (
    <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Présences de la semaine</h3>
          <p className="text-sm text-gray-500">
            Taux de présence : {currentWeekRate}%
            {trend !== 0 && (
              <span className={`ml-2 inline-flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '↑' : '↓'}
                {Math.abs(trend)}%
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
            <span className="text-sm text-gray-600">Présents</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <span className="text-sm text-gray-600">Absents</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <AttendanceChart data={chartData} />
      </div>
    </div>
  );
};

export default AttendanceChartContainer;
