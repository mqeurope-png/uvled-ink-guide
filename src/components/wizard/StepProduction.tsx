import { motion } from 'framer-motion';
import {
  Printer,
  Shirt,
  Package,
  Zap,
  CreditCard,
  Check,
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
          <motion.button
            key={type}
            type="button"
            onClick={() => updateState({ productionType: type })}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative flex flex-col items-start gap-3 rounded-lg p-6 text-left
              transition-shadow duration-200 cursor-pointer
              ${isSelected
                ? 'bg-[#fdf0eb] border-2 border-primary'
                : 'bg-card border border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.16)] hover:shadow-md'
              }
            `}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            {!isSelected && (
              <span
                className={`
                  absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full
                  ${isComingSoon
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary/10 text-primary'
                  }
                `}
              >
                {badge}
              </span>
            )}
            <Icon className={`h-8 w-8 ${isComingSoon ? 'opacity-60' : ''} ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
            <div>
              <p className={`font-medium ${isComingSoon ? 'opacity-70' : ''}`}>
                {t(`pr_${type}`)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t(`pr_${type}Desc`)}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
