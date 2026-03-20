import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

export function Header() {
  const { t } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-subtle bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {!isHome && (
            <Link
              to="/"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              <Home className="h-4 w-4" />
            </Link>
          )}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-foreground">
              <span className="text-xs font-medium text-background">UV</span>
            </div>
            <span className="text-lg text-ultra-slim tracking-widest uppercase">
              {t('brand')}
            </span>
          </Link>
        </div>
        <LanguageSelector />
      </div>
    </header>
  );
}
