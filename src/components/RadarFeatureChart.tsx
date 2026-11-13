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
import { useTheme } from '../utils/themeContext';

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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

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

  const colorA = isDark ? '#C99765' : '#8C5E3C';
  const colorB = isDark ? '#6B9071' : '#4A6B53';

  return (
    <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-6 shadow-xs dark:shadow-xl flex flex-col justify-between transition-colors">
      <div className="pb-3 border-b border-[#E8E2D8] dark:border-[#3D332C] flex items-start justify-between gap-3">
        <div>
          <h4 className="text-xs font-semibold text-[#211813] dark:text-[#F5EFEB] uppercase tracking-wider font-sans">
            Radar Chart: 5 Visual Dimensions Side-by-Side
          </h4>
          <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC] mt-1 font-sans">
            This radar chart overlaps both images across five photographic qualities so you can see where each image is stronger at a glance.
          </p>
        </div>
        <span className="text-[10px] font-mono text-[#8C7D70] dark:text-[#A69688] shrink-0">
          5 AXES
        </span>
      </div>

      <div className="h-[280px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke={isDark ? '#3D332C' : '#E8E2D8'} strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: isDark ? '#D4C7BC' : '#5C4E43', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: isDark ? '#A69688' : '#8C7D70', fontSize: 9 }}
              stroke={isDark ? '#3D332C' : '#E8E2D8'}
            />
            <Radar
              name={nameA}
              dataKey="personA"
              stroke={colorA}
              fill={colorA}
              fillOpacity={isDark ? 0.28 : 0.20}
              strokeWidth={2}
            />
            <Radar
              name={nameB}
              dataKey="personB"
              stroke={colorB}
              fill={colorB}
              fillOpacity={isDark ? 0.28 : 0.20}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1E1815' : '#FFFFFF',
                borderColor: isDark ? '#3D332C' : '#E8E2D8',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                color: isDark ? '#F5EFEB' : '#211813',
                boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(33, 24, 19, 0.08)',
              }}
              itemStyle={{ padding: 0 }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => (
                <span className="text-[#5C4E43] dark:text-[#D4C7BC] font-medium font-sans">{value}</span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-[#8C7D70] dark:text-[#A69688] border-t border-[#E8E2D8] dark:border-[#3D332C] pt-3 text-center italic font-sans">
        Photographic properties (lighting, sharpness, composition) significantly modulate observer aesthetic appraisal.
      </div>
    </div>
  );
};
