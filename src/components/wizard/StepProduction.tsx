import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer, Shirt, Package, Zap, CreditCard, Check,
  type LucideIcon,
} from 'lucide-react';
import { WizardState, ProductionType, PRODUCTION_TYPES } from '@/lib/wizardTypes';

interface StepProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  t: (key: string) => string;
}

const PRODUCTION_ICONS: Record<ProductionType, LucideIcon> = {
  uvPrinting: Printer,
  textileDtgDtf: Shirt,
  packaging: Package,
  laserCutting: Zap,
  pvcCards: CreditCard,
};

const PRODUCTION_BADGES: Record<ProductionType, string> = {
  uvPrinting: 'UV LED',
  textileDtgDtf: 'Coming soon',
  packaging: 'Coming soon',
  laserCutting: 'Coming soon',
  pvcCards: 'Coming soon',
};

// ADMIN: replaceable via admin panel
const GALLERY_IMAGES: Record<ProductionType, { src: string; alt: string }[]> = {
  uvPrinting: [
    { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=200&fit=crop', alt: 'UV printing on phone cases' },
    { src: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop', alt: 'Personalized products' },
    { src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&h=200&fit=crop', alt: 'UV printed signage' },
    // TODO: replace with real application photos in /src/assets/gallery/
  ],
  textileDtgDtf: [
    { src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&h=200&fit=crop', alt: 'DTG printing' },
    { src: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&h=200&fit=crop', alt: 'Custom t-shirts' },
    { src: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=200&fit=crop', alt: 'Textile design' },
  ],
  packaging: [
    { src: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=300&h=200&fit=crop', alt: 'Custom packaging' },
    { src: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=300&h=200&fit=crop', alt: 'Branded boxes' },
    { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=200&fit=crop', alt: 'Product packaging' },
  ],
  laserCutting: [
    { src: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop', alt: 'Laser cutting' },
    { src: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=200&fit=crop', alt: 'Laser engraving' },
    { src: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=300&h=200&fit=crop', alt: 'Laser cut products' },
  ],
  pvcCards: [
    { src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop', alt: 'PVC cards' },
    { src: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=300&h=200&fit=crop', alt: 'Credential printing' },
    { src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop', alt: 'Card production' },
  ],
};

export function StepProduction({ state, updateState, t }: StepProps) {
  const toggleType = (type: ProductionType) => {
    const current = state.productionType;
    if (current.includes(type)) {
      updateState({ productionType: current.filter(p => p !== type) });
    } else {
      updateState({ productionType: [...current, type] });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">PASO 02</p>
        <h3 className="text-display text-[32px] leading-tight mb-2">{t('ws_step2')}</h3>
        <p className="text-base text-muted-foreground max-w-[520px]">{t('pr_subtitle') || 'Selecciona qué tipo de producción te interesa.'}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {PRODUCTION_TYPES.map((type) => {
          const Icon = PRODUCTION_ICONS[type];
          const isSelected = state.productionType.includes(type);
          const badge = PRODUCTION_BADGES[type];
          const isComingSoon = type !== 'uvPrinting' && type !== 'pvcCards';

          return (
            <motion.button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative flex flex-col items-start gap-3 rounded-lg p-6 text-left
                transition-all duration-200 cursor-pointer
                ${isSelected
                  ? 'bg-[#fdf0eb] border-2 border-primary shadow-[0_8px_20px_rgba(232,82,42,0.2)] -translate-y-[3px]'
                  : 'bg-card border border-[rgba(0,0,0,0.08)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.16)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              {!isSelected && (
                <span
                  className={`
                    absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full
                    ${isComingSoon
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary/10 text-primary'
                    }
                  `}
                >
                  {badge}
                </span>
              )}
              <Icon className={`h-8 w-8 ${isComingSoon ? 'opacity-60' : ''} ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className={`font-medium ${isComingSoon ? 'opacity-70' : ''}`}>
                  {t(`pr_${type}`)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t(`pr_${type}Desc`)}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Gallery for selected production types */}
      <AnimatePresence>
        {state.productionType.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 overflow-hidden"
          >
            {state.productionType.map(type => (
              <div key={type} className="mb-4">
                <p className="category-label mb-3">{t(`pr_${type}`)}</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {GALLERY_IMAGES[type]?.map((img, i) => (
                    <img
                      key={i}
                      src={img.src}
                      alt={img.alt}
                      className="w-[160px] h-[110px] rounded-lg object-cover flex-shrink-0"
                      style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
