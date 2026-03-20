import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Printer, Calculator, Phone } from 'lucide-react';
import { QuoteWizard } from '@/components/QuoteWizard';

const Landing = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showQuoteCalculator, setShowQuoteCalculator] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-semibold text-white">UV</span>
            </div>
            <span className="text-label tracking-widest">BOMEDIA</span>
          </div>
          <div className="flex items-center gap-4">
            {/* ADMIN: replaceable via admin panel */}
            <a href="tel:+34682627056" className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              +34 682 62 70 56
            </a>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center" style={{ minHeight: '85vh' }}>
        <div className="container text-center py-20">
          <div className="mb-8">
            <Printer className="mx-auto h-20 w-20 text-primary stroke-[0.5]" />
          </div>

          <h1 className="mb-6">
            <span className="text-display block text-5xl md:text-6xl lg:text-7xl">Imprime sobre</span>
            <span className="text-display-italic block text-5xl md:text-6xl lg:text-7xl">cualquier superficie.</span>
          </h1>

          {/* Orange accent line */}
          <div className="mx-auto w-[60px] h-[1px] bg-primary mb-6" />

          <p className="mx-auto max-w-2xl text-muted-foreground text-lg mb-12">
            {t('landingSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/uv-led-info')}
              className="btn-secondary-3d text-lg px-12 py-4 rounded-lg border-2 border-primary text-primary font-medium hover:bg-[#fdf0eb] transition-all duration-200"
            >
              {t('enterButton')}
            </button>

            <button
              onClick={() => setShowQuoteCalculator(true)}
              className="btn-primary-3d text-lg px-12 py-4 rounded-lg bg-primary text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Calculator className="h-5 w-5" />
              {t('quoteButton')}
            </button>
          </div>

          {/* Social proof bar */}
          <div className="mt-16 py-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span>Más de 500 clientes en Europa</span>
              <span className="text-primary hidden sm:inline">●</span>
              <span>Distribuidor oficial artisJet y MBO</span>
              <span className="text-primary hidden sm:inline">●</span>
              <span>Soporte técnico propio</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a3a5c] text-white/70">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Col 1: Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <span className="text-xs font-semibold text-white">UV</span>
                </div>
                <span className="text-white font-semibold tracking-wider">BOMEDIA</span>
              </div>
              <p className="text-sm mb-4">Distribuidor oficial de impresoras UV LED en Europa.</p>
              <div className="flex gap-3">
                {/* Social placeholders */}
                {['FB', 'IG', 'YT', 'LI'].map(s => (
                  <div key={s} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/20 transition-colors cursor-pointer">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Col 2: Links */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/uv-led-info" className="hover:text-white transition-colors">Catálogo</a></li>
                <li><a href="/uv-technology" className="hover:text-white transition-colors">Tecnología UV LED</a></li>
                <li><a href="/admin" className="hover:text-white transition-colors">Admin</a></li>
                <li><a href="mailto:manel@bomedia.net" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>

            {/* Col 3: Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:manel@bomedia.net" className="hover:text-white transition-colors">manel@bomedia.net</a></li>
                <li><a href="tel:+34682627056" className="hover:text-white transition-colors">+34 682 62 70 56</a></li>
                <li>Barcelona, España</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 text-center text-xs text-white/40" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            © 2025 BOMEDIA. Powered by{' '}
            <a href="https://www.boprint.net" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">
              boprint.net
            </a>
          </div>
        </div>
      </footer>

      <QuoteWizard
        open={showQuoteCalculator}
        onOpenChange={setShowQuoteCalculator}
      />
    </div>
  );
};

export default Landing;
