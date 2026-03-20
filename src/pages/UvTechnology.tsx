import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Droplets, Shield, Sparkles } from 'lucide-react';

const UvTechnology = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      titleKey: 'uvFeature1Title',
      descKey: 'uvFeature1DetailDesc',
      benefits: ['uvFeature1Benefit1', 'uvFeature1Benefit2', 'uvFeature1Benefit3', 'uvFeature1Benefit4'],
    },
    {
      icon: Droplets,
      titleKey: 'uvFeature2Title',
      descKey: 'uvFeature2DetailDesc',
      benefits: ['uvFeature2Benefit1', 'uvFeature2Benefit2', 'uvFeature2Benefit3', 'uvFeature2Benefit4'],
    },
    {
      icon: Shield,
      titleKey: 'uvFeature3Title',
      descKey: 'uvFeature3DetailDesc',
      benefits: ['uvFeature3Benefit1', 'uvFeature3Benefit2', 'uvFeature3Benefit3', 'uvFeature3Benefit4'],
    },
    {
      icon: Sparkles,
      titleKey: 'uvFeature4Title',
      descKey: 'uvFeature4DetailDesc',
      benefits: ['uvFeature4Benefit1', 'uvFeature4Benefit2', 'uvFeature4Benefit3', 'uvFeature4Benefit4'],
    },
  ];

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
        <section className="mb-16 text-center">
          <h1 className="text-4xl text-ultra-slim tracking-tight md:text-5xl mb-6">
            {t('uvLedTechnology')}
          </h1>
          <p className="mx-auto max-w-3xl text-muted-foreground text-lg">
            {t('uvLedDescription')}
          </p>
        </section>

        {/* Features */}
        <div className="space-y-16">
          {features.map((feature, index) => (
            <section key={index} className="border-t border-border-subtle pt-12">
              <div className="flex items-start gap-6 mb-8">
                <feature.icon className="h-12 w-12 shrink-0 stroke-[0.5]" />
                <div>
                  <h2 className="text-2xl text-slim mb-4">{t(feature.titleKey)}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                </div>
              </div>
              
              <div className="ml-0 md:ml-18">
                <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
                  {t('benefits')}
                </h3>
                <ul className="space-y-3">
                  {feature.benefits.map((benefitKey, bIndex) => (
                    <li key={bIndex} className="flex items-start gap-3">
                      <span className="text-foreground/30 text-sm font-light">0{bIndex + 1}</span>
                      <span className="text-foreground">{t(benefitKey)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button
            onClick={() => navigate('/uv-led-info')}
            variant="outline"
            size="lg"
            className="border-foreground hover:bg-foreground hover:text-background transition-all"
          >
            {t('viewPrinters')}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default UvTechnology;