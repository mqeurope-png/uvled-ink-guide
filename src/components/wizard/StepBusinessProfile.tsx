import {
  Store, PanelTop, Palette, ShoppingCart, Factory,
  UtensilsCrossed, User, MoreHorizontal, Check,
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
  const toggleProfile = (profile: BusinessProfile) => {
    const current = state.businessProfile;
    if (current.includes(profile)) {
      updateState({ businessProfile: current.filter(p => p !== profile) });
    } else {
      updateState({ businessProfile: [...current, profile] });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">PASO 01</p>
        <h3 className="text-display text-[32px] leading-tight mb-2">{t('ws_step1')}</h3>
        <p className="text-base text-muted-foreground max-w-[520px]">{t('bp_subtitle') || 'Selecciona uno o más perfiles que describan tu negocio.'}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {BUSINESS_PROFILES.map((profile) => {
          const Icon = PROFILE_ICONS[profile];
          const isSelected = state.businessProfile.includes(profile);

          return (
            <button
              key={profile}
              type="button"
              onClick={() => toggleProfile(profile)}
              className={`
                relative flex flex-col items-start gap-3 rounded-lg p-6 text-left
                transition-shadow transition-colors duration-200 cursor-pointer
                ${isSelected
                  ? 'bg-[#fdf0eb] border-2 border-primary shadow-[0_8px_20px_rgba(232,82,42,0.2)]'
                  : 'bg-card border border-[rgba(0,0,0,0.08)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.16)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]'
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
