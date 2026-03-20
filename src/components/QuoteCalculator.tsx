import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Download, Mail, Save, Trash2, Circle, Square, Check, User } from 'lucide-react';
import { PrinterModel, Accessory } from '@/lib/printerData';
import { getCompatibleModels, parsePrice, formatPrice } from '@/lib/quoteUtils';
import { QuoteItem, CustomerData, saveQuote, generateQuoteId, getStoredQuotes, deleteQuote } from '@/lib/quoteStorage';

interface QuoteCalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialModelId?: string;
}

export function QuoteCalculator({ open, onOpenChange, initialModelId }: QuoteCalculatorProps) {
  const { t, language } = useLanguage();

  // Step state
  const [currentStep, setCurrentStep] = useState<'measures' | 'models' | 'accessories' | 'customer' | 'summary'>('measures');

  // Measures state
  const [objectWidth, setObjectWidth] = useState<string>('');
  const [objectLength, setObjectLength] = useState<string>('');
  const [objectHeight, setObjectHeight] = useState<string>('');
  const [objectType, setObjectType] = useState<'flat' | 'cylindrical'>('flat');

  // Models state
  const [compatibleModels, setCompatibleModels] = useState<PrinterModel[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  // Accessories state
  const [selectedAccessories, setSelectedAccessories] = useState<{ modelId: string; accessoryId: string; name: string; price?: string }[]>([]);

  // Customer data state
  const [customerName, setCustomerName] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Notes
  const [notes, setNotes] = useState('');

  // Saved quotes
  const [savedQuotes, setSavedQuotes] = useState<QuoteItem[]>([]);
  const [showSavedQuotes, setShowSavedQuotes] = useState(false);

  // Load saved quotes on mount
  useEffect(() => {
    setSavedQuotes(getStoredQuotes());
  }, []);

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      if (initialModelId) {
        setSelectedModels([initialModelId]);
        setCurrentStep('accessories');
      } else {
        setCurrentStep('measures');
      }
    }
  }, [open, initialModelId]);

  const handleFindModels = () => {
    const width = parseFloat(objectWidth) || 0;
    const length = parseFloat(objectLength) || 0;
    const height = parseFloat(objectHeight) || 0;

    if (width > 0 && length > 0 && height > 0) {
      const models = getCompatibleModels(width, length, height, objectType);
      setCompatibleModels(models);
      setCurrentStep('models');
    }
  };

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleAccessoryToggle = (modelId: string, accessory: Accessory) => {
    setSelectedAccessories(prev => {
      const exists = prev.find(a => a.modelId === modelId && a.accessoryId === accessory.id);
      if (exists) {
        return prev.filter(a => !(a.modelId === modelId && a.accessoryId === accessory.id));
      }
      return [...prev, { modelId, accessoryId: accessory.id, name: accessory.name, price: accessory.price }];
    });
  };

  const getSelectedModelsData = (): PrinterModel[] => {
    return compatibleModels.filter(m => selectedModels.includes(m.id));
  };

  const calculateTotal = (): number => {
    let total = 0;

    getSelectedModelsData().forEach(model => {
      const price = parsePrice(model.price);
      if (price) total += price;
    });

    selectedAccessories.forEach(acc => {
      const price = parsePrice(acc.price);
      if (price) total += price;
    });

    return total;
  };

  const getCustomerData = (): CustomerData => ({
    name: customerName,
    company: customerCompany,
    email: customerEmail,
    phone: customerPhone,
  });

  const handleSaveQuote = () => {
    const quote: QuoteItem = {
      id: generateQuoteId(),
      createdAt: new Date().toISOString(),
      customer: getCustomerData(),
      objectMeasures: {
        width: parseFloat(objectWidth) || 0,
        length: parseFloat(objectLength) || 0,
        height: parseFloat(objectHeight) || 0,
        type: objectType,
      },
      selectedModels,
      selectedAccessories,
      notes,
    };

    saveQuote(quote);
    setSavedQuotes(getStoredQuotes());
    alert(t('quoteSaved'));
  };

  const handleDeleteQuote = (id: string) => {
    deleteQuote(id);
    setSavedQuotes(getStoredQuotes());
  };

  const handleLoadQuote = (quote: QuoteItem) => {
    setObjectWidth(quote.objectMeasures.width.toString());
    setObjectLength(quote.objectMeasures.length.toString());
    setObjectHeight(quote.objectMeasures.height.toString());
    setObjectType(quote.objectMeasures.type);
    setSelectedModels(quote.selectedModels);
    setSelectedAccessories(quote.selectedAccessories);
    setNotes(quote.notes || '');

    if (quote.customer) {
      setCustomerName(quote.customer.name || '');
      setCustomerCompany(quote.customer.company || '');
      setCustomerEmail(quote.customer.email || '');
      setCustomerPhone(quote.customer.phone || '');
    }

    const models = getCompatibleModels(
      quote.objectMeasures.width,
      quote.objectMeasures.length,
      quote.objectMeasures.height,
      quote.objectMeasures.type
    );
    setCompatibleModels(models);
    setShowSavedQuotes(false);
    setCurrentStep('summary');
  };

  const handleExportPDF = () => {
    const content = generateQuoteHTML();
    // Use a hidden iframe to avoid popup blockers
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
      // Wait for content to render before printing
      iframe.onload = () => {
        iframe.contentWindow?.print();
        // Clean up after print dialog closes
        setTimeout(() => document.body.removeChild(iframe), 1000);
      };
      // Fallback: if onload doesn't fire (content already loaded via write)
      setTimeout(() => {
        try { iframe.contentWindow?.print(); } catch { /* already printing */ }
        setTimeout(() => {
          if (iframe.parentNode) document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  };

  const generateQuoteHTML = (): string => {
    const models = getSelectedModelsData();
    const total = calculateTotal();
    const locale = language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-US';
    const date = new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    const quoteNum = `BM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    // Inline SVG logo as data URI for reliable rendering in print
    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="200" height="50"><rect width="320" height="80" rx="6" fill="#1a1a1a"/><text x="20" y="52" font-family="Segoe UI,Arial,Helvetica,sans-serif" font-size="38" font-weight="700" letter-spacing="6" fill="#fff">BOMEDIA</text><text x="248" y="36" font-family="Segoe UI,Arial,Helvetica,sans-serif" font-size="10" font-weight="400" letter-spacing="1.5" fill="#9ca3af">UV LED</text><text x="240" y="52" font-family="Segoe UI,Arial,Helvetica,sans-serif" font-size="10" font-weight="400" letter-spacing="1.5" fill="#9ca3af">PRINTERS</text></svg>`;
    const logoDataUri = `data:image/svg+xml;base64,${btoa(logoSvg)}`;

    const modelsRows = models.map((m, i) => `
      <tr style="background: ${i % 2 === 0 ? '#ffffff' : '#fafafa'};">
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb;">
          <strong style="font-size: 14px;">${m.fullName}</strong><br>
          <span style="color: #6b7280; font-size: 11px;">${t('printArea')}: ${m.specs.printArea} &middot; ${t('maxHeight')}: ${m.specs.maxHeight} &middot; ${m.specs.resolution} &middot; ${m.specs.headType}</span>
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 14px;">1</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; white-space: nowrap; font-weight: 600; font-size: 14px;">${m.price || '-'}</td>
      </tr>
    `).join('');

    const accessoriesRows = selectedAccessories.map((acc, i) => {
      const model = models.find(m => m.id === acc.modelId);
      return `
        <tr style="background: ${(models.length + i) % 2 === 0 ? '#ffffff' : '#fafafa'};">
          <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb;">
            ${acc.name}<br>
            <span style="color: #6b7280; font-size: 11px;">${t('forModel')}: ${model?.name || acc.modelId}</span>
          </td>
          <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 14px;">1</td>
          <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; white-space: nowrap; font-weight: 600; font-size: 14px;">${acc.price || '-'}</td>
        </tr>
      `;
    }).join('');

    const hasCustomer = customerName || customerCompany || customerEmail || customerPhone;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${t('quote')} ${quoteNum} - BOMEDIA</title>
  <style>
    @media print {
      body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none; }
      @page { margin: 15mm 10mm; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
      color: #1a1a1a;
      line-height: 1.5;
      background: #fff;
      font-size: 13px;
    }
    .page {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .accent-bar { height: 4px; background: linear-gradient(90deg, #1a1a1a 0%, #4b5563 50%, #9ca3af 100%); border-radius: 2px; }
  </style>
</head>
<body>
  <div class="page">
    <!-- Accent bar top -->
    <div class="accent-bar" style="margin-bottom: 32px;"></div>

    <!-- Header with SVG logo -->
    <table style="width: 100%; margin-bottom: 32px;">
      <tr>
        <td style="vertical-align: middle;">
          <img src="${logoDataUri}" alt="BOMEDIA" style="height: 50px; display: block;" />
        </td>
        <td style="text-align: right; vertical-align: top; color: #6b7280; font-size: 12px; line-height: 1.9;">
          <strong style="color: #374151; font-size: 13px;">www.boprint.net</strong><br>
          manel@bomedia.net<br>
          +34 682 62 70 56 / +34 93 201 07 93
        </td>
      </tr>
    </table>

    <!-- Quote title bar -->
    <table style="width: 100%; background: #1a1a1a; color: #fff; border-radius: 6px; margin-bottom: 28px;">
      <tr>
        <td style="padding: 18px 24px;">
          <span style="font-size: 22px; font-weight: 700; letter-spacing: 2px;">${t('quote').toUpperCase()}</span>
        </td>
        <td style="padding: 18px 24px; text-align: right;">
          <span style="font-size: 12px; opacity: 0.7;">${t('quoteNumber')}</span>
          <span style="font-size: 15px; font-weight: 600; margin-left: 6px;">${quoteNum}</span>
          <span style="margin: 0 14px; opacity: 0.3;">|</span>
          <span style="font-size: 12px; opacity: 0.7;">${t('quoteDate')}</span>
          <span style="font-size: 15px; font-weight: 600; margin-left: 6px;">${date}</span>
        </td>
      </tr>
    </table>

    <!-- Customer info + Object measures -->
    <table style="width: 100%; margin-bottom: 28px; border-spacing: 0;">
      <tr>
        ${hasCustomer ? `
        <td style="width: 50%; vertical-align: top; padding-right: 14px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 2.5px; color: #9ca3af; margin-bottom: 10px; font-weight: 700;">${t('billTo')}</div>
          <div style="background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px;">
            ${customerName ? `<div style="font-size: 16px; font-weight: 700; margin-bottom: 2px; color: #111827;">${customerName}</div>` : ''}
            ${customerCompany ? `<div style="font-size: 13px; color: #374151; margin-bottom: 10px;">${customerCompany}</div>` : ''}
            ${customerEmail ? `<div style="font-size: 12px; color: #6b7280; margin-bottom: 3px;">&#9993; ${customerEmail}</div>` : ''}
            ${customerPhone ? `<div style="font-size: 12px; color: #6b7280;">&#9742; ${customerPhone}</div>` : ''}
          </div>
        </td>
        ` : ''}
        <td style="${hasCustomer ? 'width: 50%; padding-left: 14px;' : 'width: 100%;'} vertical-align: top;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 2.5px; color: #9ca3af; margin-bottom: 10px; font-weight: 700;">${t('objectMeasures')}</div>
          <div style="background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px;">
            <table style="width: 100%; font-size: 13px;">
              <tr><td style="color: #6b7280; padding: 3px 0;">${t('width')}</td><td style="text-align: right; font-weight: 600; color: #111827;">${objectWidth} cm</td></tr>
              <tr><td style="color: #6b7280; padding: 3px 0;">${t('length')}</td><td style="text-align: right; font-weight: 600; color: #111827;">${objectLength} cm</td></tr>
              <tr><td style="color: #6b7280; padding: 3px 0;">${t('height')}</td><td style="text-align: right; font-weight: 600; color: #111827;">${objectHeight} cm</td></tr>
              <tr><td style="color: #6b7280; padding: 3px 0;">${t('objectType')}</td><td style="text-align: right; font-weight: 600; color: #111827;">${objectType === 'flat' ? t('flat') : t('cylindrical')}</td></tr>
            </table>
          </div>
        </td>
      </tr>
    </table>

    <!-- Items table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <thead>
        <tr style="background: #1a1a1a;">
          <th style="padding: 13px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #fff; font-weight: 600; border-radius: 8px 0 0 0;">${t('description')}</th>
          <th style="padding: 13px 16px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #fff; font-weight: 600; width: 80px;">${t('quantity')}</th>
          <th style="padding: 13px 16px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #fff; font-weight: 600; width: 140px; border-radius: 0 8px 0 0;">${t('unitPrice')}</th>
        </tr>
      </thead>
      <tbody>
        ${modelsRows}
        ${accessoriesRows}
      </tbody>
    </table>

    <!-- Subtotal / Total -->
    <table style="width: 100%; margin-bottom: 28px;">
      <tr>
        <td style="width: 55%;"></td>
        <td style="width: 45%;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-top: 2px solid #1a1a1a;">
              <td style="padding: 16px 16px; font-weight: 700; font-size: 18px; letter-spacing: 0.5px;">${t('total')} ${getTaxLabel()}</td>
              <td style="padding: 16px 16px; font-weight: 800; font-size: 22px; text-align: right; color: #111827;">${formatPrice(total)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${notes ? `
    <!-- Notes -->
    <div style="background: #fefce8; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 28px;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #92400e; font-weight: 700; margin-bottom: 6px;">${t('notes')}</div>
      <div style="font-size: 13px; color: #78350f; line-height: 1.6;">${notes}</div>
    </div>
    ` : ''}

    <!-- Terms & Footer -->
    <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 16px;">
      <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af; font-weight: 700; margin-bottom: 8px;">${t('quoteTerms')}</div>
      <p style="font-size: 11px; color: #9ca3af; line-height: 1.8;">
        ${t('quoteValidDays')}<br>
        ${t('quoteDisclaimer')}
      </p>
    </div>

    <!-- Bottom accent bar + company info -->
    <div class="accent-bar" style="margin-top: 28px; margin-bottom: 16px;"></div>
    <table style="width: 100%;">
      <tr>
        <td style="text-align: center; color: #9ca3af; font-size: 10px; letter-spacing: 1.5px; line-height: 1.8;">
          <strong style="color: #6b7280; font-size: 11px; letter-spacing: 3px;">BOMEDIA</strong><br>
          www.boprint.net &nbsp;&middot;&nbsp; manel@bomedia.net &nbsp;&middot;&nbsp; +34 682 62 70 56
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
  };

  const handleSendEmail = () => {
    const models = getSelectedModelsData();
    const total = calculateTotal();

    const subject = encodeURIComponent(`${t('quote')} BOMEDIA - UV LED`);
    const body = encodeURIComponent(`
${t('quote')} BOMEDIA

${t('customerData')}:
- ${t('customerName')}: ${customerName}
- ${t('customerCompany')}: ${customerCompany}
- ${t('customerEmail')}: ${customerEmail}
- ${t('customerPhone')}: ${customerPhone}

${t('objectMeasures')}:
- ${t('width')}: ${objectWidth} cm
- ${t('length')}: ${objectLength} cm
- ${t('height')}: ${objectHeight} cm
- ${t('objectType')}: ${objectType === 'flat' ? t('flat') : t('cylindrical')}

${t('selectedModels')}:
${models.map(m => `- ${m.fullName}: ${m.price || '-'}`).join('\n')}

${selectedAccessories.length > 0 ? `
${t('accessories')}:
${selectedAccessories.map(acc => `- ${acc.name}: ${acc.price || '-'}`).join('\n')}
` : ''}

${t('total')}: ${formatPrice(total)} ${getTaxLabel()}

${notes ? `${t('notes')}: ${notes}` : ''}
    `);

    window.location.href = `mailto:manel@bomedia.net?subject=${subject}&body=${body}`;
  };

  const getTaxLabel = () => {
    switch (language) {
      case 'fr': return 'HT';
      case 'de': return 'zzgl. MwSt.';
      case 'nl': return 'excl. BTW';
      default: return '+ IVA';
    }
  };

  const isCustomerValid = () => {
    return customerName.trim().length > 0 && customerEmail.trim().length > 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slim">{t('quote')}</DialogTitle>
        </DialogHeader>

        <Tabs value={showSavedQuotes ? 'saved' : currentStep} className="mt-4">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="measures" onClick={() => { setShowSavedQuotes(false); setCurrentStep('measures'); }}>
              1. {t('measures')}
            </TabsTrigger>
            <TabsTrigger value="models" onClick={() => setShowSavedQuotes(false)} disabled={compatibleModels.length === 0}>
              2. {t('models')}
            </TabsTrigger>
            <TabsTrigger value="accessories" onClick={() => setShowSavedQuotes(false)} disabled={selectedModels.length === 0}>
              3. {t('accessories')}
            </TabsTrigger>
            <TabsTrigger value="customer" onClick={() => setShowSavedQuotes(false)} disabled={selectedModels.length === 0}>
              4. {t('customerData')}
            </TabsTrigger>
            <TabsTrigger value="summary" onClick={() => setShowSavedQuotes(false)} disabled={selectedModels.length === 0}>
              5. {t('summary')}
            </TabsTrigger>
            <TabsTrigger value="saved" onClick={() => setShowSavedQuotes(true)}>
              {t('savedQuotes')}
            </TabsTrigger>
          </TabsList>

          {/* Step 1: Measures */}
          <TabsContent value="measures" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('objectMeasures')}</h3>

                <div className="space-y-2">
                  <Label htmlFor="width">{t('width')} (cm)</Label>
                  <Input
                    id="width"
                    type="number"
                    min="0"
                    step="0.1"
                    value={objectWidth}
                    onChange={(e) => setObjectWidth(e.target.value)}
                    placeholder="30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">{t('length')} (cm)</Label>
                  <Input
                    id="length"
                    type="number"
                    min="0"
                    step="0.1"
                    value={objectLength}
                    onChange={(e) => setObjectLength(e.target.value)}
                    placeholder="50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">{t('height')} (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    min="0"
                    step="0.1"
                    value={objectHeight}
                    onChange={(e) => setObjectHeight(e.target.value)}
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('objectType')}</h3>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setObjectType('flat')}
                    className={`p-6 border rounded-lg flex flex-col items-center gap-3 transition-all ${
                      objectType === 'flat'
                        ? 'border-foreground bg-muted'
                        : 'border-border-subtle hover:border-foreground/50'
                    }`}
                  >
                    <Square className="h-12 w-12" />
                    <span className="font-medium">{t('flat')}</span>
                    <span className="text-xs text-muted-foreground text-center">{t('flatDesc')}</span>
                  </button>

                  <button
                    onClick={() => setObjectType('cylindrical')}
                    className={`p-6 border rounded-lg flex flex-col items-center gap-3 transition-all ${
                      objectType === 'cylindrical'
                        ? 'border-foreground bg-muted'
                        : 'border-border-subtle hover:border-foreground/50'
                    }`}
                  >
                    <Circle className="h-12 w-12" />
                    <span className="font-medium">{t('cylindrical')}</span>
                    <span className="text-xs text-muted-foreground text-center">{t('cylindricalDesc')}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleFindModels}
                disabled={!objectWidth || !objectLength || !objectHeight}
                className="gap-2"
              >
                {t('findCompatibleModels')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Step 2: Compatible Models */}
          <TabsContent value="models" className="space-y-6 mt-6">
            {compatibleModels.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t('noCompatibleModels')}</p>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground">
                  {t('compatibleModelsFound').replace('{count}', compatibleModels.length.toString())}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {compatibleModels.map(model => (
                    <button
                      key={model.id}
                      onClick={() => handleModelToggle(model.id)}
                      className={`p-4 border rounded-lg text-left transition-all flex gap-4 ${
                        selectedModels.includes(model.id)
                          ? 'border-foreground bg-muted'
                          : 'border-border-subtle hover:border-foreground/50'
                      }`}
                    >
                      {model.image && (
                        <img src={model.image} alt={model.name} className="w-20 h-20 object-contain" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{model.name}</h4>
                            <p className="text-sm text-muted-foreground">{model.brand}</p>
                          </div>
                          {selectedModels.includes(model.id) && (
                            <Check className="h-5 w-5 text-foreground" />
                          )}
                        </div>
                        <div className="mt-2 text-sm">
                          <p>{t('printArea')}: {model.specs.printArea}</p>
                          <p>{t('maxHeight')}: {model.specs.maxHeight}</p>
                          {model.price && <p className="font-medium mt-1">{model.price} {getTaxLabel()}</p>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('measures')}>
                    {t('back')}
                  </Button>
                  <Button
                    onClick={() => setCurrentStep('accessories')}
                    disabled={selectedModels.length === 0}
                    className="gap-2"
                  >
                    {t('continue')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          {/* Step 3: Accessories */}
          <TabsContent value="accessories" className="space-y-6 mt-6">
            {getSelectedModelsData().map(model => (
              <div key={model.id} className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">{model.name}</h3>

                {model.accessories.length === 0 ? (
                  <p className="text-muted-foreground text-sm">{t('noAccessoriesAvailable')}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {model.accessories.map(accessory => {
                      const isSelected = selectedAccessories.some(
                        a => a.modelId === model.id && a.accessoryId === accessory.id
                      );
                      return (
                        <label
                          key={accessory.id}
                          className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                            isSelected ? 'border-foreground bg-muted' : 'border-border-subtle hover:border-foreground/50'
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleAccessoryToggle(model.id, accessory)}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{accessory.name}</p>
                            <p className="text-xs text-muted-foreground">{accessory.description}</p>
                            {accessory.price && (
                              <p className="text-sm font-medium mt-1">{accessory.price}</p>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('models')}>
                {t('back')}
              </Button>
              <Button onClick={() => setCurrentStep('customer')} className="gap-2">
                {t('continue')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Step 4: Customer Data */}
          <TabsContent value="customer" className="space-y-6 mt-6">
            <div className="max-w-lg mx-auto space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium">{t('customerData')}</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">{t('customerName')} *</Label>
                  <Input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t('customerNamePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerCompany">{t('customerCompany')}</Label>
                  <Input
                    id="customerCompany"
                    type="text"
                    value={customerCompany}
                    onChange={(e) => setCustomerCompany(e.target.value)}
                    placeholder={t('customerCompanyPlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">{t('customerEmail')} *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder={t('customerEmailPlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">{t('customerPhone')}</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={t('customerPhonePlaceholder')}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('accessories')}>
                {t('back')}
              </Button>
              <Button
                onClick={() => setCurrentStep('summary')}
                disabled={!isCustomerValid()}
                className="gap-2"
              >
                {t('continue')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Step 5: Summary */}
          <TabsContent value="summary" className="space-y-6 mt-6">
            {/* Customer info summary */}
            {customerName && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">{t('customerData')}</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>{customerName}</strong>{customerCompany ? ` - ${customerCompany}` : ''}</p>
                  {customerEmail && <p>{customerEmail}</p>}
                  {customerPhone && <p>{customerPhone}</p>}
                </div>
              </div>
            )}

            {/* Object measures summary */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">{t('objectMeasures')}</h3>
              <p className="text-sm text-muted-foreground">
                {objectWidth} x {objectLength} x {objectHeight} cm ({objectType === 'flat' ? t('flat') : t('cylindrical')})
              </p>
            </div>

            {/* Selected models comparison */}
            <div>
              <h3 className="font-medium mb-4">{t('modelComparison')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">{t('model')}</th>
                      <th className="text-left py-2 px-3">{t('printArea')}</th>
                      <th className="text-left py-2 px-3">{t('maxHeight')}</th>
                      <th className="text-left py-2 px-3">{t('resolution')}</th>
                      <th className="text-right py-2 px-3">{t('price')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSelectedModelsData().map(model => (
                      <tr key={model.id} className="border-b">
                        <td className="py-2 px-3 font-medium">{model.name}</td>
                        <td className="py-2 px-3">{model.specs.printArea}</td>
                        <td className="py-2 px-3">{model.specs.maxHeight}</td>
                        <td className="py-2 px-3">{model.specs.resolution}</td>
                        <td className="py-2 px-3 text-right">{model.price || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Accessories */}
            {selectedAccessories.length > 0 && (
              <div>
                <h3 className="font-medium mb-4">{t('selectedAccessories')}</h3>
                <ul className="space-y-2">
                  {selectedAccessories.map(acc => {
                    const model = getSelectedModelsData().find(m => m.id === acc.modelId);
                    return (
                      <li key={`${acc.modelId}-${acc.accessoryId}`} className="flex justify-between text-sm">
                        <span>{acc.name} <span className="text-muted-foreground">({model?.name})</span></span>
                        <span>{acc.price || '-'}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t('notes')}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('notesPlaceholder')}
                rows={3}
              />
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-medium">
                <span>{t('total')}</span>
                <span>{formatPrice(calculateTotal())} {getTaxLabel()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('customer')}>
                {t('back')}
              </Button>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handleSaveQuote} className="gap-2">
                  <Save className="h-4 w-4" />
                  {t('saveQuote')}
                </Button>
                <Button variant="outline" onClick={handleExportPDF} className="gap-2">
                  <Download className="h-4 w-4" />
                  {t('exportPDF')}
                </Button>
                <Button onClick={handleSendEmail} className="gap-2">
                  <Mail className="h-4 w-4" />
                  {t('sendEmail')}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Saved Quotes */}
          <TabsContent value="saved" className="space-y-6 mt-6">
            {savedQuotes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t('noSavedQuotes')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedQuotes.map(quote => (
                  <div key={quote.id} className="border rounded-lg p-4 flex justify-between items-start">
                    <div>
                      {quote.customer?.name && (
                        <p className="font-medium">{quote.customer.name}{quote.customer.company ? ` - ${quote.customer.company}` : ''}</p>
                      )}
                      <p className={`${quote.customer?.name ? 'text-sm text-muted-foreground' : 'font-medium'}`}>
                        {quote.objectMeasures.width} x {quote.objectMeasures.length} x {quote.objectMeasures.height} cm
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {quote.objectMeasures.type === 'flat' ? t('flat') : t('cylindrical')} • {quote.selectedModels.length} {t('models')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleLoadQuote(quote)}>
                        {t('load')}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteQuote(quote.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
