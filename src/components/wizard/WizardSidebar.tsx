import { useState } from 'react';
import {
  Briefcase,
  Printer,
  Settings,
  Target,
  ShoppingCart,
  FileText,
  User,
  ChevronUp,
  ChevronDown,
  Package,
} from 'lucide-react';
import type { WizardState, WizardStep } from '@/lib/wizardTypes';
import { printerModels } from '@/lib/printerData';
import { parsePrice, formatPrice } from '@/lib/quoteUtils';
import { cn } from '@/lib/utils';

interface WizardSidebarProps {
  state: WizardState;
  currentStep: WizardStep;
  t: (key: string) => string;
}

function getSelectedModelNames(selectedProducts: string[]): string[] {
  return selectedProducts
    .map((id) => {
      const model = printerModels.find((m) => m.id === id);
      return model ? model.fullName : id;
    });
}

function getEstimatedTotal(selectedProducts: string[]): number | null {
  let total = 0;
  let hasPrice = false;
  for (const id of selectedProducts) {
    const model = printerModels.find((m) => m.id === id);
    if (model?.price) {
      const price = parsePrice(model.price);
      if (price !== null) {
        total += price;
        hasPrice = true;
      }
    }
  }
  return hasPrice ? total : null;
}

interface SectionProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function SummarySection({ icon, label, children }: SectionProps) {
  return (
    <div className="py-3 px-1 animate-in fade-in slide-in-from-right-2 duration-300" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div className="border-l-2 border-primary pl-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-muted-foreground">{icon}</span>
          <span className="text-label text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="text-sm text-foreground pl-6">{children}</div>
      </div>
    </div>
  );
}

function SummaryContent({ state, t }: { state: WizardState; t: (key: string) => string }) {
  const modelNames = getSelectedModelNames(state.selectedProducts);
  const estimatedTotal = getEstimatedTotal(state.selectedProducts);

  return (
    <div className="space-y-0">
      {/* Step 1: Business Profile */}
      {state.businessProfile.length > 0 && (
        <SummarySection
          icon={<Briefcase className="w-4 h-4" />}
          label={t('ws_step1')}
        >
          <p>{state.businessProfile.map(bp => t('bp_' + bp)).join(', ')}</p>
        </SummarySection>
      )}

      {/* Step 2: Production Type */}
      {state.productionType.length > 0 && (
        <SummarySection
          icon={<Printer className="w-4 h-4" />}
          label={t('ws_step2')}
        >
          <p>{state.productionType.map(pt => t('pr_' + pt)).join(', ')}</p>
        </SummarySection>
      )}

      {/* Step 3: Technical Config */}
      {state.productionType.length > 0 && (
        <Step3Summary state={state} t={t} />
      )}

      {/* Step 4: Expectations */}
      {(state.investmentRange || state.decisionTimeline || state.priorities.length > 0) && (
        <SummarySection
          icon={<Target className="w-4 h-4" />}
          label={t('ws_step4')}
        >
          <div className="space-y-1">
            {state.investmentRange && (
              <p>{t(`exp_${state.investmentRange}`)}</p>
            )}
            {state.decisionTimeline && (
              <p className="text-muted-foreground text-xs">{t(`exp_${state.decisionTimeline}`)}</p>
            )}
            {state.priorities.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {state.priorities.map((p) => t(`exp_priority${p.charAt(0).toUpperCase() + p.slice(1)}`)).join(', ')}
              </p>
            )}
          </div>
        </SummarySection>
      )}

      {/* Step 5: Selected Models */}
      {state.selectedProducts.length > 0 && (
        <SummarySection
          icon={<ShoppingCart className="w-4 h-4" />}
          label={t('ws_step5')}
        >
          <div className="space-y-1">
            <p className="font-medium">
              {state.selectedProducts.length}{' '}
              {state.selectedProducts.length === 1 ? t('model') : t('models')}
            </p>
            {modelNames.map((name) => (
              <p key={name} className="text-xs text-muted-foreground">{name}</p>
            ))}
            {state.selectedAccessories.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                + {state.selectedAccessories.length} {t('accessories')}
              </p>
            )}
          </div>
        </SummarySection>
      )}

      {/* Step 6: Notes */}
      {state.notes.trim() && (
        <SummarySection
          icon={<FileText className="w-4 h-4" />}
          label={t('ws_step6')}
        >
          <p className="text-xs text-muted-foreground line-clamp-3">{state.notes}</p>
        </SummarySection>
      )}

      {/* Step 7: Customer */}
      {(state.customerName || state.customerEmail) && (
        <SummarySection
          icon={<User className="w-4 h-4" />}
          label={t('ws_step7')}
        >
          <div className="space-y-0.5">
            {state.customerName && <p className="font-medium">{state.customerName}</p>}
            {state.customerEmail && (
              <p className="text-xs text-muted-foreground">{state.customerEmail}</p>
            )}
          </div>
        </SummarySection>
      )}

      {/* Estimated Total */}
      {estimatedTotal !== null && (
        <div className="pt-3 px-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{t('wizard_estimatedTotal')}</span>
            <span className="text-price">
              {formatPrice(estimatedTotal)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Step3Summary({ state, t }: { state: WizardState; t: (key: string) => string }) {
  const hasUvData =
    state.productionType.includes('uvPrinting') &&
    (state.uvMaxSize.length > 0 || state.uvSurfaceType.length > 0 || state.uvMaterials.length > 0);
  const hasTextileData =
    state.productionType.includes('textileDtgDtf') &&
    (state.textileMethod || state.textilePrintSize);
  const hasLaserData =
    state.productionType.includes('laserCutting') &&
    (state.laserWorkType || state.laserMaterial);
  const hasPackagingData =
    state.productionType.includes('packaging') &&
    (state.packagingContainerType.length > 0 || state.packagingMaterial);
  const hasCardData =
    state.productionType.includes('pvcCards') &&
    (state.cardMaterial || state.cardFormat);

  if (!hasUvData && !hasTextileData && !hasLaserData && !hasPackagingData && !hasCardData) {
    return null;
  }

  return (
    <SummarySection
      icon={<Settings className="w-4 h-4" />}
      label={t('ws_step3')}
    >
      <div className="space-y-1 text-xs">
        {hasUvData && (
          <>
            {state.uvMaxSize.length > 0 && <p>{state.uvMaxSize.map(s => s.toUpperCase()).join(', ')}</p>}
            {state.uvSurfaceType.length > 0 && (
              <p className="text-muted-foreground">{state.uvSurfaceType.map(s => t('tc_' + s)).join(', ')}</p>
            )}
            {state.uvMaterials.length > 0 && (
              <p className="text-muted-foreground">
                {state.uvMaterials.map((m) => t(`tc_material_${m}`)).join(', ')}
              </p>
            )}
          </>
        )}
        {hasTextileData && (
          <>
            {state.textileMethod && <p>{t(`tc_${state.textileMethod}`)}</p>}
            {state.textilePrintSize && (
              <p className="text-muted-foreground">{state.textilePrintSize.toUpperCase()}</p>
            )}
          </>
        )}
        {hasLaserData && (
          <>
            {state.laserWorkType && <p>{t(`tc_laser${state.laserWorkType.charAt(0).toUpperCase() + state.laserWorkType.slice(1)}`)}</p>}
            {state.laserMaterial && (
              <p className="text-muted-foreground">{t(`tc_material_${state.laserMaterial}`)}</p>
            )}
          </>
        )}
        {hasPackagingData && (
          <>
            {state.packagingContainerType.length > 0 && <p>{state.packagingContainerType.map(ct => t(`tc_container_${ct}`)).join(', ')}</p>}
            {state.packagingMaterial && (
              <p className="text-muted-foreground">{t(`tc_material_${state.packagingMaterial}`)}</p>
            )}
          </>
        )}
        {hasCardData && (
          <>
            {state.cardMaterial && <p>{t(`tc_card_${state.cardMaterial}`)}</p>}
            {state.cardFormat && (
              <p className="text-muted-foreground">{t(`tc_card_${state.cardFormat}`)}</p>
            )}
          </>
        )}
      </div>
    </SummarySection>
  );
}

export function WizardSidebar({ state, currentStep, t }: WizardSidebarProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const modelNames = getSelectedModelNames(state.selectedProducts);
  const estimatedTotal = getEstimatedTotal(state.selectedProducts);

  const hasSummaryData =
    state.businessProfile.length > 0 ||
    state.productionType.length > 0 ||
    state.selectedProducts.length > 0 ||
    state.customerName;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed right-0 top-0 pt-[73px] w-72 h-full bg-[#f0ede7] z-30" style={{ borderLeft: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="h-full overflow-y-auto px-4 py-4">
          <h3 className="text-label text-muted-foreground mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            {t('wizard_sidebarTitle')}
          </h3>
          {hasSummaryData ? (
            <SummaryContent state={state} t={t} />
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {t('ws_no_selections')}
            </p>
          )}
        </div>
      </aside>

      {/* Mobile bottom panel */}
      <div className="lg:hidden">
        {/* Collapsed bar */}
        <div
          className={cn(
            'fixed bottom-0 inset-x-0 z-40 bg-card transition-all duration-300',
            mobileExpanded ? 'rounded-t-xl' : ''
          )}
          style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
        >
          {/* Drag handle / toggle bar */}
          <button
            type="button"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="w-full h-14 flex items-center justify-between px-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground">
                {t('ws_step_label')} {currentStep}/7
              </span>
              {state.selectedProducts.length > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {state.selectedProducts.length} {state.selectedProducts.length === 1 ? t('model') : t('models')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {estimatedTotal !== null && (
                <span className="text-price">
                  {formatPrice(estimatedTotal)}
                </span>
              )}
              {mobileExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </button>

          {/* Expanded content */}
          <div
            className={cn(
              'overflow-hidden transition-all duration-300 ease-in-out',
              mobileExpanded ? 'max-h-[60vh]' : 'max-h-0'
            )}
          >
            <div className="overflow-y-auto max-h-[calc(60vh-3.5rem)] px-4 pb-4">
              {hasSummaryData ? (
                <SummaryContent state={state} t={t} />
              ) : (
                <p className="text-sm text-muted-foreground italic py-4">
                  {t('ws_no_selections')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Spacer to prevent content from being hidden behind the fixed bar */}
        <div className="h-14" />
      </div>
    </>
  );
}
