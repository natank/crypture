import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AllocationItem } from '@services/portfolioAnalyticsService';
import { AllocationView } from './PortfolioCompositionDashboard';

interface AllocationPieChartProps {
  data: AllocationItem[];
  viewType: AllocationView;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: AllocationItem;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload;

  return (
    <div
      data-testid="allocation-tooltip"
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-3"
    >
      <p className="font-semibold text-text mb-1">{item.name}</p>
      <p className="text-sm text-text-muted">
        $
        {item.value.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
      <p className="text-sm font-medium text-brand-primary">
        {item.percentage.toFixed(1)}%
      </p>
    </div>
  );
}

export default function AllocationPieChart({
  data,
  viewType,
}: AllocationPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        No data available
      </div>
    );
  }

  const viewLabels: Record<AllocationView, string> = {
    asset: 'by Asset',
    category: 'by Category',
    marketCap: 'by Market Cap Tier',
    risk: 'by Risk Level',
  };

  return (
    <div
      data-testid="allocation-pie-chart"
      role="img"
      aria-label={`Portfolio allocation ${viewLabels[viewType]}`}
      id="allocation-chart-panel"
      className="h-64 md:h-80 lg:h-96 min-h-[256px]"
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={256}>
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={false}
            isAnimationActive={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.id}`}
                fill={entry.color}
                data-testid={`pie-slice-${entry.id}`}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
