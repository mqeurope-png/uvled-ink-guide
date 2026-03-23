// ==================== WIZARD TYPES ====================

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const WIZARD_STEPS = [1, 2, 3, 4, 5, 6, 7] as const;

// Step 1: Business Profile
export const BUSINESS_PROFILES = [
  'personalization',
  'signage',
  'designStudio',
  'ecommerce',
  'industry',
  'hospitality',
  'personal',
  'other',
] as const;
export type BusinessProfile = typeof BUSINESS_PROFILES[number];

// Step 2: Production Type
export const PRODUCTION_TYPES = [
  'uvPrinting',
  'textileDtgDtf',
  'packaging',
  'laserCutting',
  'pvcCards',
] as const;
export type ProductionType = typeof PRODUCTION_TYPES[number];

// Step 3: Technical Config
export const UV_MAX_SIZES = ['a4', 'a3', '60x90', '100x160'] as const;
export type UvMaxSize = typeof UV_MAX_SIZES[number];

export const UV_SURFACE_TYPES = ['flat', 'cylindrical', 'irregular'] as const;
export type UvSurfaceType = typeof UV_SURFACE_TYPES[number];

export const UV_MATERIALS = ['plastic', 'wood', 'metal', 'glass', 'ceramic', 'leather', 'other'] as const;
export type UvMaterial = typeof UV_MATERIALS[number];

export const UV_SPECIAL_EFFECTS = ['3dRelief', 'varnish', 'braille', 'none'] as const;
export type UvSpecialEffect = typeof UV_SPECIAL_EFFECTS[number];

export const TEXTILE_METHODS = ['dtg', 'dtf'] as const;
export type TextileMethod = typeof TEXTILE_METHODS[number];

export const TEXTILE_PRINT_SIZES = ['a4', 'a3', '40x60'] as const;
export type TextilePrintSize = typeof TEXTILE_PRINT_SIZES[number];

export const TEXTILE_GARMENT_COLORS = ['light', 'dark', 'both'] as const;
export type TextileGarmentColor = typeof TEXTILE_GARMENT_COLORS[number];

export const LASER_WORK_TYPES = ['cutting', 'engraving', 'both'] as const;
export type LaserWorkType = typeof LASER_WORK_TYPES[number];

export const LASER_MATERIALS = ['wood', 'acrylic', 'leather', 'fabric', 'paper', 'metal'] as const;
export type LaserMaterialType = typeof LASER_MATERIALS[number];

export const LASER_SIZES = ['small', 'medium', 'large'] as const;
export type LaserSize = typeof LASER_SIZES[number];

export const PACKAGING_CONTAINER_TYPES = ['box', 'bottle', 'bag', 'tube', 'custom'] as const;
export type PackagingContainerType = typeof PACKAGING_CONTAINER_TYPES[number];

export const PACKAGING_MATERIALS = ['cardboard', 'plastic', 'glass', 'metal', 'wood'] as const;
export type PackagingMaterial = typeof PACKAGING_MATERIALS[number];

export const CARD_MATERIALS = ['pvc', 'petg', 'polycarbonate', 'composite'] as const;
export type CardMaterial = typeof CARD_MATERIALS[number];

export const CARD_FORMATS = ['cr80', 'cr79', 'custom'] as const;
export type CardFormat = typeof CARD_FORMATS[number];

// Step 4: Expectations
export const DECISION_TIMELINES = ['immediate', 'oneMonth', 'threeMonths', 'sixMonths', 'justExploring'] as const;
export type DecisionTimeline = typeof DECISION_TIMELINES[number];

export const EXPERIENCE_LEVELS = ['none', 'beginner', 'intermediate', 'expert'] as const;
export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number];

export const INVESTMENT_RANGES = ['under5k', '5to15k', '15to40k', 'over40k', 'financing'] as const;
export type InvestmentRange = typeof INVESTMENT_RANGES[number];

export const PRIORITIES = ['price', 'quality', 'speed', 'easeOfUse', 'support', 'versatility'] as const;
export type Priority = typeof PRIORITIES[number];

// Step 7: Customer Data
export const CONTACT_METHODS = ['email', 'phone', 'whatsapp'] as const;
export type ContactMethod = typeof CONTACT_METHODS[number];

export const HOW_FOUND_US_OPTIONS = ['google', 'socialMedia', 'referral', 'tradeShow', 'advertisement', 'other'] as const;
export type HowFoundUs = typeof HOW_FOUND_US_OPTIONS[number];

// ==================== WIZARD STATE ====================

export interface WizardState {
  // Step 1
  businessProfile: BusinessProfile[];

  // Step 2
  productionType: ProductionType[];

  // Step 3 - UV
  uvMaxSize: UvMaxSize[];
  uvSurfaceType: UvSurfaceType[];
  uvMaterials: UvMaterial[];
  uvSpecialEffects: UvSpecialEffect[];
  uvProductionVolume: number; // units per day

  // Step 3 - Textile
  textileMethod: TextileMethod | '';
  textilePrintSize: TextilePrintSize | '';
  textileGarmentColors: TextileGarmentColor | '';
  textileVolume: number;

  // Step 3 - Laser
  laserWorkType: LaserWorkType | '';
  laserMaterial: LaserMaterialType | '';
  laserSize: LaserSize | '';

  // Step 3 - Packaging
  packagingContainerType: PackagingContainerType[];
  packagingMaterial: PackagingMaterial | '';
  packagingDimensions: string;
  packagingMinBatch: number;

  // Step 3 - Cards
  cardMaterial: CardMaterial | '';
  cardFormat: CardFormat | '';
  cardVolume: number;

  // Step 4
  decisionTimeline: DecisionTimeline | '';
  experienceLevel: ExperienceLevel | '';
  investmentRange: InvestmentRange | '';
  priorities: Priority[];

  // Step 5
  selectedProducts: string[];
  selectedAccessories: { modelId: string; accessoryId: string; name: string; price?: string }[];

  // Step 6
  notes: string;

  // Step 7
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry: string;
  howFoundUs: HowFoundUs | '';
  preferredContact: ContactMethod | '';
  privacyAccepted: boolean;
  newsletterOptIn: boolean;
}

export const initialWizardState: WizardState = {
  businessProfile: [],
  productionType: [],
  uvMaxSize: [],
  uvSurfaceType: [],
  uvMaterials: [],
  uvSpecialEffects: [],
  uvProductionVolume: 10,
  textileMethod: '',
  textilePrintSize: '',
  textileGarmentColors: '',
  textileVolume: 10,
  laserWorkType: '',
  laserMaterial: '',
  laserSize: '',
  packagingContainerType: [],
  packagingMaterial: '',
  packagingDimensions: '',
  packagingMinBatch: 100,
  cardMaterial: '',
  cardFormat: '',
  cardVolume: 100,
  decisionTimeline: '',
  experienceLevel: '',
  investmentRange: '',
  priorities: [],
  selectedProducts: [],
  selectedAccessories: [],
  notes: '',
  customerName: '',
  customerCompany: '',
  customerEmail: '',
  customerPhone: '',
  customerCountry: '',
  howFoundUs: '',
  preferredContact: '',
  privacyAccepted: false,
  newsletterOptIn: false,
};

// ==================== STEP VALIDATION ====================

export function isStepValid(step: WizardStep, state: WizardState): boolean {
  switch (step) {
    case 1: return state.businessProfile.length > 0;
    case 2: return state.productionType.length > 0;
    case 3: return isStep3Valid(state);
    case 4: return state.decisionTimeline !== '' && state.investmentRange !== '' && state.priorities.length > 0;
    case 5: return state.selectedProducts.length > 0;
    case 6: return true; // summary is always valid
    case 7: return (
      state.customerName.trim().length > 0 &&
      state.customerEmail.trim().length > 0 &&
      state.customerPhone.trim().length > 0 &&
      state.privacyAccepted
    );
    default: return false;
  }
}

function isStep3Valid(state: WizardState): boolean {
  // Valid if any selected production type has valid config
  for (const pt of state.productionType) {
    switch (pt) {
      case 'uvPrinting':
        if (state.uvMaxSize.length > 0 && state.uvSurfaceType.length > 0 && state.uvMaterials.length > 0) return true;
        break;
      case 'textileDtgDtf':
        if (state.textileMethod !== '' && state.textilePrintSize !== '') return true;
        break;
      case 'laserCutting':
        if (state.laserWorkType !== '' && state.laserMaterial !== '') return true;
        break;
      case 'packaging':
        if (state.packagingContainerType.length > 0 && state.packagingMaterial !== '') return true;
        break;
      case 'pvcCards':
        if (state.cardMaterial !== '' && state.cardFormat !== '') return true;
        break;
    }
  }
  return false;
}
