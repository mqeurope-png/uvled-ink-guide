import {
  Store,
  PanelTop,
  Palette,
  ShoppingCart,
  Factory,
  UtensilsCrossed,
  User,
  MoreHorizontal,
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
          <button
            key={profile}
            type="button"
            onClick={() => updateState({ businessProfile: profile })}
            className={`
              flex flex-col items-start gap-3 border rounded-lg p-6 text-left
              transition-all duration-150 cursor-pointer
              hover:border-foreground/50 hover:shadow-sm
              ${
                isSelected
                  ? 'border-foreground bg-muted'
                  : 'border-border-subtle'
              }
            `}
          >
            <Icon className="h-8 w-8" />
            <div>
              <p className="font-medium">{t(`bp_${profile}`)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t(`bp_${profile}Desc`)}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
