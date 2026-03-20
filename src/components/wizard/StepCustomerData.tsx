import { User, Mail, Phone, MessageCircle } from 'lucide-react';
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
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-3">
          <User className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold">{t('cd_title')}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t('cd_subtitle')}</p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="wizardName">
          {t('cd_name')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="wizardName"
          type="text"
          required
          value={state.customerName}
          onChange={(e) => updateState({ customerName: e.target.value })}
          placeholder={t('cd_namePlaceholder')}
        />
      </div>

      {/* Company */}
      <div className="space-y-2">
        <Label htmlFor="wizardCompany">{t('cd_company')}</Label>
        <Input
          id="wizardCompany"
          type="text"
          value={state.customerCompany}
          onChange={(e) => updateState({ customerCompany: e.target.value })}
          placeholder={t('cd_companyPlaceholder')}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="wizardEmail">
          {t('cd_email')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="wizardEmail"
          type="email"
          required
          value={state.customerEmail}
          onChange={(e) => updateState({ customerEmail: e.target.value })}
          placeholder={t('cd_emailPlaceholder')}
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="wizardPhone">
          {t('cd_phone')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="wizardPhone"
          type="tel"
          required
          value={state.customerPhone}
          onChange={(e) => updateState({ customerPhone: e.target.value })}
          placeholder={t('cd_phonePlaceholder')}
        />
      </div>

      {/* Country/Region */}
      <div className="space-y-2">
        <Label htmlFor="wizardCountry">{t('cd_country')}</Label>
        <Input
          id="wizardCountry"
          type="text"
          value={state.customerCountry}
          onChange={(e) => updateState({ customerCountry: e.target.value })}
          placeholder={t('cd_countryPlaceholder')}
        />
      </div>

      {/* How did you find us */}
      <div className="space-y-2">
        <Label>{t('cd_howFoundUs')}</Label>
        <Select
          value={state.howFoundUs || undefined}
          onValueChange={(value) =>
            updateState({ howFoundUs: value as typeof state.howFoundUs })
          }
        >
          <SelectTrigger>
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
        <Label>{t('cd_preferredContact')}</Label>
        <div className="grid grid-cols-3 gap-3">
          {CONTACT_OPTIONS.map(({ value, icon: Icon }) => {
            const isSelected = state.preferredContact === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateState({ preferredContact: value })}
                className={`
                  flex flex-col items-center gap-2 border rounded-lg p-4
                  transition-all duration-150 cursor-pointer
                  hover:border-foreground/50 hover:shadow-sm
                  ${
                    isSelected
                      ? 'border-foreground bg-muted'
                      : 'border-border-subtle'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
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
            className="mt-0.5"
          />
          <span className="text-sm">
            {t('cd_privacyPolicy')} <span className="text-destructive">*</span>
          </span>
        </label>

        {/* Newsletter */}
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={state.newsletterOptIn}
            onCheckedChange={(checked) =>
              updateState({ newsletterOptIn: checked === true })
            }
            className="mt-0.5"
          />
          <span className="text-sm">{t('cd_newsletter')}</span>
        </label>
      </div>
    </div>
  );
}
