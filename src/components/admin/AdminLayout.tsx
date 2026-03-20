import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Package,
  Wrench,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { LeadsDashboard } from './LeadsDashboard';
import { ProductCatalog } from './ProductCatalog';
import { RecommendationRules } from './RecommendationRules';
import { GlobalSettings } from './GlobalSettings';
import { AccessoriesCatalog } from './AccessoriesCatalog';

type AdminSection = 'leads' | 'products' | 'accessories' | 'rules' | 'settings';

interface AdminLayoutProps {
  onLogout: () => void;
}

const NAV_ITEMS: { id: AdminSection; label: string; icon: typeof Users }[] = [
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'accessories', label: 'Accessories', icon: Wrench },
  { id: 'rules', label: 'Rules', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ onLogout }: AdminLayoutProps) {
  const [section, setSection] = useState<AdminSection>('leads');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderSection = () => {
    switch (section) {
      case 'leads': return <LeadsDashboard />;
      case 'products': return <ProductCatalog />;
      case 'accessories': return <AccessoriesCatalog />;
      case 'rules': return <RecommendationRules />;
      case 'settings': return <GlobalSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card fixed inset-y-0 left-0 z-30" style={{ borderRight: '1px solid rgba(0,0,0,0.08)' }}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary mr-3">
            <span className="text-xs font-semibold text-white">UV</span>
          </div>
          <div>
            <p className="text-sm font-semibold">BOMEDIA</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const isActive = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-card h-14 flex items-center justify-between px-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-[10px] font-semibold text-white">UV</span>
          </div>
          <span className="text-sm font-semibold">Admin</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="w-64 h-full bg-card"
            onClick={e => e.stopPropagation()}
          >
            <div className="pt-16 p-3 space-y-1">
              {NAV_ITEMS.map(item => {
                const isActive = section === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setSection(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
              <div className="pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-[1200px]">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
