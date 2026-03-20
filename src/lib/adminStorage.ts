import { Lead, LeadStatus, AdminProduct, RecommendationRule, GlobalSettings, DEFAULT_SETTINGS } from './adminTypes';
import { printerModels } from './printerData';

const KEYS = {
  leads: 'bomedia_admin_leads',
  products: 'bomedia_admin_products',
  rules: 'bomedia_admin_rules',
  settings: 'bomedia_admin_settings',
  auth: 'bomedia_admin_auth',
  featureTags: 'bomedia_admin_tags',
};

// ── Auth ──

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(KEYS.auth) === 'true';
}

export function setAdminAuthenticated(value: boolean): void {
  if (value) {
    sessionStorage.setItem(KEYS.auth, 'true');
  } else {
    sessionStorage.removeItem(KEYS.auth);
  }
}

// ── Generic helpers ──

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── Leads ──

export function getLeads(): Lead[] {
  return load<Lead[]>(KEYS.leads, []);
}

export function addLead(lead: Omit<Lead, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Lead {
  const leads = getLeads();
  const now = new Date().toISOString();
  const newLead: Lead = {
    ...lead,
    id: generateId(),
    status: 'new',
    createdAt: now,
    updatedAt: now,
  };
  leads.unshift(newLead);
  save(KEYS.leads, leads);
  return newLead;
}

export function updateLeadStatus(id: string, status: LeadStatus): void {
  const leads = getLeads();
  const idx = leads.findIndex(l => l.id === id);
  if (idx !== -1) {
    leads[idx].status = status;
    leads[idx].updatedAt = new Date().toISOString();
    save(KEYS.leads, leads);
  }
}

export function deleteLead(id: string): void {
  const leads = getLeads().filter(l => l.id !== id);
  save(KEYS.leads, leads);
}

// ── Products ──

export function getProducts(): AdminProduct[] {
  const products = load<AdminProduct[]>(KEYS.products, []);
  if (products.length === 0) {
    // Seed from printerModels
    const seeded = seedProductsFromPrinterData();
    save(KEYS.products, seeded);
    return seeded;
  }
  return products;
}

export function getProduct(id: string): AdminProduct | undefined {
  return getProducts().find(p => p.id === id);
}

export function saveProduct(product: AdminProduct): void {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === product.id);
  product.updatedAt = new Date().toISOString();
  if (idx !== -1) {
    products[idx] = product;
  } else {
    product.createdAt = new Date().toISOString();
    products.push(product);
  }
  save(KEYS.products, products);
}

export function deleteProduct(id: string): void {
  const products = getProducts().filter(p => p.id !== id);
  save(KEYS.products, products);
}

export function reorderProducts(orderedIds: string[]): void {
  const products = getProducts();
  orderedIds.forEach((id, index) => {
    const product = products.find(p => p.id === id);
    if (product) product.displayOrder = index;
  });
  products.sort((a, b) => a.displayOrder - b.displayOrder);
  save(KEYS.products, products);
}

// ── Feature Tags ──

export function getFeatureTags(): string[] {
  return load<string[]>(KEYS.featureTags, [
    'UV LED', 'High Resolution', 'Rotary', 'Varnish', 'White Ink',
    'CMYK', 'Industrial', 'Desktop', 'Large Format', 'I3200 Heads',
  ]);
}

export function addFeatureTag(tag: string): void {
  const tags = getFeatureTags();
  if (!tags.includes(tag)) {
    tags.push(tag);
    save(KEYS.featureTags, tags);
  }
}

// ── Recommendation Rules ──

export function getRules(): RecommendationRule[] {
  const rules = load<RecommendationRule[]>(KEYS.rules, []);
  if (rules.length === 0) {
    const seeded = seedDefaultRules();
    save(KEYS.rules, seeded);
    return seeded;
  }
  return rules;
}

export function saveRule(rule: RecommendationRule): void {
  const rules = getRules();
  const idx = rules.findIndex(r => r.id === rule.id);
  rule.updatedAt = new Date().toISOString();
  if (idx !== -1) {
    rules[idx] = rule;
  } else {
    rule.createdAt = new Date().toISOString();
    rules.push(rule);
  }
  save(KEYS.rules, rules);
}

export function deleteRule(id: string): void {
  const rules = getRules().filter(r => r.id !== id);
  save(KEYS.rules, rules);
}

export function toggleRule(id: string): void {
  const rules = getRules();
  const rule = rules.find(r => r.id === id);
  if (rule) {
    rule.enabled = !rule.enabled;
    rule.updatedAt = new Date().toISOString();
    save(KEYS.rules, rules);
  }
}

// ── Settings ──

export function getSettings(): GlobalSettings {
  return load<GlobalSettings>(KEYS.settings, DEFAULT_SETTINGS);
}

export function saveSettings(settings: GlobalSettings): void {
  save(KEYS.settings, settings);
}

// ── Seed functions ──

function seedProductsFromPrinterData(): AdminProduct[] {
  const now = new Date().toISOString();
  return printerModels.map((m, index) => ({
    id: m.id,
    name: m.name,
    model: m.fullName,
    category: 'uv_led_printer' as const,
    shortDescription: `${m.brand} ${m.fullName} - Print area: ${m.specs.printArea}`,
    longDescription: '',
    priceRange: m.price || '',
    showPrice: !!m.price,
    images: m.image ? [m.image] : [],
    videoUrl: '',
    featureTags: [
      'UV LED',
      m.specs.headType,
      m.specs.inkType.includes('W') ? 'White Ink' : '',
      m.specs.inkType.includes('Barniz') ? 'Varnish' : '',
    ].filter(Boolean),
    specs: Object.entries(m.specs).map(([key, value]) => ({ key, value: value || '' })),
    costPerPrint: null,
    roiSalePrice: 5,
    roiCost: 0.4,
    roiMinUnitsPerDay: 10,
    compatibleMaterials: [],
    visibleInWizard: m.category !== 'discontinued',
    featured: false,
    active: m.category !== 'discontinued',
    displayOrder: index,
    createdAt: now,
    updatedAt: now,
  }));
}

function seedDefaultRules(): RecommendationRule[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'rule_small_uv',
      name: 'Small UV → Artis Young',
      conditions: [
        { field: 'productionType', operator: 'equals', value: 'uvPrinting' },
        { field: 'uvMaxSize', operator: 'in', value: 'a4,a3' },
        { field: 'investmentRange', operator: 'in', value: 'under5k,5to15k' },
      ],
      recommendedProductIds: ['artisjet-young'],
      priority: 10,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'rule_medium_uv',
      name: 'Medium UV → MBO 4060 Plus',
      conditions: [
        { field: 'productionType', operator: 'equals', value: 'uvPrinting' },
        { field: 'uvMaxSize', operator: 'in', value: 'a3,60x90' },
        { field: 'investmentRange', operator: 'in', value: '5to15k,15to40k' },
      ],
      recommendedProductIds: ['mbo-4060-plus', 'mbo-4060-plus-i3200'],
      priority: 20,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'rule_large_uv',
      name: 'Large UV → MBO 6090/1015',
      conditions: [
        { field: 'productionType', operator: 'equals', value: 'uvPrinting' },
        { field: 'uvMaxSize', operator: 'in', value: '60x90,100x160' },
        { field: 'investmentRange', operator: 'in', value: '15to40k,over40k' },
      ],
      recommendedProductIds: ['mbo-6090', 'mbo-1015'],
      priority: 30,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'rule_quality_focus',
      name: 'Quality priority → I3200 heads',
      conditions: [
        { field: 'productionType', operator: 'equals', value: 'uvPrinting' },
        { field: 'priorities', operator: 'contains', value: 'quality' },
      ],
      recommendedProductIds: ['mbo-4060-plus-i3200'],
      priority: 15,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}
