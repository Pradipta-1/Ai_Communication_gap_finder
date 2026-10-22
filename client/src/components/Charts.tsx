import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';

interface GapDistributionProps {
  data: { name: string; value: number; color: string }[];
}

export const GapDistributionChart: React.FC<GapDistributionProps> = ({ data }) => {
  return (
    <div className="h-64 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: '#e0e5ec',
              borderColor: '#babecc',
              borderRadius: '8px',
              boxShadow: '4px 4px 10px #babecc, -4px -4px 10px #ffffff',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: '#2d3436',
              fontWeight: 600,
            }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#e0e5ec" strokeWidth={2} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface ActivityChartProps {
  data: { participant: string; messages: number; questions: number }[];
}

export const ParticipantActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d9e6" />
          <XAxis dataKey="participant" stroke="#4a5568" fontSize={11} fontFamily="JetBrains Mono, monospace" />
          <YAxis stroke="#4a5568" fontSize={11} fontFamily="JetBrains Mono, monospace" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e0e5ec',
              borderColor: '#babecc',
              borderRadius: '8px',
              boxShadow: '4px 4px 10px #babecc, -4px -4px 10px #ffffff',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: '#2d3436',
              fontWeight: 600,
            }}
          />
          <Bar dataKey="messages" fill="#2d3436" radius={[4, 4, 0, 0]} name="Messages" />
          <Bar dataKey="questions" fill="#ff4757" radius={[4, 4, 0, 0]} name="Questions Asked" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface ResolutionTrendProps {
  data: { session: string; resolved: number; gaps: number }[];
}

export const ResolutionTrendChart: React.FC<ResolutionTrendProps> = ({ data }) => {
  return (
    <div className="h-64 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d9e6" />
          <XAxis dataKey="session" stroke="#4a5568" fontSize={11} fontFamily="JetBrains Mono, monospace" />
          <YAxis stroke="#4a5568" fontSize={11} fontFamily="JetBrains Mono, monospace" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#e0e5ec',
              borderColor: '#babecc',
              borderRadius: '8px',
              boxShadow: '4px 4px 10px #babecc, -4px -4px 10px #ffffff',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: '#2d3436',
              fontWeight: 600,
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace',
              paddingTop: '8px',
              color: '#2d3436',
            }}
          />
          <Line
            type="monotone"
            dataKey="resolved"
            stroke="#059669"
            strokeWidth={2.5}
            dot={{ fill: '#059669', r: 4 }}
            name="Resolved Threads"
          />
          <Line
            type="monotone"
            dataKey="gaps"
            stroke="#ff4757"
            strokeWidth={2.5}
            dot={{ fill: '#ff4757', r: 4 }}
            name="Communication Gaps"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
