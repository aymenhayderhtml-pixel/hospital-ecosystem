import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AppointmentsBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-72 flex items-center justify-center text-gray-500 dark:text-gray-400">No chart data available</div>;
  }

  return (
    <div className="h-72 w-full text-gray-600 dark:text-gray-300">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            labelStyle={{ fontWeight: 600, color: '#0f172a', marginBottom: 4 }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AppointmentsBarChart;
