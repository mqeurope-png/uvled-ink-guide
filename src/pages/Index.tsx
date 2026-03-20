import { useLanguage } from '@/contexts/LanguageContext';
import { getMboModels, getArtisjetModels } from '@/lib/printerData';
import { ModelCard } from '@/components/ModelCard';
import { Header } from '@/components/Header';

const Index = () => {
  const { t } = useLanguage();

  const mboModels = getMboModels();
  const artisjetModels = getArtisjetModels();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <h1 className="text-4xl text-display tracking-tight md:text-6xl">
            {t('brand')}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            {t('selectModel')}
          </p>
        </section>

        {/* MBO PRINTERS Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-label text-muted-foreground">
              {t('mboModels')}
            </h2>
            <div className="mt-2 h-px" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }} />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mboModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </section>

        {/* ARTISJET Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-label text-muted-foreground">
              {t('artisjetModels')}
            </h2>
            <div className="mt-2 h-px" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }} />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artisjetModels.map((model) => (
              <ModelCard key={model.id} model={model} />
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

export default Index;
