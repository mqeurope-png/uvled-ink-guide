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
      className={`group relative flex flex-col overflow-hidden rounded-lg bg-card transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        isDiscontinued
          ? 'opacity-75 hover:opacity-100'
          : ''
      }`}
      style={{ border: '1px solid rgba(0,0,0,0.08)' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.16)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
    >
      {/* Image */}
      {model.image && (
        <div className="relative bg-[#f9f7f4]">
          <AspectRatio ratio={4/3}>
            <img
              src={model.image}
              alt={model.fullName}
              className="h-full w-full object-contain p-4"
            />
          </AspectRatio>
          {isDiscontinued && showDiscontinued && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-secondary text-white px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-medium">
              <AlertTriangle className="h-3 w-3" />
              {t('discontinued')}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3">
          <p className="text-label text-muted-foreground">
            {model.brand}
          </p>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-medium tracking-tight">
            {model.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {model.fullName}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <span className="text-label text-muted-foreground">
            {model.specs.printArea}
          </span>
          <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
