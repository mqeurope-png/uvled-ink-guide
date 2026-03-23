import {
  Zap,
  Calendar,
  CalendarDays,
  CalendarRange,
  Search,
  CircleOff,
  Sprout,
  TrendingUp,
  Award,
  Landmark,
  Check,
  type LucideIcon,
} from 'lucide-react';
import {
  WizardState,
  DecisionTimeline,
  DECISION_TIMELINES,
  ExperienceLevel,
  EXPERIENCE_LEVELS,
  InvestmentRange,
  INVESTMENT_RANGES,
  Priority,
  PRIORITIES,
} from '@/lib/wizardTypes';

interface StepProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  t: (key: string) => string;
}

// ── Shared card ──

function OptionCard({
  selected,
  onClick,
  icon: Icon,
  label,
  sublabel,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  label: string;
  sublabel?: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center
        transition-shadow transition-colors duration-200 cursor-pointer
        ${selected
          ? 'bg-[#fdf0eb] border-2 border-primary'
          : 'bg-card border border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.16)] hover:shadow-md'
        }
      `}
    >
      {badge && (
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
          {badge}
        </span>
      )}
      {selected && !badge && (
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}
      {Icon && <Icon className={`h-6 w-6 ${selected ? 'text-primary' : 'text-muted-foreground'}`} />}
      <span className="font-medium text-sm">{label}</span>
      {sublabel && (
        <span className="text-xs text-muted-foreground">{sublabel}</span>
      )}
    </button>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-medium mt-8 mb-3 first:mt-0">{children}</h3>;
}

// ── Icon / label maps ──

const TIMELINE_ICONS: Record<DecisionTimeline, LucideIcon> = {
  immediate: Zap,
  oneMonth: Calendar,
  threeMonths: CalendarDays,
  sixMonths: CalendarRange,
  justExploring: Search,
};

const EXPERIENCE_ICONS: Record<ExperienceLevel, LucideIcon> = {
  none: CircleOff,
  beginner: Sprout,
  intermediate: TrendingUp,
  expert: Award,
};

const INVESTMENT_ICONS: Partial<Record<InvestmentRange, LucideIcon>> = {
  financing: Landmark,
};

// ── Component ──

export function StepExpectations({ state, updateState, t }: StepProps) {
  // Priority toggle logic
  const togglePriority = (p: Priority) => {
    const current = state.priorities;
    if (current.includes(p)) {
      updateState({ priorities: current.filter((x) => x !== p) });
    } else if (current.length < 3) {
      updateState({ priorities: [...current, p] });
    }
  };

  const priorityRank = (p: Priority): number => {
    const idx = state.priorities.indexOf(p);
    return idx === -1 ? 0 : idx + 1;
  };

  return (
    <div className="space-y-2">
      {/* Decision Timeline */}
      <SectionHeading>{t('exp_timeline')}</SectionHeading>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {DECISION_TIMELINES.map((tl) => (
          <OptionCard
            key={tl}
            selected={state.decisionTimeline === tl}
            onClick={() => updateState({ decisionTimeline: tl })}
            icon={TIMELINE_ICONS[tl]}
            label={t(`exp_${tl}`)}
          />
        ))}
      </div>

      {/* Prior Experience */}
      <SectionHeading>{t('exp_experience')}</SectionHeading>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {EXPERIENCE_LEVELS.map((lvl) => (
          <OptionCard
            key={lvl}
            selected={state.experienceLevel === lvl}
            onClick={() => updateState({ experienceLevel: lvl })}
            icon={EXPERIENCE_ICONS[lvl]}
            label={t(`exp_${lvl}`)}
          />
        ))}
      </div>

      {/* Investment Range */}
      <SectionHeading>{t('exp_investmentRange')}</SectionHeading>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {INVESTMENT_RANGES.map((range) => (
          <OptionCard
            key={range}
            selected={state.investmentRange === range}
            onClick={() => updateState({ investmentRange: range })}
            icon={INVESTMENT_ICONS[range]}
            label={t(`exp_${range}`)}
          />
        ))}
      </div>

      {/* Priority Ranking */}
      <SectionHeading>{t('exp_priority')}</SectionHeading>
      <p className="text-sm text-muted-foreground mb-3">{t('exp_priority')}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {PRIORITIES.map((p) => {
          const rank = priorityRank(p);
          return (
            <OptionCard
              key={p}
              selected={rank > 0}
              onClick={() => togglePriority(p)}
              label={t(`exp_priority${p.charAt(0).toUpperCase() + p.slice(1)}`)}
              badge={rank > 0 ? String(rank) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
