import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { QuoteWizard } from '@/components/QuoteWizard';
import { WizardState, initialWizardState } from '@/lib/wizardTypes';

// Pre-filled demo state
const demoState: Partial<WizardState> = {
  businessProfile: ['personalization'],
  productionType: ['uvPrinting'],
  uvMaxSize: ['a3'],
  uvSurfaceType: ['flat'],
  uvMaterials: ['plastic', 'wood'],
  uvSpecialEffects: [],
  uvProductionVolume: 50,
  decisionTimeline: 'threeMonths',
  experienceLevel: 'beginner',
  investmentRange: '5to15k',
  priorities: ['quality', 'easeOfUse'],
};

export default function Demo() {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Store demo state so QuoteWizard can pick it up
    const state = { ...initialWizardState, ...demoState };
    localStorage.setItem('uv-led-wizard-demo', JSON.stringify({ state, currentStep: 5 }));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Demo banner */}
      {showBanner && (
        <div className="bg-primary text-white py-3 px-4 flex items-center justify-center gap-4 relative z-50">
          <span className="text-sm font-medium">Modo Demo — Datos de ejemplo precargados</span>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/20 rounded p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <QuoteWizard
        open={true}
        onOpenChange={() => {}}
        demoMode={true}
      />
    </div>
  );
}
