import { Accessory } from '@/lib/printerData';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExternalLink } from 'lucide-react';

interface AccessoryCardProps {
  accessory: Accessory;
}

export function AccessoryCard({ accessory }: AccessoryCardProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col border border-border-subtle bg-card p-6">
      <h3 className="text-lg text-slim">{accessory.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">
        {accessory.description}
      </p>
      
      <a
        href={accessory.url}
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
