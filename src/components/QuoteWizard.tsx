import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { ArrowRight, ArrowLeft, Save, Download, Send, Video, BookmarkCheck, KeyRound } from 'lucide-react';
import {
  WizardState,
  WizardStep,
  initialWizardState,
  isStepValid,
} from '@/lib/wizardTypes';
import { printerModels } from '@/lib/printerData';
import { parsePrice, formatPrice } from '@/lib/quoteUtils';
import {
  autoSaveWizard,
  saveWizardWithCode,
  loadWizardByCode,
  clearAutoSavedWizard,
  loadAutoSavedWizard,
} from '@/lib/wizardStorage';
import { WizardProgressBar } from './wizard/WizardProgressBar';
import { WizardSidebar } from './wizard/WizardSidebar';
import { StepBusinessProfile } from './wizard/StepBusinessProfile';
import { StepProduction } from './wizard/StepProduction';
import { StepTechnicalConfig } from './wizard/StepTechnicalConfig';
import { StepExpectations } from './wizard/StepExpectations';
import { StepRecommendations } from './wizard/StepRecommendations';
import { StepQuoteSummary } from './wizard/StepQuoteSummary';
import { StepCustomerData } from './wizard/StepCustomerData';

interface QuoteWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialModelId?: string;
}

export function QuoteWizard({ open, onOpenChange, initialModelId }: QuoteWizardProps) {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [state, setState] = useState<WizardState>(initialWizardState);
  const [saveCode, setSaveCode] = useState<string>('');
  const [showSaveCode, setShowSaveCode] = useState(false);
  const [loadCodeInput, setLoadCodeInput] = useState('');
  const [loadCodeError, setLoadCodeError] = useState(false);
  const [showLoadCode, setShowLoadCode] = useState(false);

  // Reset or restore on open
  useEffect(() => {
    if (open) {
      if (initialModelId) {
        setState(prev => ({
          ...initialWizardState,
          productionType: 'uvPrinting',
          selectedProducts: [initialModelId],
        }));
        setCurrentStep(5);
      } else {
        const saved = loadAutoSavedWizard();
        if (saved && saved.state.businessProfile) {
          setState(saved.state);
          setCurrentStep(saved.currentStep);
        } else {
          setState(initialWizardState);
          setCurrentStep(1);
        }
      }
      setSaveCode('');
      setShowSaveCode(false);
      setShowLoadCode(false);
      setLoadCodeError(false);
    }
  }, [open, initialModelId]);

  // Auto-save on state changes
  useEffect(() => {
    if (open && state.businessProfile) {
      autoSaveWizard(state, currentStep);
    }
  }, [state, currentStep, open]);

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback((step: WizardStep) => {
    setCurrentStep(step);
  }, []);

  const isStepAccessible = useCallback((step: WizardStep): boolean => {
    if (step === 1) return true;
    // Can access a step if all previous steps are valid
    for (let i = 1; i < step; i++) {
      if (!isStepValid(i as WizardStep, state)) return false;
    }
    return true;
  }, [state]);

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  };

  const handleSaveForLater = () => {
    const code = saveWizardWithCode(state, currentStep);
    setSaveCode(code);
    setShowSaveCode(true);
  };

  const handleLoadCode = () => {
    const result = loadWizardByCode(loadCodeInput);
    if (result) {
      setState(result.state);
      setCurrentStep(result.currentStep);
      setShowLoadCode(false);
      setLoadCodeError(false);
    } else {
      setLoadCodeError(true);
    }
  };

  const handleExportPDF = () => {
    const content = generateQuoteHTML();
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(content);
      iframeDoc.close();
      iframe.onload = () => {
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      };
      setTimeout(() => {
        try { iframe.contentWindow?.print(); } catch { /* already printing */ }
        setTimeout(() => {
          if (iframe.parentNode) document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  };

  const handleSendEmail = () => {
    const models = getSelectedModelsData();
    const total = calculateTotal();
    const subject = encodeURIComponent(`${t('quote')} BOMEDIA - UV LED`);
    const body = encodeURIComponent([
      `${t('quote')} BOMEDIA`,
      '',
      `${t('customerData')}:`,
      `- ${t('cd_name')}: ${state.customerName}`,
      `- ${t('cd_company')}: ${state.customerCompany}`,
      `- ${t('cd_email')}: ${state.customerEmail}`,
      `- ${t('cd_phone')}: ${state.customerPhone}`,
      `- ${t('cd_country')}: ${state.customerCountry}`,
      '',
      `${t('rec_title')}:`,
      ...models.map(m => `- ${m.fullName}: ${m.price || '-'}`),
      '',
      state.selectedAccessories.length > 0 ? [
        `${t('accessories')}:`,
        ...state.selectedAccessories.map(a => `- ${a.name}: ${a.price || '-'}`),
        '',
      ].join('\n') : '',
      `${t('total')}: ${formatPrice(total)} ${getTaxLabel()}`,
      '',
      state.notes ? `${t('sum_notes')}: ${state.notes}` : '',
    ].filter(Boolean).join('\n'));

    window.location.href = `mailto:manel@bomedia.net?subject=${subject}&body=${body}`;
  };

  const handleRequestDemo = () => {
    const subject = encodeURIComponent(t('wizard_requestDemoSubject'));
    const body = encodeURIComponent([
      t('wizard_requestDemoSubject'),
      '',
      `${t('cd_name')}: ${state.customerName}`,
      `${t('cd_company')}: ${state.customerCompany}`,
      `${t('cd_email')}: ${state.customerEmail}`,
      `${t('cd_phone')}: ${state.customerPhone}`,
      '',
      `${t('rec_title')}:`,
      ...getSelectedModelsData().map(m => `- ${m.fullName}`),
    ].join('\n'));

    window.location.href = `mailto:manel@bomedia.net?subject=${subject}&body=${body}`;
  };

  const handleFinish = () => {
    handleSendEmail();
    clearAutoSavedWizard();
    onOpenChange(false);
  };

  // Helpers
  const getSelectedModelsData = () =>
    printerModels.filter(m => state.selectedProducts.includes(m.id));

  const calculateTotal = (): number => {
    let total = 0;
    getSelectedModelsData().forEach(m => {
      const p = parsePrice(m.price);
      if (p) total += p;
    });
    state.selectedAccessories.forEach(a => {
      const p = parsePrice(a.price);
      if (p) total += p;
    });
    return total;
  };

  const getTaxLabel = () => {
    switch (language) {
      case 'fr': return 'HT';
      case 'de': return 'zzgl. MwSt.';
      case 'nl': return 'excl. BTW';
      default: return '+ IVA';
    }
  };

  const generateQuoteHTML = (): string => {
    const models = getSelectedModelsData();
    const total = calculateTotal();
    const locale = language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-US';
    const date = new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    const quoteNum = `BM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="200" height="50"><rect width="320" height="80" rx="6" fill="#1a1a1a"/><text x="20" y="52" font-family="Segoe UI,Arial,Helvetica,sans-serif" font-size="38" font-weight="700" letter-spacing="6" fill="#fff">BOMEDIA</text><text x="248" y="36" font-family="Segoe UI,Arial,Helvetica,sans-serif" font-size="10" font-weight="400" letter-spacing="1.5" fill="#9ca3af">UV LED</text><text x="240" y="52" font-family="Segoe UI,Arial,Helvetica,sans-serif" font-size="10" font-weight="400" letter-spacing="1.5" fill="#9ca3af">PRINTERS</text></svg>`;
    const logoDataUri = `data:image/svg+xml;base64,${btoa(logoSvg)}`;

    const modelsRows = models.map((m, i) => `
      <tr style="background: ${i % 2 === 0 ? '#ffffff' : '#fafafa'};">
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb;">
          <strong style="font-size: 14px;">${m.fullName}</strong><br>
          <span style="color: #6b7280; font-size: 11px;">${t('printArea')}: ${m.specs.printArea} &middot; ${t('maxHeight')}: ${m.specs.maxHeight} &middot; ${m.specs.resolution} &middot; ${m.specs.headType}</span>
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: center;">1</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; white-space: nowrap; font-weight: 600;">${m.price || '-'}</td>
      </tr>`).join('');

    const accessoriesRows = state.selectedAccessories.map((acc, i) => {
      const model = models.find(m => m.id === acc.modelId);
      return `
      <tr style="background: ${(models.length + i) % 2 === 0 ? '#ffffff' : '#fafafa'};">
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb;">
          ${acc.name}<br>
          <span style="color: #6b7280; font-size: 11px;">${t('forModel')}: ${model?.name || acc.modelId}</span>
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: center;">1</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; white-space: nowrap; font-weight: 600;">${acc.price || '-'}</td>
      </tr>`;
    }).join('');

    const hasCustomer = state.customerName || state.customerCompany || state.customerEmail || state.customerPhone;

    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${t('quote')} ${quoteNum} - BOMEDIA</title>
<style>
@media print { body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; } @page { margin: 15mm 10mm; } }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', -apple-system, sans-serif; color: #1a1a1a; line-height: 1.5; background: #fff; font-size: 13px; }
.page { max-width: 800px; margin: 0 auto; padding: 40px; }
.bar { height: 4px; background: linear-gradient(90deg, #1a1a1a 0%, #4b5563 50%, #9ca3af 100%); border-radius: 2px; }
</style></head><body><div class="page">
<div class="bar" style="margin-bottom: 32px;"></div>
<table style="width: 100%; margin-bottom: 32px;"><tr>
<td><img src="${logoDataUri}" alt="BOMEDIA" style="height: 50px;" /></td>
<td style="text-align: right; color: #6b7280; font-size: 12px; line-height: 1.9;">
<strong style="color: #374151;">www.boprint.net</strong><br>manel@bomedia.net<br>+34 682 62 70 56</td>
</tr></table>
<table style="width: 100%; background: #1a1a1a; color: #fff; border-radius: 6px; margin-bottom: 28px;"><tr>
<td style="padding: 18px 24px;"><span style="font-size: 22px; font-weight: 700; letter-spacing: 2px;">${t('quote').toUpperCase()}</span></td>
<td style="padding: 18px 24px; text-align: right;">
<span style="font-size: 12px; opacity: 0.7;">${t('quoteNumber')}</span> <span style="font-size: 15px; font-weight: 600;">${quoteNum}</span>
<span style="margin: 0 14px; opacity: 0.3;">|</span>
<span style="font-size: 12px; opacity: 0.7;">${t('quoteDate')}</span> <span style="font-size: 15px; font-weight: 600;">${date}</span>
</td></tr></table>
<table style="width: 100%; margin-bottom: 28px;"><tr>
${hasCustomer ? `<td style="width: 50%; vertical-align: top; padding-right: 14px;">
<div style="font-size: 10px; text-transform: uppercase; letter-spacing: 2.5px; color: #9ca3af; margin-bottom: 10px; font-weight: 700;">${t('billTo')}</div>
<div style="background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px;">
${state.customerName ? `<div style="font-size: 16px; font-weight: 700;">${state.customerName}</div>` : ''}
${state.customerCompany ? `<div style="font-size: 13px; color: #374151; margin-bottom: 10px;">${state.customerCompany}</div>` : ''}
${state.customerEmail ? `<div style="font-size: 12px; color: #6b7280;">&#9993; ${state.customerEmail}</div>` : ''}
${state.customerPhone ? `<div style="font-size: 12px; color: #6b7280;">&#9742; ${state.customerPhone}</div>` : ''}
${state.customerCountry ? `<div style="font-size: 12px; color: #6b7280;">${state.customerCountry}</div>` : ''}
</div></td>` : ''}
<td style="vertical-align: top; ${hasCustomer ? 'padding-left: 14px;' : ''}">
<div style="font-size: 10px; text-transform: uppercase; letter-spacing: 2.5px; color: #9ca3af; margin-bottom: 10px; font-weight: 700;">${t('tc_title')}</div>
<div style="background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px; font-size: 13px; color: #374151;">
${state.productionType ? `<div>${t(`pr_${state.productionType}`)}</div>` : ''}
${state.uvMaxSize ? `<div>${t('tc_uvMaxSize')}: ${state.uvMaxSize.toUpperCase()}</div>` : ''}
${state.uvSurfaceType ? `<div>${t('tc_surfaceType')}: ${t(`tc_${state.uvSurfaceType}`)}</div>` : ''}
${state.uvMaterials.length > 0 ? `<div>${t('tc_materials')}: ${state.uvMaterials.map(m => t(`tc_material_${m}`)).join(', ')}</div>` : ''}
</div></td>
</tr></table>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 8px; border: 1px solid #e5e7eb;">
<thead><tr style="background: #1a1a1a;">
<th style="padding: 13px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #fff; font-weight: 600;">${t('description')}</th>
<th style="padding: 13px 16px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #fff; font-weight: 600; width: 80px;">${t('quantity')}</th>
<th style="padding: 13px 16px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #fff; font-weight: 600; width: 140px;">${t('unitPrice')}</th>
</tr></thead><tbody>${modelsRows}${accessoriesRows}</tbody></table>
<table style="width: 100%; margin-bottom: 28px;"><tr>
<td style="width: 55%;"></td><td style="width: 45%;">
<table style="width: 100%; border-collapse: collapse;"><tr style="border-top: 2px solid #1a1a1a;">
<td style="padding: 16px; font-weight: 700; font-size: 18px;">${t('total')} ${getTaxLabel()}</td>
<td style="padding: 16px; font-weight: 800; font-size: 22px; text-align: right;">${formatPrice(total)}</td>
</tr></table></td></tr></table>
${state.notes ? `<div style="background: #fefce8; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 28px;">
<div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #92400e; font-weight: 700; margin-bottom: 6px;">${t('sum_notes')}</div>
<div style="font-size: 13px; color: #78350f;">${state.notes}</div></div>` : ''}
<div style="border-top: 2px solid #e5e7eb; padding-top: 20px;">
<div style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af; font-weight: 700; margin-bottom: 8px;">${t('quoteTerms')}</div>
<p style="font-size: 11px; color: #9ca3af; line-height: 1.8;">${t('quoteValidDays')}<br>${t('quoteDisclaimer')}</p>
</div>
<div class="bar" style="margin-top: 28px; margin-bottom: 16px;"></div>
<table style="width: 100%;"><tr><td style="text-align: center; color: #9ca3af; font-size: 10px; letter-spacing: 1.5px; line-height: 1.8;">
<strong style="color: #6b7280; font-size: 11px; letter-spacing: 3px;">BOMEDIA</strong><br>
www.boprint.net &middot; manel@bomedia.net &middot; +34 682 62 70 56
</td></tr></table>
</div></body></html>`;
  };

  const renderStep = () => {
    const stepProps = { state, updateState, t };
    switch (currentStep) {
      case 1: return <StepBusinessProfile {...stepProps} />;
      case 2: return <StepProduction {...stepProps} />;
      case 3: return <StepTechnicalConfig {...stepProps} />;
      case 4: return <StepExpectations {...stepProps} />;
      case 5: return <StepRecommendations {...stepProps} />;
      case 6: return (
        <StepQuoteSummary
          {...stepProps}
          onExportPDF={handleExportPDF}
          onSendEmail={handleSendEmail}
          onRequestDemo={handleRequestDemo}
        />
      );
      case 7: return <StepCustomerData {...stepProps} />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] p-0 gap-0 overflow-hidden">
        {/* Progress Bar */}
        <WizardProgressBar
          currentStep={currentStep}
          totalSteps={7}
          onStepClick={goToStep}
          isStepAccessible={isStepAccessible}
          t={t}
        />

        <div className="flex flex-1 overflow-hidden" style={{ maxHeight: 'calc(95vh - 140px)' }}>
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {/* Save/Load bar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <h2 className="text-2xl text-slim">{t('wizard_title')}</h2>
              <div className="flex items-center gap-2">
                {!showLoadCode ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setShowLoadCode(true)} className="gap-1.5 text-xs text-muted-foreground">
                      <KeyRound className="h-3.5 w-3.5" />
                      {t('wizard_loadCode')}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleSaveForLater} className="gap-1.5 text-xs text-muted-foreground">
                      <Save className="h-3.5 w-3.5" />
                      {t('wizard_saveForLater')}
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      value={loadCodeInput}
                      onChange={e => { setLoadCodeInput(e.target.value.toUpperCase()); setLoadCodeError(false); }}
                      placeholder={t('wizard_loadCodePlaceholder')}
                      className={`w-36 h-8 text-xs uppercase ${loadCodeError ? 'border-red-400' : ''}`}
                    />
                    <Button size="sm" variant="outline" onClick={handleLoadCode} className="h-8 text-xs">
                      {t('wizard_loadCodeBtn')}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowLoadCode(false)} className="h-8 text-xs">
                      ✕
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Save code display */}
            {showSaveCode && saveCode && (
              <div className="mb-6 bg-muted/50 border border-border-subtle rounded-lg p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <BookmarkCheck className="h-5 w-5 text-green-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('wizard_savedCode')}: <span className="font-mono text-lg tracking-wider">{saveCode}</span></p>
                  <p className="text-xs text-muted-foreground">{t('wizard_savedCodeMsg')}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setShowSaveCode(false)}>✕</Button>
              </div>
            )}

            {/* Step Content */}
            <div className="animate-in fade-in duration-200">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('wizard_back')}
              </Button>

              {currentStep < 7 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep, state)}
                  className="gap-2"
                >
                  {t('wizard_next')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={!isStepValid(7, state)}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {t('wizard_finish')}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Desktop only */}
          <div className="hidden lg:block">
            <WizardSidebar state={state} currentStep={currentStep} t={t} />
          </div>
        </div>

        {/* Sidebar - Mobile bottom panel */}
        <div className="lg:hidden">
          <WizardSidebar state={state} currentStep={currentStep} t={t} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
