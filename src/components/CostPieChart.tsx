import React from 'react';

interface PieChartSlice {
  percentage: number;
  color: string;
  label: string;
}

interface CostPieChartProps {
  data: PieChartSlice[];
}

const cleanPercentage = (percentage: number) => {
  const isNegativeOrNaN = !Number.isFinite(percentage) || percentage < 0;
  return isNegativeOrNaN ? 0 : percentage;
};

const getCoordinatesForPercent = (percent: number) => {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
};

export default function CostPieChart({ data }: CostPieChartProps) {
  let cumulativePercent = 0;

  const slices = data.map(slice => {
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += slice.percentage;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = slice.percentage > 0.5 ? 1 : 0;
    
    const pathData = [
      `M ${startX} ${startY}`, // Move
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
      'L 0 0', // Line
    ].join(' ');

    return { ...slice, pathData };
  });

  return (
    <div className="flex items-center justify-center space-x-6">
        <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }} className="w-24 h-24 md:w-28 md:h-28">
            {slices.map((slice, i) => (
                <path key={i} d={slice.pathData} fill={slice.color} />
            ))}
        </svg>
        <div className="text-sm">
            <ul className="space-y-1">
                {data.map((slice, i) => (
                    <li key={i} className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: slice.color }}></span>
                        <span className="font-semibold capitalize mr-2">{slice.label}:</span>
                        <span>{`${(slice.percentage * 100).toFixed(0)}%`}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};
