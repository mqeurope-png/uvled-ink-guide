import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Lightbulb, ChevronRight } from 'lucide-react';

const UvLedInfo = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 md:py-16">
        {/* Title */}
        <section className="mb-8 md:mb-16 text-center">
          <h1 className="text-3xl text-display tracking-tight md:text-6xl mb-4 md:mb-6">
            {t('uvLedTechnology')}
          </h1>
          <p className="mx-auto max-w-3xl text-muted-foreground text-base md:text-lg">
            {t('uvLedDescription')}
          </p>
        </section>

        {/* UV LED Technology Button */}
        <section className="mb-10 md:mb-20">
          <div className="max-w-xl mx-auto">
            <button
              onClick={() => navigate('/uv-technology')}
              className="group w-full flex items-center gap-3 md:gap-4 p-4 md:p-6 text-left rounded-lg bg-card hover:text-primary transition-all duration-300"
              style={{ border: '1px solid rgba(0,0,0,0.08)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.16)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'}
            >
              <Lightbulb className="h-8 w-8 md:h-10 md:w-10 shrink-0 stroke-[0.5] group-hover:stroke-[0.75] transition-all" />
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-medium mb-1">{t('uvTechnologyButton')}</h3>
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                  {t('uvTechnologyButtonDesc')}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </section>

        {/* Brand Selection */}
        <section className="text-center mb-10 md:mb-16">
          <h2 className="text-label text-muted-foreground mb-6 md:mb-8">
            {t('selectBrand')}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center max-w-2xl mx-auto">
            <Button
              onClick={() => navigate('/brand/artisjet')}
              className="flex-1 h-20 md:h-24 text-lg md:text-xl font-medium rounded-lg bg-primary text-white hover:brightness-[0.92] transition-all"
            >
              ARTISJET
            </Button>

            <Button
              onClick={() => navigate('/brand/mbo')}
              variant="outline"
              className="flex-1 h-20 md:h-24 text-lg md:text-xl font-medium rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
            >
              MBO PRINTERS
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UvLedInfo;
