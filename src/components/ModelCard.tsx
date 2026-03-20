import { PrinterModel } from '@/lib/printerData';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ModelCardProps {
  model: PrinterModel;
  showDiscontinued?: boolean;
}

export function ModelCard({ model, showDiscontinued }: ModelCardProps) {
  const { t } = useLanguage();
  const isDiscontinued = model.category === 'discontinued';

  return (
    <Link
      to={`/model/${model.id}`}
      className={`group relative flex flex-col overflow-hidden border bg-card transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${
        isDiscontinued 
          ? 'border-muted-foreground/20 opacity-75 hover:opacity-100' 
          : 'border-border-subtle hover:border-foreground/20'
      }`}
    >
      {/* Image */}
      {model.image && (
        <div className="relative bg-muted/30">
          <AspectRatio ratio={4/3}>
            <img 
              src={model.image} 
              alt={model.fullName}
              className="h-full w-full object-contain p-4"
            />
          </AspectRatio>
          {isDiscontinued && showDiscontinued && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-muted-foreground/90 px-2 py-1 text-[10px] uppercase tracking-wider text-background">
              <AlertTriangle className="h-3 w-3" />
              {t('discontinued')}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {model.brand}
          </p>
        </div>
        
        <div className="flex-1">
          <h3 className="text-2xl text-ultra-slim tracking-tight">
            {model.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {model.fullName}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {model.specs.printArea}
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
