import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Printer, Calculator } from 'lucide-react';
import { QuoteCalculator } from '@/components/QuoteCalculator';

const Landing = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showQuoteCalculator, setShowQuoteCalculator] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border-subtle">
        <div className="container flex h-16 items-center justify-end">
          <LanguageSelector />
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container text-center py-20">
          <div className="mb-8">
            <Printer className="mx-auto h-20 w-20 text-foreground stroke-[0.5]" />
          </div>
          
          <h1 className="text-5xl text-ultra-slim tracking-tight md:text-7xl mb-2">
            BOMEDIA
          </h1>
          
          <h2 className="text-2xl text-slim tracking-wide text-muted-foreground md:text-3xl mb-4">
            {t('brand')}
          </h2>
          
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg mb-12">
            {t('landingSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/uv-led-info')}
              variant="outline"
              size="lg"
              className="text-lg px-12 py-6 border-foreground hover:bg-foreground hover:text-background transition-all"
            >
              {t('enterButton')}
            </Button>
            
            <Button
              onClick={() => setShowQuoteCalculator(true)}
              variant="outline"
              size="lg"
              className="text-lg px-12 py-6 border-foreground hover:bg-foreground hover:text-background transition-all gap-2"
            >
              <Calculator className="h-5 w-5" />
              {t('quoteButton')}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-6">
        <div className="container">
          <p className="text-center text-xs text-muted-foreground">
            © 2025 MBO PRINTERS / ARTISJET. Powered by{' '}
            <a
              href="https://www.boprint.net"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              boprint.net
            </a>
          </p>
        </div>
      </footer>

      {/* Quote Calculator Dialog */}
      <QuoteCalculator
        open={showQuoteCalculator}
        onOpenChange={setShowQuoteCalculator}
      />
    </div>
  );
};

export default Landing;
