import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const TopDiagnosesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-72 flex items-center justify-center text-gray-500 dark:text-gray-400">No diagnosis data available</div>;
  }

  const chartData = data.map((item, index) => ({
    name: item.diagnosis,
    value: item.count,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="h-72 w-full text-gray-600 dark:text-gray-300">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopDiagnosesChart;
