import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { printerModels } from '@/lib/printerData';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { SectionButton } from '@/components/SectionButton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { QuoteCalculator } from '@/components/QuoteCalculator';
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
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {model.brand}
              </p>
              <h1 className="mt-4 text-4xl text-ultra-slim tracking-tight md:text-5xl">
                {model.fullName}
              </h1>
              <p className="mt-4 text-muted-foreground">
                {t('printArea')}: {model.specs.printArea} · {t('maxHeight')}: {model.specs.maxHeight}
              </p>
            </section>

            {/* Image */}
            {model.image && (
              <section className="border border-border-subtle bg-muted/10 p-6">
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
            <h2 className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
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
                  className="group flex items-center gap-6 border border-border-subtle bg-card p-6 text-left transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border-subtle text-muted-foreground transition-colors group-hover:border-foreground/20 group-hover:text-foreground">
                    <Euro className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-lg text-slim">{t('recommendedPrice')}</span>
                  </div>
                  <span className="text-xs text-muted-foreground transition-transform duration-300 group-hover:translate-x-1">
                    {showPrice ? '−' : '+'}
                  </span>
                </button>
              )}

              {/* Price Display */}
              {showPrice && model.price && (
                <div className="border border-border-subtle bg-muted/30 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('recommendedPrice')}</span>
                    <div className="text-right">
                      <span className="text-2xl font-semibold text-foreground">{model.price}</span>
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
                className="group flex items-center gap-6 border border-border-subtle bg-card p-6 text-left transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border-subtle text-muted-foreground transition-colors group-hover:border-foreground/20 group-hover:text-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="text-lg text-slim">{t('contact')}</span>
                </div>
                <span className="text-xs text-muted-foreground transition-transform duration-300 group-hover:translate-x-1">
                  {showContact ? '−' : '+'}
                </span>
              </button>

              {/* Contact Display */}
              {showContact && (
                <div className="border border-border-subtle bg-muted/30 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    {contact.name && (
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{contact.name}</span>
                      </div>
                    )}
                    
                    <a 
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 text-sm hover:text-foreground transition-colors"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.email}</span>
                    </a>
                    
                    {contact.phones.map((phone, index) => (
                      <a 
                        key={index}
                        href={`tel:${phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-3 text-sm hover:text-foreground transition-colors"
                      >
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{phone}</span>
                      </a>
                    ))}
                    
                    <a 
                      href={`https://${contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm hover:text-foreground transition-colors"
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
                className="group flex items-center gap-6 border border-border-subtle bg-card p-6 text-left transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border-subtle text-muted-foreground transition-colors group-hover:border-foreground/20 group-hover:text-foreground">
                  <Calculator className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="text-lg text-slim">{t('quoteButton')}</span>
                </div>
                <span className="text-xs text-muted-foreground transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Quote Calculator Dialog */}
      <QuoteCalculator
        open={showQuoteCalculator}
        onOpenChange={setShowQuoteCalculator}
        initialModelId={model.id}
      />
    </div>
  );
};

export default ModelDetail;
