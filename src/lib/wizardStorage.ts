import { WizardState, initialWizardState, WizardStep } from './wizardTypes';

const STORAGE_KEY = 'uv-led-wizard-state';
const SAVED_WIZARDS_KEY = 'uv-led-saved-wizards';

interface SavedWizard {
  code: string;
  state: WizardState;
  currentStep: WizardStep;
  savedAt: string;
}

// Auto-save current wizard progress
export function autoSaveWizard(state: WizardState, currentStep: WizardStep): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, currentStep, savedAt: new Date().toISOString() }));
  } catch { /* ignore */ }
}

export function loadAutoSavedWizard(): { state: WizardState; currentStep: WizardStep } | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return { state: { ...initialWizardState, ...parsed.state }, currentStep: parsed.currentStep || 1 };
  } catch {
    return null;
  }
}

export function clearAutoSavedWizard(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Save & continue later - generates a shareable code
export function generateSaveCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function saveWizardWithCode(state: WizardState, currentStep: WizardStep): string {
  const code = generateSaveCode();
  try {
    const savedWizards = getSavedWizards();
    savedWizards.push({ code, state, currentStep, savedAt: new Date().toISOString() });
    // Keep only last 20 saved wizards
    if (savedWizards.length > 20) savedWizards.splice(0, savedWizards.length - 20);
    localStorage.setItem(SAVED_WIZARDS_KEY, JSON.stringify(savedWizards));
  } catch { /* ignore */ }
  return code;
}

export function loadWizardByCode(code: string): { state: WizardState; currentStep: WizardStep } | null {
  const wizards = getSavedWizards();
  const found = wizards.find(w => w.code === code.toUpperCase());
  if (!found) return null;
  return { state: { ...initialWizardState, ...found.state }, currentStep: found.currentStep };
}

function getSavedWizards(): SavedWizard[] {
  try {
    const stored = localStorage.getItem(SAVED_WIZARDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
