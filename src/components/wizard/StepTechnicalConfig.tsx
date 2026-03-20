import { motion } from 'framer-motion';
import {
  Square,
  Circle,
  Hexagon,
  Info,
  Check,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  WizardState,
  UV_MAX_SIZES,
  UV_SURFACE_TYPES,
  UV_MATERIALS,
  UV_SPECIAL_EFFECTS,
  TEXTILE_METHODS,
  TEXTILE_PRINT_SIZES,
  TEXTILE_GARMENT_COLORS,
  LASER_WORK_TYPES,
  LASER_MATERIALS,
  LASER_SIZES,
  PACKAGING_CONTAINER_TYPES,
  PACKAGING_MATERIALS,
  CARD_MATERIALS,
  CARD_FORMATS,
  type UvMaterial,
  type UvSpecialEffect,
  type UvSurfaceType,
  type LaserMaterialType,
} from '@/lib/wizardTypes';

interface StepProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  t: (key: string) => string;
}

// ── Shared UI helpers ──

function SelectionCard({
  selected,
  onClick,
  children,
  className = '',
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative flex flex-col items-center justify-center gap-1 rounded-lg p-4 text-center
        transition-shadow duration-200 cursor-pointer
        ${selected
          ? 'bg-[#fdf0eb] border-2 border-primary'
          : 'bg-card border border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.16)] hover:shadow-md'
        }
        ${className}
      `}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}
      {children}
    </motion.button>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-medium mt-6 mb-3">{children}</h3>;
}

function InfoBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-[#fdf0eb] p-4 mb-4" style={{ border: '1px solid rgba(232,82,42,0.2)' }}>
      <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

// ── UV Printing ──

function UvPrintingConfig({ state, updateState, t }: StepProps) {
  const SURFACE_ICONS: Record<UvSurfaceType, React.ReactNode> = {
    flat: <Square className="h-6 w-6" />,
    cylindrical: <Circle className="h-6 w-6" />,
    irregular: <Hexagon className="h-6 w-6" />,
  };

  const toggleMaterial = (mat: UvMaterial) => {
    const current = state.uvMaterials;
    const next = current.includes(mat)
      ? current.filter((m) => m !== mat)
      : [...current, mat];
    updateState({ uvMaterials: next });
  };

  const toggleEffect = (eff: UvSpecialEffect) => {
    if (eff === 'none') {
      updateState({ uvSpecialEffects: ['none'] });
      return;
    }
    const current = state.uvSpecialEffects.filter((e) => e !== 'none');
    const next = current.includes(eff)
      ? current.filter((e) => e !== eff)
      : [...current, eff];
    updateState({ uvSpecialEffects: next });
  };

  const volumeLabel = (v: number) => {
    if (v <= 10) return t('tc_volumeLow');
    if (v <= 50) return t('tc_volumeMedium');
    return t('tc_volumeHigh');
  };

  return (
    <>
      {/* Max object size */}
      <SectionHeading>{t('tc_uvMaxSize')}</SectionHeading>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {UV_MAX_SIZES.map((size) => (
          <SelectionCard
            key={size}
            selected={state.uvMaxSize.includes(size)}
            onClick={() => {
              const current = state.uvMaxSize;
              updateState({ uvMaxSize: current.includes(size) ? current.filter(s => s !== size) : [...current, size] });
            }}
          >
            <span className="font-medium">{size.toUpperCase()}</span>
          </SelectionCard>
        ))}
      </div>

      {/* Surface type */}
      <SectionHeading>{t('tc_surfaceType')}</SectionHeading>
      <div className="grid grid-cols-3 gap-3">
        {UV_SURFACE_TYPES.map((surface) => (
          <SelectionCard
            key={surface}
            selected={state.uvSurfaceType.includes(surface)}
            onClick={() => {
              const current = state.uvSurfaceType;
              updateState({ uvSurfaceType: current.includes(surface) ? current.filter(s => s !== surface) : [...current, surface] });
            }}
          >
            {SURFACE_ICONS[surface]}
            <span className="font-medium text-sm mt-1">{t(`tc_${surface}`)}</span>
          </SelectionCard>
        ))}
      </div>

      {/* Materials */}
      <SectionHeading>{t('tc_materials')}</SectionHeading>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {UV_MATERIALS.map((mat) => (
          <label
            key={mat}
            className="flex items-center gap-2 border border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.16)] hover:bg-accent/50 rounded-lg p-3 cursor-pointer transition-colors"
          >
            <Checkbox
              checked={state.uvMaterials.includes(mat)}
              onCheckedChange={() => toggleMaterial(mat)}
            />
            <span className="text-sm">{t(`tc_material_${mat}`)}</span>
          </label>
        ))}
      </div>

      {/* Special effects */}
      <SectionHeading>{t('tc_specialEffects')}</SectionHeading>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {UV_SPECIAL_EFFECTS.map((eff) => (
          <SelectionCard
            key={eff}
            selected={state.uvSpecialEffects.includes(eff)}
            onClick={() => toggleEffect(eff)}
          >
            <span className="font-medium text-sm">{t(`tc_effect_${eff}`)}</span>
          </SelectionCard>
        ))}
      </div>

      {/* Production volume */}
      <SectionHeading>{t('tc_productionVolume')}</SectionHeading>
      <div className="space-y-3">
        <Slider
          min={1}
          max={200}
          step={1}
          value={[state.uvProductionVolume]}
          onValueChange={([v]) => updateState({ uvProductionVolume: v })}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{state.uvProductionVolume} {t('tc_unitsPerDay')}</span>
          <span>{volumeLabel(state.uvProductionVolume)}</span>
        </div>
      </div>
    </>
  );
}

// ── Textile DTG/DTF ──

function TextileConfig({ state, updateState, t }: StepProps) {
  return (
    <>
      <InfoBanner message={t('tc_comingSoonBanner')} />

      <SectionHeading>{t('tc_textileMethod')}</SectionHeading>
      <div className="grid grid-cols-2 gap-3">
        {TEXTILE_METHODS.map((method) => (
          <SelectionCard
            key={method}
            selected={state.textileMethod === method}
            onClick={() => updateState({ textileMethod: method })}
          >
            <span className="font-medium">{t(`tc_${method}`)}</span>
          </SelectionCard>
        ))}
      </div>

      <SectionHeading>{t('tc_printSize')}</SectionHeading>
      <div className="grid grid-cols-3 gap-3">
        {TEXTILE_PRINT_SIZES.map((size) => (
          <SelectionCard
            key={size}
            selected={state.textilePrintSize === size}
            onClick={() => updateState({ textilePrintSize: size })}
          >
            <span className="font-medium">{size.toUpperCase()}</span>
          </SelectionCard>
        ))}
      </div>

      <SectionHeading>{t('tc_garmentColors')}</SectionHeading>
      <div className="grid grid-cols-3 gap-3">
        {TEXTILE_GARMENT_COLORS.map((color) => (
          <SelectionCard
            key={color}
            selected={state.textileGarmentColors === color}
            onClick={() => updateState({ textileGarmentColors: color })}
          >
            <span className="font-medium text-sm">{t(`tc_garment${color.charAt(0).toUpperCase() + color.slice(1)}`)}</span>
          </SelectionCard>
        ))}
      </div>

      <SectionHeading>{t('tc_textileVolume')}</SectionHeading>
      <div className="space-y-3">
        <Slider
          min={1}
          max={500}
          step={1}
          value={[state.textileVolume]}
          onValueChange={([v]) => updateState({ textileVolume: v })}
        />
        <p className="text-sm text-muted-foreground">
          {state.textileVolume} {t('tc_unitsPerDay')}
        </p>
      </div>
    </>
  );
}

// ── Laser Cutting ──

const LASER_POWER_RECS: Partial<Record<LaserMaterialType, string>> = {
  wood: '40W',
  acrylic: '60W',
  metal: '100W+',
};

function LaserConfig({ state, updateState, t }: StepProps) {
  return (
    <>
      <InfoBanner message={t('tc_comingSoonBanner')} />

      <SectionHeading>{t('tc_laserWorkType')}</SectionHeading>
      <div className="grid grid-cols-3 gap-3">
        {LASER_WORK_TYPES.map((wt) => (
          <SelectionCard
            key={wt}
            selected={state.laserWorkType === wt}
            onClick={() => updateState({ laserWorkType: wt })}
          >
            <span className="font-medium text-sm">{t(`tc_laser${wt.charAt(0).toUpperCase() + wt.slice(1)}`)}</span>
          </SelectionCard>
        ))}
      </div>

      <SectionHeading>{t('tc_laserMaterial')}</SectionHeading>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {LASER_MATERIALS.map((mat) => (
          <SelectionCard
            key={mat}
            selected={state.laserMaterial === mat}
            onClick={() => updateState({ laserMaterial: mat })}
          >
            <span className="font-medium text-sm">{t(`tc_material_${mat}`)}</span>
          </SelectionCard>
        ))}
      </div>

      {state.laserMaterial && LASER_POWER_RECS[state.laserMaterial] && (
        <p className="text-sm text-muted-foreground mt-2">
          {t('tc_laserPower')}: {LASER_POWER_RECS[state.laserMaterial]}
        </p>
      )}

      <SectionHeading>{t('tc_laserSize')}</SectionHeading>
      <div className="grid grid-cols-3 gap-3">
        {LASER_SIZES.map((size) => (
          <SelectionCard
            key={size}
            selected={state.laserSize === size}
            onClick={() => updateState({ laserSize: size })}
          >
            <span className="font-medium text-sm">{t(`tc_laser${size.charAt(0).toUpperCase() + size.slice(1)}`)}</span>
          </SelectionCard>
        ))}
      </div>
    </>
  );
}

// ── Packaging ──

function PackagingConfig({ state, updateState, t }: StepProps) {
  return (
    <>
      <InfoBanner message={t('tc_comingSoonBanner')} />

      <SectionHeading>{t('tc_containerType')}</SectionHeading>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {PACKAGING_CONTAINER_TYPES.map((ct) => (
          <SelectionCard
            key={ct}
            selected={state.packagingContainerType === ct}
            onClick={() => updateState({ packagingContainerType: ct })}
          >
            <span className="font-medium text-sm">{t(`tc_container_${ct}`)}</span>
          </SelectionCard>
        ))}
      </div>

      <SectionHeading>{t('tc_packMaterial')}</SectionHeading>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {PACKAGING_MATERIALS.map((mat) => (
          <SelectionCard
            key={mat}
            selected={state.packagingMaterial === mat}
            onClick={() => updateState({ packagingMaterial: mat })}
          >
            <span className="font-medium text-sm">{t(`tc_material_${mat}`)}</span>
          </SelectionCard>
        ))}
      </div>

      <SectionHeading>{t('tc_packDimensions')}</SectionHeading>
      <Input
        type="text"
        placeholder={t('tc_packDimensionsPlaceholder')}
        value={state.packagingDimensions}
        onChange={(e) => updateState({ packagingDimensions: e.target.value })}
        className="max-w-sm rounded-lg focus:border-primary focus:ring-primary"
      />

      <SectionHeading>{t('tc_packMinBatch')}</SectionHeading>
      <Input
        type="number"
        min={1}
        value={state.packagingMinBatch}
        onChange={(e) =>
          updateState({ packagingMinBatch: Math.max(1, Number(e.target.value) || 1) })
        }
        className="max-w-[180px] rounded-lg focus:border-primary focus:ring-primary"
      />
    </>
  );
}

// ── PVC Cards ──

function PvcCardsConfig({ state, updateState, t }: StepProps) {
  return (
    <>
      <InfoBanner message={t('tc_comingSoonBanner')} />

      <SectionHeading>{t('tc_cardMaterial')}</SectionHeading>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CARD_MATERIALS.map((mat) => (
          <SelectionCard
            key={mat}
            selected={state.cardMaterial === mat}
            onClick={() => updateState({ cardMaterial: mat })}
          >
            <span className="font-medium text-sm">{t(`tc_card_${mat}`)}</span>
          </SelectionCard>
        ))}
      </div>

      <SectionHeading>{t('tc_cardFormat')}</SectionHeading>
      <div className="grid grid-cols-3 gap-3">
        {CARD_FORMATS.map((fmt) => (
          <SelectionCard
            key={fmt}
            selected={state.cardFormat === fmt}
            onClick={() => updateState({ cardFormat: fmt })}
          >
            <span className="font-medium text-sm">{t(`tc_card_${fmt}`)}</span>
          </SelectionCard>
        ))}
      </div>

      <SectionHeading>{t('tc_cardVolume')}</SectionHeading>
      <Input
        type="number"
        min={1}
        value={state.cardVolume}
        onChange={(e) =>
          updateState({ cardVolume: Math.max(1, Number(e.target.value) || 1) })
        }
        className="max-w-[180px] rounded-lg focus:border-primary focus:ring-primary"
      />
    </>
  );
}

// ── Main Export ──

export function StepTechnicalConfig({ state, updateState, t }: StepProps) {
  if (state.productionType.length === 0) {
    return <p className="text-muted-foreground">{t('tc_selectProductionFirst')}</p>;
  }

  return (
    <div className="space-y-2">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">PASO 03</p>
        <h3 className="text-display text-[32px] leading-tight mb-2">{t('ws_step3')}</h3>
        <p className="text-base text-muted-foreground max-w-[520px]">{t('tc_subtitle') || 'Configura los detalles técnicos de tu producción.'}</p>
      </div>
      {state.productionType.includes('uvPrinting') && (
        <UvPrintingConfig state={state} updateState={updateState} t={t} />
      )}
      {state.productionType.includes('textileDtgDtf') && (
        <TextileConfig state={state} updateState={updateState} t={t} />
      )}
      {state.productionType.includes('laserCutting') && (
        <LaserConfig state={state} updateState={updateState} t={t} />
      )}
      {state.productionType.includes('packaging') && (
        <PackagingConfig state={state} updateState={updateState} t={t} />
      )}
      {state.productionType.includes('pvcCards') && (
        <PvcCardsConfig state={state} updateState={updateState} t={t} />
      )}
    </div>
  );
}
