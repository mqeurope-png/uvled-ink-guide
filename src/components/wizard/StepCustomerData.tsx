import { User, Mail, Phone, MessageCircle, Check, Download, Send, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { WizardState, HOW_FOUND_US_OPTIONS, ContactMethod } from '@/lib/wizardTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StepProps {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  t: (key: string) => string;
  onExportPDF?: () => void;
  onSendEmail?: () => void;
  onRequestDemo?: () => void;
}

const CONTACT_OPTIONS: { value: ContactMethod; icon: typeof Mail }[] = [
  { value: 'email', icon: Mail },
  { value: 'phone', icon: Phone },
  { value: 'whatsapp', icon: MessageCircle },
];

export function StepCustomerData({ state, updateState, t, onExportPDF, onSendEmail, onRequestDemo }: StepProps) {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">PASO 07</p>
        <div className="h-14 w-14 rounded-full bg-accent text-primary flex items-center justify-center mb-3">
          <User className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-medium">{t('cd_title')}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t('cd_subtitle')}</p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="wizardName" className="text-sm font-medium">
          {t('cd_name')} <span className="text-primary">*</span>
        </Label>
        <Input
          id="wizardName"
          type="text"
          required
          value={state.customerName}
          onChange={(e) => updateState({ customerName: e.target.value })}
          placeholder={t('cd_namePlaceholder')}
          className="rounded-lg focus-visible:ring-primary focus-visible:border-primary"
        />
      </div>

      {/* Company */}
      <div className="space-y-2">
        <Label htmlFor="wizardCompany" className="text-sm font-medium">
          {t('cd_company')}
        </Label>
        <Input
          id="wizardCompany"
          type="text"
          value={state.customerCompany}
          onChange={(e) => updateState({ customerCompany: e.target.value })}
          placeholder={t('cd_companyPlaceholder')}
          className="rounded-lg focus-visible:ring-primary focus-visible:border-primary"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="wizardEmail" className="text-sm font-medium">
          {t('cd_email')} <span className="text-primary">*</span>
        </Label>
        <Input
          id="wizardEmail"
          type="email"
          required
          value={state.customerEmail}
          onChange={(e) => updateState({ customerEmail: e.target.value })}
          placeholder={t('cd_emailPlaceholder')}
          className="rounded-lg focus-visible:ring-primary focus-visible:border-primary"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="wizardPhone" className="text-sm font-medium">
          {t('cd_phone')} <span className="text-primary">*</span>
        </Label>
        <Input
          id="wizardPhone"
          type="tel"
          required
          value={state.customerPhone}
          onChange={(e) => updateState({ customerPhone: e.target.value })}
          placeholder={t('cd_phonePlaceholder')}
          className="rounded-lg focus-visible:ring-primary focus-visible:border-primary"
        />
      </div>

      {/* Country/Region */}
      <div className="space-y-2">
        <Label htmlFor="wizardCountry" className="text-sm font-medium">
          {t('cd_country')}
        </Label>
        <Input
          id="wizardCountry"
          type="text"
          value={state.customerCountry}
          onChange={(e) => updateState({ customerCountry: e.target.value })}
          placeholder={t('cd_countryPlaceholder')}
          className="rounded-lg focus-visible:ring-primary focus-visible:border-primary"
        />
      </div>

      {/* How did you find us */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t('cd_howFoundUs')}</Label>
        <Select
          value={state.howFoundUs || undefined}
          onValueChange={(value) =>
            updateState({ howFoundUs: value as typeof state.howFoundUs })
          }
        >
          <SelectTrigger
            className="rounded-lg"
            style={{ borderColor: 'rgba(0,0,0,0.08)' }}
          >
            <SelectValue placeholder={t('cd_howFoundUs')} />
          </SelectTrigger>
          <SelectContent>
            {HOW_FOUND_US_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`cd_source_${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Preferred Contact Method */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t('cd_preferredContact')}</Label>
        <div className="grid grid-cols-3 gap-3">
          {CONTACT_OPTIONS.map(({ value, icon: Icon }) => {
            const isSelected = state.preferredContact === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateState({ preferredContact: value })}
                className={`
                  relative flex flex-col items-center gap-2 rounded-lg p-4
                  transition-shadow transition-colors duration-150 cursor-pointer
                  ${
                    isSelected
                      ? 'border-2 border-primary bg-[#fdf0eb]'
                      : 'border hover:border-[rgba(0,0,0,0.16)] hover:shadow-md'
                  }
                `}
                style={!isSelected ? { borderColor: 'rgba(0,0,0,0.08)' } : undefined}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : ''}`} />
                <span className="text-sm font-medium">
                  {t(`cd_contact${value.charAt(0).toUpperCase() + value.slice(1)}`)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="space-y-4 pt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={state.privacyAccepted}
            onCheckedChange={(checked) =>
              updateState({ privacyAccepted: checked === true })
            }
            className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-sm">
            {t('cd_privacyPolicy')} <span className="text-primary">*</span>
          </span>
        </label>

        {/* Newsletter */}
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={state.newsletterOptIn}
            onCheckedChange={(checked) =>
              updateState({ newsletterOptIn: checked === true })
            }
            className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-sm">{t('cd_newsletter')}</span>
        </label>
      </div>

      {/* Action buttons - shown when required fields are filled */}
      {state.customerName.trim() && state.customerEmail.trim() && state.privacyAccepted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-6"
          style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
        >
          <p className="text-sm font-medium mb-3">{t('cd_actions') || 'Acciones disponibles'}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-primary text-primary font-medium text-sm btn-secondary-3d"
              >
                <Download className="h-4 w-4" />
                {t('sum_downloadPDF')}
              </button>
            )}
            {onSendEmail && (
              <button
                onClick={onSendEmail}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-white font-medium text-sm btn-primary-3d"
              >
                <Send className="h-4 w-4" />
                {t('sum_sendToBoprint')}
              </button>
            )}
            {onRequestDemo && (
              <button
                onClick={onRequestDemo}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-primary text-primary font-medium text-sm btn-secondary-3d"
              >
                <Video className="h-4 w-4" />
                {t('sum_requestDemo')}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
