import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Palette,
  Phone,
  Scale,
  Bell,
  FileText,
  DollarSign,
  AlertTriangle,
  Save,
  Check,
  Plus,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { GlobalSettings as GlobalSettingsType } from '@/lib/adminTypes';
import { getSettings, saveSettings } from '@/lib/adminStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

// ── Collapsible Section ──

function Section({
  title,
  icon: Icon,
  defaultOpen = false,
  warning = false,
  children,
}: {
  title: string;
  icon: typeof Palette;
  defaultOpen?: boolean;
  warning?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="bg-card rounded-lg overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.08)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-5 py-4 text-left text-sm font-semibold transition-colors ${
          warning ? 'bg-[#fdf0eb] text-[#e8522a]' : 'hover:bg-muted/50'
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1">{title}</span>
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 space-y-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Color Picker Field ──

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="h-9 w-9 rounded-md border border-input cursor-pointer shrink-0"
          style={{ padding: 2 }}
        />
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="#000000"
          className="font-mono text-xs"
        />
        <div
          className="h-9 w-14 rounded-md shrink-0"
          style={{ backgroundColor: value, border: '1px solid rgba(0,0,0,0.1)' }}
        />
      </div>
    </div>
  );
}

// ── Main Component ──

export function GlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettingsType>(getSettings());
  const [saved, setSaved] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const update = <K extends keyof GlobalSettingsType>(key: K, value: GlobalSettingsType[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addNotificationEmail = () => {
    const email = newEmail.trim();
    if (email && !settings.notificationEmails.includes(email)) {
      update('notificationEmails', [...settings.notificationEmails, email]);
      setNewEmail('');
    }
  };

  const removeNotificationEmail = (email: string) => {
    update(
      'notificationEmails',
      settings.notificationEmails.filter(e => e !== email),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Global Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure branding, contact info, legal texts, and system behaviour.
        </p>
      </div>

      {/* ── 1. Branding ── */}
      <Section title="Branding" icon={Palette} defaultOpen>
        <div className="space-y-1.5">
          <Label className="text-xs">Logo URL</Label>
          <Input
            value={settings.logoUrl}
            onChange={e => update('logoUrl', e.target.value)}
            placeholder="https://example.com/logo.png"
          />
          {settings.logoUrl && (
            <div className="mt-2 flex items-center gap-3">
              <div
                className="h-16 w-32 rounded-md bg-muted flex items-center justify-center overflow-hidden"
                style={{ border: '1px solid rgba(0,0,0,0.08)' }}
              >
                <img
                  src={settings.logoUrl}
                  alt="Logo preview"
                  className="max-h-full max-w-full object-contain"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ImageIcon className="h-3 w-3" /> Preview
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ColorField
            label="Primary Color"
            value={settings.brandPrimaryColor}
            onChange={v => update('brandPrimaryColor', v)}
          />
          <ColorField
            label="Secondary Color"
            value={settings.brandSecondaryColor}
            onChange={v => update('brandSecondaryColor', v)}
          />
          <ColorField
            label="Accent Color"
            value={settings.brandAccentColor}
            onChange={v => update('brandAccentColor', v)}
          />
        </div>
      </Section>

      {/* ── 2. Contact Info ── */}
      <Section title="Contact Info" icon={Phone}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Phone</Label>
            <Input
              value={settings.contactPhone}
              onChange={e => update('contactPhone', e.target.value)}
              placeholder="+34 600 000 000"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Email</Label>
            <Input
              type="email"
              value={settings.contactEmail}
              onChange={e => update('contactEmail', e.target.value)}
              placeholder="info@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">WhatsApp</Label>
            <Input
              value={settings.contactWhatsApp}
              onChange={e => update('contactWhatsApp', e.target.value)}
              placeholder="+34 600 000 000"
            />
          </div>
        </div>
      </Section>

      {/* ── 3. Legal Texts ── */}
      <Section title="Legal Texts" icon={Scale}>
        <div className="space-y-1.5">
          <Label className="text-xs">Privacy Policy</Label>
          <Textarea
            value={settings.legalPrivacyText}
            onChange={e => update('legalPrivacyText', e.target.value)}
            rows={4}
            placeholder="Privacy policy text..."
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Terms &amp; Conditions</Label>
          <Textarea
            value={settings.legalTermsText}
            onChange={e => update('legalTermsText', e.target.value)}
            rows={4}
            placeholder="Terms and conditions text..."
          />
        </div>
      </Section>

      {/* ── 4. Notifications ── */}
      <Section title="Notifications" icon={Bell}>
        <div className="space-y-1.5">
          <Label className="text-xs">Notification Emails</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {settings.notificationEmails.map(email => (
              <span
                key={email}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#fdf0eb] text-[#e8522a]"
                style={{ border: '1px solid rgba(232,82,42,0.2)' }}
              >
                {email}
                <button
                  onClick={() => removeNotificationEmail(email)}
                  className="hover:bg-[#e8522a]/10 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="Add email address..."
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addNotificationEmail();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addNotificationEmail}
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Customer Email Template</Label>
          <Textarea
            value={settings.customerEmailTemplate}
            onChange={e => update('customerEmailTemplate', e.target.value)}
            rows={4}
            placeholder="Template for the confirmation email sent to customers..."
          />
        </div>
      </Section>

      {/* ── 5. PDF Settings ── */}
      <Section title="PDF Settings" icon={FileText}>
        <div className="flex items-center gap-3">
          <Checkbox
            id="pdfShowLogo"
            checked={settings.pdfShowLogo}
            onCheckedChange={(checked: boolean) => update('pdfShowLogo', !!checked)}
          />
          <Label htmlFor="pdfShowLogo" className="text-sm cursor-pointer">
            Show logo in PDF header
          </Label>
        </div>

        <ColorField
          label="Header Color"
          value={settings.pdfHeaderColor}
          onChange={v => update('pdfHeaderColor', v)}
        />

        <div className="space-y-1.5">
          <Label className="text-xs">Footer Text</Label>
          <Input
            value={settings.pdfFooterText}
            onChange={e => update('pdfFooterText', e.target.value)}
            placeholder="Company info shown in PDF footer"
          />
        </div>
      </Section>

      {/* ── 6. Currency & Pricing ── */}
      <Section title="Currency & Pricing" icon={DollarSign}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Currency</Label>
            <select
              value={settings.currency}
              onChange={e => update('currency', e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="EUR">EUR - Euro</option>
              <option value="USD">USD - US Dollar</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Price Format</Label>
            <select
              value={settings.priceFormat}
              onChange={e => update('priceFormat', e.target.value as GlobalSettingsType['priceFormat'])}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="eu">EU: 1.234,56</option>
              <option value="us">US: 1,234.56</option>
              <option value="uk">UK: 1,234.56</option>
            </select>
          </div>
        </div>
      </Section>

      {/* ── 7. Maintenance Mode ── */}
      <Section
        title="Maintenance Mode"
        icon={AlertTriangle}
        warning={settings.maintenanceMode}
      >
        <div className="flex items-center gap-3">
          <Checkbox
            id="maintenanceMode"
            checked={settings.maintenanceMode}
            onCheckedChange={(checked: boolean) => update('maintenanceMode', !!checked)}
          />
          <Label htmlFor="maintenanceMode" className="text-sm cursor-pointer">
            Enable maintenance mode
          </Label>
        </div>

        {settings.maintenanceMode && (
          <div
            className="rounded-lg px-4 py-3 text-sm bg-[#fdf0eb] text-[#e8522a] flex items-start gap-2"
            style={{ border: '1px solid rgba(232,82,42,0.2)' }}
          >
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              Maintenance mode is <strong>active</strong>. The public site will display the
              maintenance message instead of the normal content.
            </span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs">Maintenance Message</Label>
          <Textarea
            value={settings.maintenanceMessage}
            onChange={e => update('maintenanceMessage', e.target.value)}
            rows={3}
            placeholder="Message shown to visitors during maintenance..."
          />
        </div>
      </Section>

      {/* ── Save Button ── */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={handleSave}
          className="bg-[#e8522a] hover:bg-[#d14824] text-white"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4 mr-2" /> Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Save Settings
            </>
          )}
        </Button>

        {saved && (
          <span className="text-sm text-green-600 font-medium animate-in fade-in">
            Settings saved successfully.
          </span>
        )}
      </div>
    </div>
  );
}
