// ── Lead types ──

export type LeadStatus = 'new' | 'contacted' | 'demo_scheduled' | 'closed';

export interface Lead {
  id: string;
  date: string; // ISO date
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry: string;
  productsSelected: string[]; // product IDs
  productNames: string[]; // for display
  investmentRange: string;
  businessProfile: string;
  productionType: string;
  priorities: string[];
  notes: string;
  status: LeadStatus;
  preferredContact: string;
  howFoundUs: string;
  totalEstimate: number;
  createdAt: string; // ISO timestamp
  updatedAt: string;
}

// ── Product types ──

export type ProductCategory = 'uv_led_printer' | 'textile_printer' | 'laser_cutter' | 'packaging' | 'cards' | 'gran_formato' | 'vending';

export interface ProductSpec {
  key: string;
  value: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  model: string;
  category: ProductCategory;
  shortDescription: string; // max 160 chars
  longDescription: string;
  priceRange: string;
  showPrice: boolean;
  images: string[]; // URLs or base64
  videoUrl: string;
  featureTags: string[];
  specs: ProductSpec[];
  costPerPrint: number | null;
  roiSalePrice: number;
  roiCost: number;
  roiMinUnitsPerDay: number;
  compatibleMaterials: string[];
  visibleInWizard: boolean;
  featured: boolean;
  active: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ── Consumable types ──

export type ConsumableType = 'printhead' | 'damper' | 'capping' | 'wiper' | 'cleanStation' | 'tubes' | 'ink' | 'accessory';

export interface AdminConsumable {
  id: string;
  name: string;
  type: ConsumableType;
  description: string;
  url: string;
  image: string;
  price: string;
  lifespan: string;
  compatibleModelIds: string[]; // product IDs this consumable works with
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const CONSUMABLE_TYPES: { value: ConsumableType; label: string }[] = [
  { value: 'printhead', label: 'Printhead' },
  { value: 'damper', label: 'Damper' },
  { value: 'capping', label: 'Capping Station' },
  { value: 'wiper', label: 'Wiper Blade' },
  { value: 'cleanStation', label: 'Clean Station' },
  { value: 'tubes', label: 'Tubes' },
  { value: 'ink', label: 'Ink' },
  { value: 'accessory', label: 'Accessory' },
];

// ── Recommendation Rule types ──

export type RuleOperator = 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in';

export interface RuleCondition {
  field: string;
  operator: RuleOperator;
  value: string;
}

export interface RecommendationRule {
  id: string;
  name: string;
  conditions: RuleCondition[];
  recommendedProductIds: string[];
  priority: number; // higher = more important
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Global Settings types ──

export interface GlobalSettings {
  logoUrl: string;
  brandPrimaryColor: string;
  brandSecondaryColor: string;
  brandAccentColor: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsApp: string;
  legalPrivacyText: string;
  legalTermsText: string;
  notificationEmails: string[];
  customerEmailTemplate: string;
  pdfShowLogo: boolean;
  pdfHeaderColor: string;
  pdfFooterText: string;
  currency: string;
  priceFormat: 'eu' | 'us' | 'uk';
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

// ── Admin Auth ──

export const ADMIN_PASSWORD = 'bomedia2025';

// ── Rule field options ──

export const RULE_FIELDS = [
  { value: 'category', label: 'Product Category' },
  { value: 'businessProfile', label: 'Business Profile' },
  { value: 'productionType', label: 'Production Type' },
  { value: 'uvMaxSize', label: 'UV Max Size' },
  { value: 'uvSurfaceType', label: 'Surface Type' },
  { value: 'uvMaterials', label: 'Materials' },
  { value: 'investmentRange', label: 'Investment Range' },
  { value: 'uvProductionVolume', label: 'Production Volume' },
  { value: 'priorities', label: 'Priorities' },
  { value: 'experienceLevel', label: 'Experience Level' },
] as const;

export const RULE_OPERATORS: { value: RuleOperator; label: string }[] = [
  { value: 'equals', label: '=' },
  { value: 'not_equals', label: '≠' },
  { value: 'contains', label: 'contains' },
  { value: 'greater_than', label: '>' },
  { value: 'less_than', label: '<' },
  { value: 'in', label: 'in list' },
];

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'uv_led_printer', label: 'UV LED Printer' },
  { value: 'gran_formato', label: 'Gran Formato' },
  { value: 'textile_printer', label: 'Textile Printer' },
  { value: 'laser_cutter', label: 'Laser Cutter' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'cards', label: 'Cards' },
  { value: 'vending', label: 'Vending' },
];

export const LEAD_STATUSES: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: '#e8522a' },
  { value: 'contacted', label: 'Contacted', color: '#2563eb' },
  { value: 'demo_scheduled', label: 'Demo Scheduled', color: '#7c3aed' },
  { value: 'closed', label: 'Closed', color: '#16a34a' },
];

export const DEFAULT_SETTINGS: GlobalSettings = {
  logoUrl: '',
  brandPrimaryColor: '#e8522a',
  brandSecondaryColor: '#1a3a5c',
  brandAccentColor: '#fdf0eb',
  contactPhone: '+34 682 62 70 56',
  contactEmail: 'manel@bomedia.net',
  contactWhatsApp: '+34 682 62 70 56',
  legalPrivacyText: 'We process your data to manage your quote request. You can exercise your rights of access, rectification, deletion, and opposition.',
  legalTermsText: 'Prices are indicative and may vary. Quote validity: 30 days.',
  notificationEmails: ['manel@bomedia.net'],
  customerEmailTemplate: 'Thank you for your interest in BOMEDIA products. We will review your request and get back to you within 24-48 hours.',
  pdfShowLogo: true,
  pdfHeaderColor: '#e8522a',
  pdfFooterText: 'BOMEDIA - www.boprint.net - manel@bomedia.net - +34 682 62 70 56',
  currency: 'EUR',
  priceFormat: 'eu',
  maintenanceMode: false,
  maintenanceMessage: 'We are performing maintenance. Please try again later.',
};
