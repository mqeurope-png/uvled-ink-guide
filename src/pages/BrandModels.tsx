import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getMboModels, getArtisjetModels } from '@/lib/printerData';
import { ModelCard } from '@/components/ModelCard';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BrandModels = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getModels = () => {
    switch (brandId) {
      case 'mbo':
        return getMboModels();
      case 'artisjet':
        return getArtisjetModels();
      default:
        return [];
    }
  };

  const getBrandTitle = () => {
    switch (brandId) {
      case 'mbo':
        return 'MBO PRINTERS';
      case 'artisjet':
        return 'ARTISJET';
      default:
        return '';
    }
  };

  const getBrandSubtitle = () => {
    switch (brandId) {
      case 'mbo':
        return t('mboBrandSubtitle');
      case 'artisjet':
        return t('artisjetBrandSubtitle');
      default:
        return '';
    }
  };

  const models = getModels();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/uv-led-info')}
          className="mb-8 -ml-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Button>

        {/* Title */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl text-display tracking-tight md:text-5xl">
            {getBrandTitle()}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {getBrandSubtitle()}
          </p>
        </section>

        {/* Models Grid */}
        <section>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="container">
          <p className="text-center text-xs text-muted-foreground">
            © 2025 MBO PRINTERS / ARTISJET. Powered by{' '}
            <a
              href="https://www.boprint.net"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              boprint.net
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BrandModels;
