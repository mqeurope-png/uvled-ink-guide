import { Consumable } from '@/lib/printerData';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExternalLink, Clock } from 'lucide-react';

interface ConsumableCardProps {
  consumable: Consumable;
}

export function ConsumableCard({ consumable }: ConsumableCardProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col border border-border-subtle bg-card p-6">
      <div className="mb-4">
        <span className="inline-block border border-border-subtle px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          {t(consumable.type)}
        </span>
      </div>
      
      <h3 className="text-lg text-slim">{consumable.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">
        {consumable.description}
      </p>

      {consumable.lifespan && (
        <div className="mt-4 flex items-center gap-2 rounded bg-muted/50 px-3 py-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            <strong className="text-foreground">{t('lifespan')}:</strong> {consumable.lifespan}
          </span>
        </div>
      )}
      
      <a
        href={consumable.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {t('viewProduct')}
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
