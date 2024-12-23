"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AttendanceChart = ({
  data,
}: {
  data: { name: string; present: number; absent: number }[];
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-emerald-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Présents: {payload[0].value}%
          </p>
          <p className="text-sm text-red-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Absents: {payload[1].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        barSize={40}
        stackOffset="sign"
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tick={{ fill: "#374151", fontSize: 12 }}
          tickLine={false}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tick={{ fill: "#374151", fontSize: 12 }}
          tickLine={false}
          tickFormatter={(value) => `${value}%`}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F3F4F6" }} />
        <Legend
          verticalAlign="top"
          height={50}
          formatter={(value) => {
            const labels = {
              present: "Présents",
              absent: "Absents",
            };
            return <span className="text-sm text-gray-600">{labels[value as keyof typeof labels]}</span>;
          }}
          iconType="circle"
          iconSize={8}
        />
        <Bar
          dataKey="present"
          fill="#10B981"
          radius={[4, 4, 0, 0]}
          name="present"
        />
        <Bar
          dataKey="absent"
          fill="#EF4444"
          radius={[4, 4, 0, 0]}
          name="absent"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
