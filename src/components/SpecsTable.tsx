import { PrinterModel } from '@/lib/printerData';
import { useLanguage } from '@/contexts/LanguageContext';

interface SpecsTableProps {
  model: PrinterModel;
}

export function SpecsTable({ model }: SpecsTableProps) {
  const { t } = useLanguage();

  const specs = model.specs;
  
  const specRows = [
    { key: 'printArea', value: specs.printArea },
    { key: 'maxHeight', value: specs.maxHeight },
    { key: 'resolution', value: specs.resolution },
    { key: 'inkType', value: specs.inkType },
    { key: 'heads', value: specs.heads },
    { key: 'headType', value: specs.headType },
    { key: 'printSpeed', value: specs.printSpeed },
    { key: 'connectivity', value: specs.connectivity },
    { key: 'power', value: specs.power },
    { key: 'dimensions', value: specs.dimensions },
    { key: 'weight', value: specs.weight },
  ].filter(row => row.value);

  return (
    <div className="border border-border-subtle">
      {specRows.map((row, index) => (
        <div
          key={row.key}
          className={`flex ${index !== specRows.length - 1 ? 'border-b border-border-subtle' : ''}`}
        >
          <div className="w-1/3 border-r border-border-subtle bg-secondary/30 p-4">
            <span className="text-sm text-muted-foreground">{t(row.key)}</span>
          </div>
          <div className="flex-1 p-4">
            <span className="text-sm text-slim">{row.value}</span>
          </div>
        </div>
      ))}

    </div>
  );
}
