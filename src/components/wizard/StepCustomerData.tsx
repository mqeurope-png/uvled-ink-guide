import { User, Mail, Phone, MessageCircle, Check } from 'lucide-react';
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
}

const CONTACT_OPTIONS: { value: ContactMethod; icon: typeof Mail }[] = [
  { value: 'email', icon: Mail },
  { value: 'phone', icon: Phone },
  { value: 'whatsapp', icon: MessageCircle },
];

export function StepCustomerData({ state, updateState, t }: StepProps) {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
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
              <motion.button
                key={value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateState({ preferredContact: value })}
                className={`
                  relative flex flex-col items-center gap-2 rounded-lg p-4
                  transition-all duration-150 cursor-pointer
                  ${
                    isSelected
                      ? 'border-2 border-primary bg-[#fdf0eb]'
                      : 'border hover:border-[rgba(0,0,0,0.16)]'
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
              </motion.button>
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
    </div>
  );
}
