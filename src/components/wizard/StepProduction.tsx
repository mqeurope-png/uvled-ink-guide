import {
  Printer,
  Shirt,
  Package,
  Zap,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';
import { WizardState, ProductionType, PRODUCTION_TYPES } from '@/lib/wizardTypes';

interface StepProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  t: (key: string) => string;
}

const PRODUCTION_ICONS: Record<ProductionType, LucideIcon> = {
  uvPrinting: Printer,
  textileDtgDtf: Shirt,
  packaging: Package,
  laserCutting: Zap,
  pvcCards: CreditCard,
};

const PRODUCTION_BADGES: Record<ProductionType, string> = {
  uvPrinting: 'UV LED',
  textileDtgDtf: 'Coming soon',
  packaging: 'Coming soon',
  laserCutting: 'Coming soon',
  pvcCards: 'Coming soon',
};

export function StepProduction({ state, updateState, t }: StepProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {PRODUCTION_TYPES.map((type) => {
        const Icon = PRODUCTION_ICONS[type];
        const isSelected = state.productionType === type;
        const badge = PRODUCTION_BADGES[type];
        const isComingSoon = type !== 'uvPrinting';

        return (
          <button
            key={type}
            type="button"
            onClick={() => updateState({ productionType: type })}
            className={`
              relative flex flex-col items-start gap-3 border rounded-lg p-6 text-left
              transition-all duration-150 cursor-pointer
              hover:border-foreground/50 hover:shadow-sm
              ${
                isSelected
                  ? 'border-foreground bg-muted'
                  : 'border-border-subtle'
              }
            `}
          >
            <span
              className={`
                absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full
                ${
                  isComingSoon
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary/10 text-primary'
                }
              `}
            >
              {badge}
            </span>
            <Icon className={`h-8 w-8 ${isComingSoon ? 'opacity-60' : ''}`} />
            <div>
              <p className={`font-medium ${isComingSoon ? 'opacity-70' : ''}`}>
                {t(`pr_${type}`)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t(`pr_${type}Desc`)}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
