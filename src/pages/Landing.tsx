import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Printer, Calculator } from 'lucide-react';
import { QuoteWizard } from '@/components/QuoteWizard';

const Landing = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showQuoteCalculator, setShowQuoteCalculator] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="container flex h-16 items-center justify-end">
          <LanguageSelector />
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container text-center py-20">
          <div className="mb-8">
            <Printer className="mx-auto h-20 w-20 text-primary stroke-[0.5]" />
          </div>

          <h1 className="text-display mb-2">
            BOMEDIA
          </h1>

          <h2 className="text-muted-foreground mb-4">
            {t('brand')}
          </h2>

          <p className="mx-auto max-w-2xl text-muted-foreground text-lg mb-12">
            {t('landingSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/uv-led-info')}
              className="text-lg px-12 py-4 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all duration-200"
            >
              {t('enterButton')}
            </button>

            <button
              onClick={() => setShowQuoteCalculator(true)}
              className="text-lg px-12 py-4 rounded-lg bg-primary text-white font-medium hover:brightness-[0.92] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Calculator className="h-5 w-5" />
              {t('quoteButton')}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }} className="py-6">
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

      {/* Quote Calculator Dialog */}
      <QuoteWizard
        open={showQuoteCalculator}
        onOpenChange={setShowQuoteCalculator}
      />
    </div>
  );
};

export default Landing;
