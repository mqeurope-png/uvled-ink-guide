import { useParams, useNavigate } from 'react-router-dom';
import { printerModels } from '@/lib/printerData';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { AccessoryCard } from '@/components/AccessoryCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ModelAccessories = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const model = printerModels.find((m) => m.id === modelId);

  if (!model) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Modelo no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-16">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 -ml-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Button>

        <section className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {model.fullName}
          </p>
          <h1 className="mt-4 text-3xl text-ultra-slim tracking-tight md:text-4xl">
            {t('accessories')}
          </h1>
        </section>

        <section>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {model.accessories.map((accessory) => (
              <AccessoryCard key={accessory.id} accessory={accessory} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ModelAccessories;
