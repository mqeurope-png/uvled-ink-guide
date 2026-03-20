import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Check, GitCompareArrows, X, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { WizardState } from '@/lib/wizardTypes';
import { printerModels } from '@/lib/printerData';
import { parsePrice, formatPrice } from '@/lib/quoteUtils';
import { useCountUp } from '@/hooks/useCountUp';
import { Button } from '@/components/ui/button';

interface StepProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  t: (key: string) => string;
}

// Price display component with count-up animation
function AnimatedPrice({ price, delay }: { price: string | undefined; delay: number }) {
  const numericPrice = parsePrice(price) || 0;
  const animatedValue = useCountUp(numericPrice, 800, 0, true);
  return <span className="text-price text-lg">{formatPrice(animatedValue)}</span>;
}

// ROI Chart component
function ROIChart({ investment, revenuePerUnit, costPerUnit, unitsPerDay, t }: {
  investment: number;
  revenuePerUnit: number;
  costPerUnit: number;
  unitsPerDay: number;
  t: (key: string) => string;
}) {
  const monthlyRevenue = unitsPerDay * 22 * revenuePerUnit; // 22 working days
  const monthlyCost = unitsPerDay * 22 * costPerUnit;
  const monthlyProfit = monthlyRevenue - monthlyCost;
  const breakEvenMonth = monthlyProfit > 0 ? Math.ceil(investment / monthlyProfit) : 99;

  const data = Array.from({ length: 24 }, (_, i) => {
    const month = i + 1;
    return {
      month,
      revenue: Math.round(month * monthlyRevenue),
      cost: Math.round(investment + month * monthlyCost),
    };
  });

  return (
    <div className="mt-6 p-4 bg-card rounded-lg" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h4 className="font-medium">{t('roi_title') || 'ROI Estimado'}</h4>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}m`} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
          <Tooltip formatter={(value: number) => formatPrice(value)} labelFormatter={(l) => `Mes ${l}`} />
          <Line type="monotone" dataKey="revenue" stroke="#e8522a" strokeWidth={2} dot={false} name="Ingresos acumulados" />
          <Line type="monotone" dataKey="cost" stroke="#1a3a5c" strokeWidth={2} dot={false} name="Inversión total" />
          {breakEvenMonth <= 24 && (
            <ReferenceLine x={breakEvenMonth} stroke="#e8522a" strokeDasharray="5 5" label={{ value: `Mes ${breakEvenMonth}`, position: 'top', fill: '#e8522a', fontSize: 11 }} />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="text-center p-3 bg-[#f9f7f4] rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">{t('roi_investment') || 'Inversión inicial'}</p>
          <p className="text-price font-semibold">{formatPrice(investment)}</p>
        </div>
        <div className="text-center p-3 bg-[#f9f7f4] rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">{t('roi_monthlyRevenue') || 'Ingreso mensual'}</p>
          <p className="text-price font-semibold">{formatPrice(monthlyRevenue)}</p>
        </div>
        <div className="text-center p-3 bg-[#fdf0eb] rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">{t('roi_breakeven') || 'Retorno en'}</p>
          <p className="text-price font-semibold">{breakEvenMonth <= 24 ? `${breakEvenMonth} meses` : '+24 meses'}</p>
        </div>
      </div>
    </div>
  );
}

// Comparison Modal
function ComparisonModal({ modelIds, onClose, onAdd, selectedProducts, t }: {
  modelIds: string[];
  onClose: () => void;
  onAdd: (id: string) => void;
  selectedProducts: string[];
  t: (key: string) => string;
}) {
  const models = modelIds.map(id => printerModels.find(m => m.id === id)).filter(Boolean) as typeof printerModels;
  const specKeys = ['printArea', 'maxHeight', 'resolution', 'inkType', 'heads', 'headType'] as const;
  const specLabels: Record<string, string> = {
    printArea: 'Área de impresión',
    maxHeight: 'Altura máxima',
    resolution: 'Resolución',
    inkType: 'Tipo de tinta',
    heads: 'Cabezales',
    headType: 'Tipo cabezal',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card rounded-xl max-w-4xl w-full max-h-[80vh] overflow-auto p-6"
        style={{ border: '1px solid rgba(0,0,0,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-display text-2xl">{t('compare_title') || 'Comparativa'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Spec</th>
                {models.map(m => (
                  <th key={m.id} className="text-center p-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', minWidth: 180 }}>
                    {m.image && <img src={m.image} alt={m.name} className="w-20 h-20 object-contain mx-auto mb-2 rounded" />}
                    <p className="font-semibold text-sm">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.brand}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <td className="p-3 text-sm font-medium">Precio</td>
                {models.map(m => (
                  <td key={m.id} className="p-3 text-center text-price font-semibold">{m.price || '-'}</td>
                ))}
              </tr>
              {specKeys.map(key => (
                <tr key={key} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <td className="p-3 text-sm font-medium">{specLabels[key] || key}</td>
                  {models.map(m => (
                    <td key={m.id} className="p-3 text-center text-sm">{m.specs[key] || '-'}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-3"></td>
                {models.map(m => (
                  <td key={m.id} className="p-3 text-center">
                    <Button
                      size="sm"
                      onClick={() => { onAdd(m.id); onClose(); }}
                      disabled={selectedProducts.includes(m.id)}
                      className={selectedProducts.includes(m.id)
                        ? 'bg-muted text-muted-foreground'
                        : 'btn-primary-3d bg-primary text-white hover:brightness-[0.92]'
                      }
                    >
                      {selectedProducts.includes(m.id) ? 'Añadido' : 'Añadir al presupuesto'}
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function StepRecommendations({ state, updateState, t }: StepProps) {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Filter and rank recommendations based on multi-selection state
  const recommendations = useMemo(() => {
    let models = printerModels.filter(m => m.category !== 'discontinued');

    // Filter by production type
    if (state.productionType.includes('uvPrinting')) {
      // Keep UV printers
    }
    if (state.productionType.includes('pvcCards')) {
      // Include card printers like artisjet-proud
    }

    // Score models by how many wizard selections they match
    const scored = models.map(model => {
      let score = 0;
      const price = parsePrice(model.price);

      // Match by size
      if (state.uvMaxSize.length > 0) {
        const area = model.specs.printArea;
        if (state.uvMaxSize.includes('a4') && area.includes('20')) score += 2;
        if (state.uvMaxSize.includes('a3') && (area.includes('30') || area.includes('35') || area.includes('36'))) score += 2;
        if (state.uvMaxSize.includes('60x90') && (area.includes('60') || area.includes('51'))) score += 2;
        if (state.uvMaxSize.includes('100x160') && (area.includes('100') || area.includes('160') || area.includes('180') || area.includes('250'))) score += 2;
      }

      // Match by investment range
      if (state.investmentRange === 'under5k' && price && price < 5000) score += 3;
      if (state.investmentRange === '5to15k' && price && price >= 5000 && price <= 15000) score += 3;
      if (state.investmentRange === '15to40k' && price && price > 15000 && price <= 40000) score += 3;
      if (state.investmentRange === 'over40k' && price && price > 40000) score += 3;

      // Card specialist
      if (state.productionType.includes('pvcCards') && model.id === 'artisjet-proud') score += 5;

      // Vending for retail
      if (state.businessProfile.includes('personalization') && model.category === 'pimpam') score += 3;
      if (state.businessProfile.includes('ecommerce') && model.category === 'pimpam') score += 3;

      return { model, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(s => s.model);
  }, [state]);

  const displayModels = recommendations.length > 0 ? recommendations : printerModels.filter(m => m.category !== 'discontinued');

  const toggleProduct = (modelId: string) => {
    if (state.selectedProducts.includes(modelId)) {
      updateState({
        selectedProducts: state.selectedProducts.filter(id => id !== modelId),
        selectedAccessories: state.selectedAccessories.filter(a => a.modelId !== modelId),
      });
    } else {
      updateState({ selectedProducts: [...state.selectedProducts, modelId] });
    }
  };

  const toggleCompare = (modelId: string) => {
    setCompareIds(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : prev.length < 3 ? [...prev, modelId] : prev
    );
  };

  // ROI data from first selected model
  const firstSelected = state.selectedProducts.length > 0
    ? printerModels.find(m => m.id === state.selectedProducts[0])
    : null;
  const roiInvestment = firstSelected ? (parsePrice(firstSelected.price) || 0) : 0;

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">PASO 05</p>
        <h3 className="text-display text-[32px] leading-tight mb-2">{t('rec_title') || 'Recomendaciones'}</h3>
        <p className="text-base text-muted-foreground max-w-[520px]">{t('rec_subtitle') || 'Basándonos en tus necesidades, te recomendamos estos modelos.'}</p>
      </div>

      {recommendations.length > 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          {recommendations.length} {t('models') || 'modelos'} {t('rec_matched') || 'compatibles con tu selección'}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayModels.map((model, index) => {
          const isSelected = state.selectedProducts.includes(model.id);
          const isComparing = compareIds.includes(model.id);

          return (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className={`
                relative rounded-lg p-4 transition-all duration-200
                ${isSelected
                  ? 'bg-[#fdf0eb] border-2 border-primary shadow-[0_8px_20px_rgba(232,82,42,0.2)]'
                  : 'bg-card border border-[rgba(0,0,0,0.08)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]'
                }
              `}
            >
              {/* Compare checkbox */}
              <label className="absolute top-3 left-3 flex items-center gap-1.5 cursor-pointer z-10">
                <input
                  type="checkbox"
                  checked={isComparing}
                  onChange={() => toggleCompare(model.id)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isComparing ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                  {isComparing && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <span className="text-xs text-muted-foreground">{t('compare') || 'Comparar'}</span>
              </label>

              <div className="flex gap-4 mt-6">
                {model.image && (
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-24 h-24 object-contain rounded bg-white flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{model.brand}</p>
                  <p className="font-semibold truncate">{model.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {model.specs.printArea} · {model.specs.headType}
                  </p>
                  {model.price && (
                    <div className="mt-2">
                      <AnimatedPrice price={model.price} delay={index * 80} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => toggleProduct(model.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary text-white btn-primary-3d'
                      : 'border-2 border-primary text-primary btn-secondary-3d'
                  }`}
                >
                  {isSelected ? (
                    <><Minus className="h-4 w-4" />{t('rec_remove') || 'Quitar'}</>
                  ) : (
                    <><Plus className="h-4 w-4" />{t('rec_add') || 'Añadir'}</>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ROI Chart for first selected product */}
      {state.selectedProducts.length > 0 && roiInvestment > 0 && (
        <ROIChart
          investment={roiInvestment}
          revenuePerUnit={5}
          costPerUnit={0.4}
          unitsPerDay={state.uvProductionVolume || 10}
          t={t}
        />
      )}

      {/* Sticky comparison bar */}
      <AnimatePresence>
        {compareIds.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="sticky bottom-0 left-0 right-0 bg-card rounded-t-xl p-4 flex items-center justify-between shadow-lg z-20"
            style={{ border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <div className="flex items-center gap-2">
              <GitCompareArrows className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                {t('comparing') || 'Comparando'} {compareIds.length} {t('models') || 'modelos'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompareIds([])}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
              >
                {t('cancel') || 'Cancelar'}
              </button>
              <button
                onClick={() => setShowComparison(true)}
                className="btn-primary-3d bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                {t('compare_view') || 'Ver comparativa'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && (
          <ComparisonModal
            modelIds={compareIds}
            onClose={() => setShowComparison(false)}
            onAdd={(id) => {
              if (!state.selectedProducts.includes(id)) {
                updateState({ selectedProducts: [...state.selectedProducts, id] });
              }
            }}
            selectedProducts={state.selectedProducts}
            t={t}
          />
        )}
      </AnimatePresence>

      <p className="text-xs text-hint mt-6">{t('rec_disclaimer') || 'Los precios son orientativos y pueden variar.'}</p>
    </div>
  );
}
