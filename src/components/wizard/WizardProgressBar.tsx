import { Check } from 'lucide-react';
import type { WizardStep } from '@/lib/wizardTypes';
import { cn } from '@/lib/utils';

interface WizardProgressBarProps {
  currentStep: WizardStep;
  totalSteps: 7;
  onStepClick: (step: WizardStep) => void;
  isStepAccessible: (step: WizardStep) => boolean;
  t: (key: string) => string;
}

const STEP_KEYS = [
  'ws_step1', 'ws_step2', 'ws_step3', 'ws_step4',
  'ws_step5', 'ws_step6', 'ws_step7',
] as const;

export function WizardProgressBar({
  currentStep, totalSteps, onStepClick, isStepAccessible, t,
}: WizardProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100) + '%';

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
      {/* Desktop view */}
      <div className="hidden md:block px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {Array.from({ length: totalSteps }, (_, i) => {
            const step = (i + 1) as WizardStep;
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            const accessible = isStepAccessible(step);

            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => {
                    if (accessible || isCompleted || isCurrent) onStepClick(step);
                  }}
                  disabled={!accessible && !isCompleted && !isCurrent}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className={cn(
                      'relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all duration-300',
                      isCompleted && 'bg-primary text-white cursor-pointer hover:brightness-[0.92] step-completed-glow',
                      isCurrent && 'bg-primary text-white cursor-pointer step-current-pulse',
                      !isCompleted && !isCurrent && accessible && 'bg-muted text-muted-foreground cursor-pointer hover:bg-primary/10 hover:text-primary',
                      !isCompleted && !isCurrent && !accessible && 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium transition-all duration-300 whitespace-nowrap',
                      isCompleted && 'text-foreground',
                      isCurrent && 'text-primary font-semibold',
                      !isCompleted && !isCurrent && 'text-muted-foreground'
                    )}
                  >
                    {t(STEP_KEYS[i])}
                  </span>
                </button>

                {step < totalSteps && (
                  <div className="flex-1 mx-2 mt-[-1.25rem]">
                    <div
                      className={cn(
                        'h-0.5 rounded-full transition-all duration-300',
                        step < currentStep ? 'bg-primary' : 'bg-muted'
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold step-current-pulse">
              {currentStep}
            </span>
            <span className="text-sm font-medium">{t(STEP_KEYS[currentStep - 1])}</span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">{percentage}</span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: percentage }}
          />
        </div>
      </div>
    </div>
  );
}
