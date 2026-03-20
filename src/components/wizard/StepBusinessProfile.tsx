import { motion } from 'framer-motion';
import {
  Store,
  PanelTop,
  Palette,
  ShoppingCart,
  Factory,
  UtensilsCrossed,
  User,
  MoreHorizontal,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { WizardState, BusinessProfile, BUSINESS_PROFILES } from '@/lib/wizardTypes';

interface StepProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  t: (key: string) => string;
}

const PROFILE_ICONS: Record<BusinessProfile, LucideIcon> = {
  personalization: Store,
  signage: PanelTop,
  designStudio: Palette,
  ecommerce: ShoppingCart,
  industry: Factory,
  hospitality: UtensilsCrossed,
  personal: User,
  other: MoreHorizontal,
};

export function StepBusinessProfile({ state, updateState, t }: StepProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {BUSINESS_PROFILES.map((profile) => {
        const Icon = PROFILE_ICONS[profile];
        const isSelected = state.businessProfile === profile;

        return (
          <motion.button
            key={profile}
            type="button"
            onClick={() => updateState({ businessProfile: profile })}
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
            <Icon className={`h-8 w-8 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
            <div>
              <p className="font-medium">{t(`bp_${profile}`)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t(`bp_${profile}Desc`)}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
