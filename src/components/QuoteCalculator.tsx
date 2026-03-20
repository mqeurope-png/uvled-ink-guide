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
import { ArrowRight, Download, Mail, Save, Trash2, Circle, Square, Check } from 'lucide-react';
import { PrinterModel, Accessory } from '@/lib/printerData';
import { getCompatibleModels, parsePrice, formatPrice } from '@/lib/quoteUtils';
import { QuoteItem, saveQuote, generateQuoteId, getStoredQuotes, deleteQuote } from '@/lib/quoteStorage';

interface QuoteCalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialModelId?: string;
}

export function QuoteCalculator({ open, onOpenChange, initialModelId }: QuoteCalculatorProps) {
  const { t, language } = useLanguage();
  
  // Step state
  const [currentStep, setCurrentStep] = useState<'measures' | 'models' | 'accessories' | 'summary'>('measures');
  
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
    const key = `${modelId}-${accessory.id}`;
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
    
    // Add model prices
    getSelectedModelsData().forEach(model => {
      const price = parsePrice(model.price);
      if (price) total += price;
    });
    
    // Add accessory prices
    selectedAccessories.forEach(acc => {
      const price = parsePrice(acc.price);
      if (price) total += price;
    });
    
    return total;
  };

  const handleSaveQuote = () => {
    const quote: QuoteItem = {
      id: generateQuoteId(),
      createdAt: new Date().toISOString(),
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
    
    // Recalculate compatible models
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
    // Create printable content
    const content = generateQuoteHTML();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generateQuoteHTML = (): string => {
    const models = getSelectedModelsData();
    const total = calculateTotal();
    const date = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US');
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${t('quote')} - BOMEDIA</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px; }
          h2 { color: #333; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f5f5f5; }
          .total { font-size: 1.5em; font-weight: bold; text-align: right; margin-top: 20px; }
          .header { display: flex; justify-content: space-between; align-items: center; }
          .date { color: #666; }
          .measures { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .notes { margin-top: 30px; padding: 15px; background: #fffef0; border-left: 4px solid #ffc107; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BOMEDIA - ${t('quote')}</h1>
          <span class="date">${date}</span>
        </div>
        
        <div class="measures">
          <h3>${t('objectMeasures')}</h3>
          <p><strong>${t('width')}:</strong> ${objectWidth} cm</p>
          <p><strong>${t('length')}:</strong> ${objectLength} cm</p>
          <p><strong>${t('height')}:</strong> ${objectHeight} cm</p>
          <p><strong>${t('objectType')}:</strong> ${objectType === 'flat' ? t('flat') : t('cylindrical')}</p>
        </div>
        
        <h2>${t('selectedModels')}</h2>
        <table>
          <thead>
            <tr>
              <th>${t('model')}</th>
              <th>${t('printArea')}</th>
              <th>${t('price')}</th>
            </tr>
          </thead>
          <tbody>
            ${models.map(m => `
              <tr>
                <td>${m.fullName}</td>
                <td>${m.specs.printArea}</td>
                <td>${m.price || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        ${selectedAccessories.length > 0 ? `
          <h2>${t('accessories')}</h2>
          <table>
            <thead>
              <tr>
                <th>${t('accessory')}</th>
                <th>${t('forModel')}</th>
                <th>${t('price')}</th>
              </tr>
            </thead>
            <tbody>
              ${selectedAccessories.map(acc => {
                const model = models.find(m => m.id === acc.modelId);
                return `
                  <tr>
                    <td>${acc.name}</td>
                    <td>${model?.name || acc.modelId}</td>
                    <td>${acc.price || '-'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        ` : ''}
        
        ${notes ? `
          <div class="notes">
            <h3>${t('notes')}</h3>
            <p>${notes}</p>
          </div>
        ` : ''}
        
        <div class="total">
          ${t('total')}: ${formatPrice(total)} ${t('plusTax')}
        </div>
        
        <p style="margin-top: 40px; color: #666; font-size: 0.9em;">
          BOMEDIA - www.boprint.net<br>
          ${t('quoteDisclaimer')}
        </p>
      </body>
      </html>
    `;
  };

  const handleSendEmail = () => {
    const models = getSelectedModelsData();
    const total = calculateTotal();
    
    const subject = encodeURIComponent(`${t('quote')} BOMEDIA - UV LED`);
    const body = encodeURIComponent(`
${t('quote')} BOMEDIA

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

${t('total')}: ${formatPrice(total)} ${t('plusTax')}

${notes ? `${t('notes')}: ${notes}` : ''}
    `);
    
    window.open(`mailto:manel@bomedia.net?subject=${subject}&body=${body}`);
  };

  const getTaxLabel = () => {
    switch (language) {
      case 'fr': return 'HT';
      case 'de': return 'zzgl. MwSt.';
      case 'nl': return 'excl. BTW';
      default: return '+ IVA';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slim">{t('quote')}</DialogTitle>
        </DialogHeader>

        <Tabs value={showSavedQuotes ? 'saved' : currentStep} className="mt-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="measures" onClick={() => { setShowSavedQuotes(false); setCurrentStep('measures'); }}>
              1. {t('measures')}
            </TabsTrigger>
            <TabsTrigger value="models" onClick={() => setShowSavedQuotes(false)} disabled={compatibleModels.length === 0}>
              2. {t('models')}
            </TabsTrigger>
            <TabsTrigger value="accessories" onClick={() => setShowSavedQuotes(false)} disabled={selectedModels.length === 0}>
              3. {t('accessories')}
            </TabsTrigger>
            <TabsTrigger value="summary" onClick={() => setShowSavedQuotes(false)} disabled={selectedModels.length === 0}>
              4. {t('summary')}
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
              <Button onClick={() => setCurrentStep('summary')} className="gap-2">
                {t('continue')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Step 4: Summary */}
          <TabsContent value="summary" className="space-y-6 mt-6">
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
              <Button variant="outline" onClick={() => setCurrentStep('accessories')}>
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
                      <p className="font-medium">
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
