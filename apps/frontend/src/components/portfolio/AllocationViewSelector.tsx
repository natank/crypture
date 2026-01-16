import { AllocationView } from './PortfolioCompositionDashboard';

interface AllocationViewSelectorProps {
  selectedView: AllocationView;
  onViewChange: (view: AllocationView) => void;
}

const views: { value: AllocationView; label: string }[] = [
  { value: 'asset', label: 'Asset' },
  { value: 'category', label: 'Category' },
  { value: 'marketCap', label: 'Market Cap' },
  { value: 'risk', label: 'Risk' },
];

export default function AllocationViewSelector({
  selectedView,
  onViewChange,
}: AllocationViewSelectorProps) {
  return (
    <div
      data-testid="allocation-view-selector"
      className="flex flex-wrap gap-2 w-full md:w-auto md:flex-nowrap"
      role="tablist"
      aria-label="Allocation view selector"
    >
      {views.map((view) => (
        <button
          key={view.value}
          role="tab"
          aria-selected={selectedView === view.value}
          aria-controls="allocation-chart-panel"
          onClick={() => onViewChange(view.value)}
          className={`flex-1 md:flex-initial px-3 py-2 text-sm rounded-md transition-colors tap-44 focus-ring min-h-[44px] min-w-[80px] ${
            selectedView === view.value
              ? 'bg-brand-primary text-white font-semibold'
              : 'bg-surface-soft hover:bg-surface-medium text-text'
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
