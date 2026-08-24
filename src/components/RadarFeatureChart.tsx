import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { VisualFeatures } from '../types/experiment';

interface RadarFeatureChartProps {
  featuresA?: VisualFeatures;
  featuresB?: VisualFeatures;
  nameA?: string;
  nameB?: string;
}

export const RadarFeatureChart: React.FC<RadarFeatureChartProps> = ({
  featuresA = {
    lightingQuality: 70,
    compositionAndFraming: 70,
    expressionWarmth: 70,
    symmetryAndHarmony: 70,
    photoSharpness: 70,
    presentationContext: '',
  },
  featuresB = {
    lightingQuality: 70,
    compositionAndFraming: 70,
    expressionWarmth: 70,
    symmetryAndHarmony: 70,
    photoSharpness: 70,
    presentationContext: '',
  },
  nameA = 'Subject Alpha',
  nameB = 'Subject Bravo',
}) => {
  const data = [
    {
      subject: 'Lighting Quality',
      personA: featuresA.lightingQuality,
      personB: featuresB.lightingQuality,
      fullMark: 100,
    },
    {
      subject: 'Composition & Frame',
      personA: featuresA.compositionAndFraming,
      personB: featuresB.compositionAndFraming,
      fullMark: 100,
    },
    {
      subject: 'Affect Warmth',
      personA: featuresA.expressionWarmth,
      personB: featuresB.expressionWarmth,
      fullMark: 100,
    },
    {
      subject: 'Visual Harmony',
      personA: featuresA.symmetryAndHarmony,
      personB: featuresB.symmetryAndHarmony,
      fullMark: 100,
    },
    {
      subject: 'Image Sharpness',
      personA: featuresA.photoSharpness,
      personB: featuresB.photoSharpness,
      fullMark: 100,
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
            Multi-Dimensional Perception Breakdown
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Normalized 0–100 perception sub-indices (Decoupled Visual Layer)
          </p>
        </div>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
          5 AXES
        </span>
      </div>

      <div className="h-[280px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 9 }}
              stroke="#334155"
            />
            <Radar
              name={nameA}
              dataKey="personA"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Radar
              name={nameB}
              dataKey="personB"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                color: '#f8fafc',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              }}
              itemStyle={{ padding: 0 }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => (
                <span className="text-slate-300 font-medium">{value}</span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-3 text-center italic">
        Photographic properties (lighting, sharpness, composition) significantly modulate observer aesthetic appraisal.
      </div>
    </div>
  );
};
