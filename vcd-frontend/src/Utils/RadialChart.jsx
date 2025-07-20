import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

const RadialChart = ({ data, COLORS }) => {

  const maxValue = 1000;
  const percentage = (data / maxValue) * 100;

  const progressData = [
    { name: 'Progress', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];

  return (
    <ResponsiveContainer width={150} height={150}>
      <PieChart>
        <Pie
          data={progressData}
          cx="50%"
          cy="50%"
          innerRadius={35}
          outerRadius={45}
          startAngle={180}
          endAngle={0}
          paddingAngle={0}
          dataKey="value"
        >
          {progressData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
          <Label
            value={`${percentage.toFixed(0)}%`}
            position="center"
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              fill: '#FFF',
            }}
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RadialChart;
