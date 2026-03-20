import { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Eye,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Calculator,
  Columns3,
  PackageOpen,
  X,
} from 'lucide-react';
import { WizardState } from '@/lib/wizardTypes';
import {
  getRecommendations,
  calculateROI,
  Recommendation,
} from '@/lib/wizardRecommendations';
import { parsePrice, formatPrice } from '@/lib/quoteUtils';
import { printerModels } from '@/lib/printerData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface StepProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  t: (key: string) => string;
}

export function StepRecommendations({ state, updateState, t }: StepProps) {
  const [specsModelId, setSpecsModelId] = useState<string | null>(null);
  const [roiOpen, setRoiOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [roiInputs, setRoiInputs] = useState<
    Record<string, { sellingPrice: number; unitsPerDay: number }>
  >({});
  const [accessoriesOpen, setAccessoriesOpen] = useState<Record<string, boolean>>({});

  const recommendations = useMemo(() => getRecommendations(state), [state]);

  // Empty state for non-UV production types
  if (state.productionType !== 'uvPrinting') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <PackageOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('rec_noResults')}</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          {t('rec_comingSoonMsg')}
        </p>
        <Button onClick={() => updateState({ selectedProducts: [] })}>
          {t('rec_skipToContact')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  const selectedModels = recommendations.filter((r) =>
    state.selectedProducts.includes(r.model.id)
  );

  const specsModel = specsModelId
    ? printerModels.find((m) => m.id === specsModelId)
    : null;

  function toggleProduct(modelId: string) {
    const current = state.selectedProducts;
    const updated = current.includes(modelId)
      ? current.filter((id) => id !== modelId)
      : [...current, modelId];
    updateState({ selectedProducts: updated });
  }

  function toggleAccessory(
    modelId: string,
    accessoryId: string,
    name: string,
    price?: string
  ) {
    const current = state.selectedAccessories;
    const exists = current.some(
      (a) => a.modelId === modelId && a.accessoryId === accessoryId
    );
    const updated = exists
      ? current.filter(
          (a) => !(a.modelId === modelId && a.accessoryId === accessoryId)
        )
      : [...current, { modelId, accessoryId, name, price }];
    updateState({ selectedAccessories: updated });
  }

  function getScoreBadgeClass(score: number) {
    if (score > 60) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 30) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  }

  function getRoiInput(modelId: string) {
    return roiInputs[modelId] ?? { sellingPrice: 5, unitsPerDay: 10 };
  }

  function updateRoiInput(
    modelId: string,
    field: 'sellingPrice' | 'unitsPerDay',
    value: number
  ) {
    setRoiInputs((prev) => ({
      ...prev,
      [modelId]: { ...getRoiInput(modelId), [field]: value },
    }));
  }

  return (
    <div className="space-y-8">
      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const isSelected = state.selectedProducts.includes(rec.model.id);
          const price = parsePrice(rec.model.price);
          const modelAccessories = rec.model.accessories;

          return (
            <div
              key={rec.model.id}
              className={`border rounded-lg overflow-hidden transition-all duration-150 ${
                isSelected
                  ? 'border-foreground ring-1 ring-foreground/20'
                  : 'border-border-subtle hover:border-foreground/30'
              }`}
            >
              {/* Card Header */}
              <div className="flex gap-4 p-4">
                {rec.model.image && (
                  <img
                    src={rec.model.image}
                    alt={rec.model.name}
                    className="w-24 h-24 object-contain rounded bg-muted flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold truncate">{rec.model.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {rec.model.brand}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`flex-shrink-0 ${getScoreBadgeClass(rec.matchScore)}`}
                    >
                      {rec.matchScore}%
                    </Badge>
                  </div>

                  {/* Match Reasons */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {rec.matchReasons.map((reason) => (
                      <span
                        key={reason}
                        className="inline-block text-xs bg-muted px-2 py-0.5 rounded-full"
                      >
                        {t(reason)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Cost */}
              <div className="px-4 pb-2">
                {rec.model.price && (
                  <div>
                    <p className="text-lg font-bold">{rec.model.price}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('rec_orientativePrice')}
                    </p>
                  </div>
                )}
                {rec.costPerPrint != null && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('rec_costPerPrint')}: ~{formatPrice(rec.costPerPrint)}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 px-4 pb-4">
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleProduct(rec.model.id)}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {isSelected ? t('rec_removeFromQuote') : t('rec_addToQuote')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSpecsModelId(rec.model.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {t('rec_viewSpecs')}
                </Button>
              </div>

              {/* Accessories (collapsible, only when selected) */}
              {isSelected && modelAccessories.length > 0 && (
                <Collapsible
                  open={accessoriesOpen[rec.model.id] ?? false}
                  onOpenChange={(open) =>
                    setAccessoriesOpen((prev) => ({
                      ...prev,
                      [rec.model.id]: open,
                    }))
                  }
                >
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center justify-between w-full px-4 py-2 bg-muted/50 text-sm hover:bg-muted transition-colors">
                      <span>{t('rec_accessories')}</span>
                      {accessoriesOpen[rec.model.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 py-3 space-y-2 bg-muted/30">
                      {modelAccessories.map((acc) => {
                        const isAccSelected = state.selectedAccessories.some(
                          (a) =>
                            a.modelId === rec.model.id &&
                            a.accessoryId === acc.id
                        );
                        return (
                          <label
                            key={acc.id}
                            className="flex items-start gap-3 cursor-pointer"
                          >
                            <Checkbox
                              checked={isAccSelected}
                              onCheckedChange={() =>
                                toggleAccessory(
                                  rec.model.id,
                                  acc.id,
                                  acc.name,
                                  acc.price
                                )
                              }
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{acc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {acc.description}
                              </p>
                              {acc.price && (
                                <p className="text-xs font-medium mt-0.5">
                                  {acc.price}
                                </p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          );
        })}
      </div>

      {recommendations.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          {t('rec_noResults')}
        </p>
      )}

      {/* ROI Calculator (collapsible) */}
      {selectedModels.length > 0 && (
        <Collapsible open={roiOpen} onOpenChange={setRoiOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 w-full border rounded-lg px-4 py-3 text-left hover:bg-muted/50 transition-colors">
              <Calculator className="h-5 w-5" />
              <span className="font-semibold flex-1">{t('rec_roiCalculator')}</span>
              {roiOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border border-t-0 rounded-b-lg p-4 space-y-6">
              {selectedModels.map((rec) => {
                const price = parsePrice(rec.model.price) ?? 0;
                const costPerPrint = rec.costPerPrint ?? 0;
                const input = getRoiInput(rec.model.id);
                const roi = calculateROI(
                  price,
                  costPerPrint,
                  input.sellingPrice,
                  input.unitsPerDay
                );

                return (
                  <div key={rec.model.id} className="space-y-3">
                    <p className="font-medium">{rec.model.name}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`roi-price-${rec.model.id}`}>
                          {t('rec_sellingPrice')}
                        </Label>
                        <Input
                          id={`roi-price-${rec.model.id}`}
                          type="number"
                          min={0}
                          step={0.5}
                          value={input.sellingPrice}
                          onChange={(e) =>
                            updateRoiInput(
                              rec.model.id,
                              'sellingPrice',
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`roi-units-${rec.model.id}`}>
                          {t('rec_unitsPerDay')}
                        </Label>
                        <Input
                          id={`roi-units-${rec.model.id}`}
                          type="number"
                          min={0}
                          value={input.unitsPerDay}
                          onChange={(e) =>
                            updateRoiInput(
                              rec.model.id,
                              'unitsPerDay',
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                          {t('rec_monthsToRecover')}
                        </p>
                        <p className="text-lg font-bold">
                          {roi.monthsToRecover === Infinity
                            ? '--'
                            : roi.monthsToRecover}
                        </p>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                          {t('rec_dailyProfit')}
                        </p>
                        <p className="text-lg font-bold">
                          {formatPrice(Math.round(roi.dailyProfit * 100) / 100)}
                        </p>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                          {t('rec_yearlyProfit')}
                        </p>
                        <p className="text-lg font-bold">
                          {formatPrice(Math.round(roi.yearlyProfit))}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Compare Button */}
      {selectedModels.length >= 2 && selectedModels.length <= 3 && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setCompareOpen(true)}>
            <Columns3 className="h-4 w-4 mr-2" />
            {t('rec_compareModels')}
          </Button>
        </div>
      )}

      {/* Specs Modal */}
      <Dialog
        open={specsModelId !== null}
        onOpenChange={(open) => !open && setSpecsModelId(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{specsModel?.fullName ?? ''}</DialogTitle>
          </DialogHeader>
          {specsModel && (
            <div className="space-y-3">
              {specsModel.image && (
                <img
                  src={specsModel.image}
                  alt={specsModel.name}
                  className="w-full h-48 object-contain bg-muted rounded-lg"
                />
              )}
              <table className="w-full text-sm">
                <tbody>
                  {(
                    [
                      ['price', specsModel.price],
                      ['printArea', specsModel.specs.printArea],
                      ['maxHeight', specsModel.specs.maxHeight],
                      ['resolution', specsModel.specs.resolution],
                      ['headType', specsModel.specs.headType],
                      ['inkType', specsModel.specs.inkType],
                      ['heads', specsModel.specs.heads],
                      ['weight', specsModel.specs.weight],
                      ['dimensions', specsModel.specs.dimensions],
                    ] as [string, string | undefined][]
                  ).map(
                    ([labelKey, value]) =>
                      value && (
                        <tr key={labelKey} className="border-b last:border-0">
                          <td className="py-2 font-medium text-muted-foreground pr-4">
                            {t(labelKey)}
                          </td>
                          <td className="py-2">{value}</td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Comparator Dialog */}
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('rec_comparison')}</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left pr-4"></th>
                  {selectedModels.map((rec) => (
                    <th key={rec.model.id} className="py-2 text-left px-2 min-w-[140px]">
                      {rec.model.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['price', (m: Recommendation) => m.model.price ?? '--'],
                    ['printArea', (m: Recommendation) => m.model.specs.printArea],
                    ['maxHeight', (m: Recommendation) => m.model.specs.maxHeight],
                    ['resolution', (m: Recommendation) => m.model.specs.resolution],
                    ['headType', (m: Recommendation) => m.model.specs.headType],
                    ['inkType', (m: Recommendation) => m.model.specs.inkType],
                    ['weight', (m: Recommendation) => m.model.specs.weight],
                    ['dimensions', (m: Recommendation) => m.model.specs.dimensions],
                  ] as [string, (m: Recommendation) => string][]
                ).map(([labelKey, getValue]) => (
                  <tr key={labelKey} className="border-b last:border-0">
                    <td className="py-2 font-medium text-muted-foreground pr-4 whitespace-nowrap">
                      {t(labelKey)}
                    </td>
                    {selectedModels.map((rec) => (
                      <td key={rec.model.id} className="py-2 px-2">
                        {getValue(rec)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
