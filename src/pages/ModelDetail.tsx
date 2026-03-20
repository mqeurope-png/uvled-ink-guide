import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { printerModels } from '@/lib/printerData';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { SectionButton } from '@/components/SectionButton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { QuoteWizard } from '@/components/QuoteWizard';
import {
  Cpu,
  Puzzle,
  ArrowLeft,
  Euro,
  Mail,
  Phone,
  Globe,
  User,
  Calculator
} from 'lucide-react';

interface ContactInfo {
  name?: string;
  email: string;
  phones: string[];
  website: string;
}

const getContactByLanguage = (language: Language): ContactInfo => {
  switch (language) {
    case 'es':
    case 'ca':
    case 'gl':
    case 'eu':
      return {
        name: 'Manel Pons',
        email: 'manel@bomedia.net',
        phones: ['+34 682 62 70 56', '+34 93 201 07 93'],
        website: 'www.boprint.net',
      };
    case 'fr':
      return {
        name: 'Brice Leroux',
        email: 'brice@artisjet-printers.eu',
        phones: ['+33 7 49 88 59 13', '+33 1 82 88 06 81'],
        website: 'artisjet-printers.eu',
      };
    case 'de':
      return {
        name: 'Scott Dörflein',
        email: 'scott@artisjet-printers.eu',
        phones: ['+49 211 54 69 038'],
        website: 'artisjet-printers.eu/de',
      };
    case 'en':
    case 'nl':
    default:
      return {
        email: 'bomedia@bomedia.net',
        phones: [],
        website: 'www.boprint.net',
      };
  }
};

const ModelDetail = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [showPrice, setShowPrice] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showQuoteCalculator, setShowQuoteCalculator] = useState(false);
  const model = printerModels.find((m) => m.id === modelId);
  const contact = getContactByLanguage(language);

  if (!model) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Modelo no encontrado</p>
      </div>
    );
  }

  const sections = [
    {
      to: `/model/${model.id}/specs`,
      icon: <Cpu className="h-5 w-5" />,
      title: t('technicalSpecs'),
    },
    {
      to: `/model/${model.id}/accessories`,
      icon: <Puzzle className="h-5 w-5" />,
      title: t('accessories'),
    },
  ];

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

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column - Image and Info */}
          <div>
            {/* Model Header */}
            <section className="mb-8">
              <p className="text-label text-muted-foreground">
                {model.brand}
              </p>
              <h1 className="mt-4 text-4xl text-display tracking-tight md:text-5xl">
                {model.fullName}
              </h1>
              <p className="mt-4 text-muted-foreground">
                {t('printArea')}: {model.specs.printArea} · {t('maxHeight')}: {model.specs.maxHeight}
              </p>
            </section>

            {/* Image */}
            {model.image && (
              <section className="rounded-lg bg-[#f9f7f4] p-6" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <AspectRatio ratio={4/3}>
                  <img
                    src={model.image}
                    alt={model.fullName}
                    className="h-full w-full object-contain"
                  />
                </AspectRatio>
              </section>
            )}
          </div>

          {/* Right Column - Sections Grid */}
          <section>
            <h2 className="text-label mb-6 text-muted-foreground">
              {t('selectSection')}
            </h2>
            <div className="grid gap-4">
              {sections.map((section) => (
                <SectionButton
                  key={section.to}
                  to={section.to}
                  icon={section.icon}
                  title={section.title}
                />
              ))}

              {/* Price Button */}
              {model.price && (
                <button
                  onClick={() => setShowPrice(!showPrice)}
                  className="group flex items-center gap-6 rounded-lg bg-card p-6 text-left transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                  style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.16)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent text-primary transition-colors">
                    <Euro className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-lg font-medium">{t('recommendedPrice')}</span>
                  </div>
                  <span className="text-xs text-muted-foreground transition-transform duration-300 group-hover:translate-x-1">
                    {showPrice ? '−' : '+'}
                  </span>
                </button>
              )}

              {/* Price Display */}
              {showPrice && model.price && (
                <div className="surface-alt rounded-lg p-6 animate-in fade-in slide-in-from-top-2 duration-300" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('recommendedPrice')}</span>
                    <div className="text-right">
                      <span className="text-price text-2xl">{model.price}</span>
                      <span className="ml-2 text-sm text-muted-foreground">{t('plusTax')}</span>
                      {model.priceWithVat && (
                        <p className="text-sm text-muted-foreground">
                          ({model.priceWithVat} {t('taxIncluded')})
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Button */}
              <button
                onClick={() => setShowContact(!showContact)}
                className="group flex items-center gap-6 rounded-lg bg-card p-6 text-left transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.16)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="text-lg font-medium">{t('contact')}</span>
                </div>
                <span className="text-xs text-muted-foreground transition-transform duration-300 group-hover:translate-x-1">
                  {showContact ? '−' : '+'}
                </span>
              </button>

              {/* Contact Display */}
              {showContact && (
                <div className="surface-alt rounded-lg p-6 animate-in fade-in slide-in-from-top-2 duration-300" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                  <div className="space-y-3">
                    {contact.name && (
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{contact.name}</span>
                      </div>
                    )}

                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.email}</span>
                    </a>

                    {contact.phones.map((phone, index) => (
                      <a
                        key={index}
                        href={`tel:${phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{phone}</span>
                      </a>
                    ))}

                    <a
                      href={`https://${contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                    >
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.website}</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Quote Button */}
              <button
                onClick={() => setShowQuoteCalculator(true)}
                className="group flex items-center gap-6 rounded-lg bg-primary text-white p-6 text-left transition-all duration-300 hover:brightness-[0.92] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/20 transition-colors">
                  <Calculator className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="text-lg font-medium">{t('quoteButton')}</span>
                </div>
                <span className="text-xs opacity-70 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Quote Calculator Dialog */}
      <QuoteWizard
        open={showQuoteCalculator}
        onOpenChange={setShowQuoteCalculator}
        initialModelId={model.id}
      />
    </div>
  );
};

export default ModelDetail;
