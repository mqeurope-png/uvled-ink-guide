import { useParams, useNavigate } from 'react-router-dom';
import { printerModels } from '@/lib/printerData';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { SpecsTable } from '@/components/SpecsTable';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ModelSpecs = () => {
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
            {t('technicalSpecs')}
          </h1>
        </section>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image */}
          {model.image && (
            <section>
              <div className="border border-border-subtle bg-muted/20 p-8">
                <AspectRatio ratio={4/3}>
                  <img 
                    src={model.image} 
                    alt={model.fullName}
                    className="h-full w-full object-contain"
                  />
                </AspectRatio>
              </div>
            </section>
          )}

          {/* Specs Table */}
          <section>
            <SpecsTable model={model} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default ModelSpecs;
