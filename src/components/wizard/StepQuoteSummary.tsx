import { useMemo } from 'react';
import { X, Plus } from 'lucide-react';
import { WizardState } from '@/lib/wizardTypes';
import { printerModels } from '@/lib/printerData';
import { parsePrice, formatPrice } from '@/lib/quoteUtils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface StepProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  t: (key: string) => string;
}

export function StepQuoteSummary({
  state,
  updateState,
  t,
}: StepProps) {
  const selectedModelData = useMemo(
    () =>
      state.selectedProducts
        .map((id) => printerModels.find((m) => m.id === id))
        .filter(Boolean) as typeof printerModels,
    [state.selectedProducts]
  );

  const subtotal = useMemo(() => {
    let total = 0;
    for (const model of selectedModelData) {
      const price = parsePrice(model.price);
      if (price) total += price;
    }
    for (const acc of state.selectedAccessories) {
      const price = parsePrice(acc.price);
      if (price) total += price;
    }
    return total;
  }, [selectedModelData, state.selectedAccessories]);

  function removeProduct(modelId: string) {
    updateState({
      selectedProducts: state.selectedProducts.filter((id) => id !== modelId),
      selectedAccessories: state.selectedAccessories.filter(
        (a) => a.modelId !== modelId
      ),
    });
  }

  function removeAccessory(modelId: string, accessoryId: string) {
    updateState({
      selectedAccessories: state.selectedAccessories.filter(
        (a) => !(a.modelId === modelId && a.accessoryId === accessoryId)
      ),
    });
  }

  function addAccessory(
    modelId: string,
    accessoryId: string,
    name: string,
    price?: string
  ) {
    updateState({
      selectedAccessories: [
        ...state.selectedAccessories,
        { modelId, accessoryId, name, price },
      ],
    });
  }

  // Get unselected accessories for upsell
  function getUpsellAccessories(modelId: string) {
    const model = printerModels.find((m) => m.id === modelId);
    if (!model) return [];
    return model.accessories.filter(
      (acc) =>
        !state.selectedAccessories.some(
          (a) => a.modelId === modelId && a.accessoryId === acc.id
        )
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">PASO 06</p>
        <h3 className="text-display text-[32px] leading-tight mb-2">{t('sum_title') || 'Resumen del presupuesto'}</h3>
        <p className="text-base text-muted-foreground max-w-[520px]">{t('sum_subtitle') || 'Revisa tu selección antes de continuar.'}</p>
      </div>

      {/* 1. Selected Products */}
      <section>
        <h3 className="text-lg font-medium mb-3">{t('sum_selectedProducts')}</h3>
        {selectedModelData.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t('sum_noProducts')}</p>
        ) : (
          <div className="space-y-3">
            {selectedModelData.map((model) => (
              <div key={model.id}>
                <div
                  className="flex items-center gap-3 rounded-lg bg-card p-3 transition-colors hover:border-[rgba(0,0,0,0.16)]"
                  style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                >
                  {model.image && (
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-16 h-16 object-contain rounded bg-muted flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{model.name}</p>
                    <p className="text-sm text-muted-foreground">{model.brand}</p>
                    {model.price && (
                      <p className="text-sm font-semibold mt-0.5">{model.price}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 hover:text-primary"
                    onClick={() => removeProduct(model.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Selected accessories for this model */}
                {state.selectedAccessories
                  .filter((a) => a.modelId === model.id)
                  .map((acc) => (
                    <div
                      key={`${acc.modelId}-${acc.accessoryId}`}
                      className="flex items-center gap-3 ml-6 mt-1 rounded-lg bg-[#f9f7f4] p-2"
                      style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{acc.name}</p>
                        {acc.price && (
                          <p className="text-xs text-muted-foreground">{acc.price}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 flex-shrink-0 hover:text-primary"
                        onClick={() => removeAccessory(acc.modelId, acc.accessoryId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="h-px bg-[rgba(0,0,0,0.08)] my-6" />

      {/* 2. Orientative Subtotal */}
      <section>
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-medium">{t('sum_subtotal')}</h3>
          <p className="text-price text-2xl">{formatPrice(subtotal)}</p>
        </div>
        <p className="text-xs text-hint mt-1">{t('rec_disclaimer')}</p>
      </section>

      <div className="h-px bg-[rgba(0,0,0,0.08)] my-6" />

      {/* 3. Accessories Upsell */}
      {selectedModelData.some(
        (model) => getUpsellAccessories(model.id).length > 0
      ) && (
        <section>
          <h3 className="text-lg font-medium mb-3">{t('sum_accessoriesUpsell')}</h3>
          <div className="space-y-4">
            {selectedModelData.map((model) => {
              const upsell = getUpsellAccessories(model.id);
              if (upsell.length === 0) return null;
              return (
                <div key={model.id}>
                  <p className="text-sm text-muted-foreground mb-2">
                    {model.name}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {upsell.map((acc) => (
                      <div
                        key={acc.id}
                        className="flex items-center gap-3 rounded-lg p-3"
                        style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{acc.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {acc.description}
                          </p>
                          {acc.price && (
                            <p className="text-xs font-medium mt-0.5">{acc.price}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="flex-shrink-0 border-2 border-primary text-primary bg-transparent rounded-lg hover:bg-primary/5"
                          onClick={() =>
                            addAccessory(model.id, acc.id, acc.name, acc.price)
                          }
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {t('sum_addAccessory')}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="h-px bg-[rgba(0,0,0,0.08)] my-6" />

      {/* 4. Notes */}
      <section>
        <Label htmlFor="quoteNotes" className="text-lg font-medium">
          {t('sum_notes')}
        </Label>
        <Textarea
          id="quoteNotes"
          placeholder={t('sum_notesPlaceholder')}
          value={state.notes}
          onChange={(e) => updateState({ notes: e.target.value })}
          className="mt-2 rounded-lg focus:border-primary focus:ring-primary"
          rows={4}
        />
      </section>
    </div>
  );
}
