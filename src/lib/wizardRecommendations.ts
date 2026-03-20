import { printerModels, PrinterModel } from './printerData';
import { WizardState } from './wizardTypes';
import { parsePrintArea, parseMaxHeight, parsePrice } from './quoteUtils';

export interface Recommendation {
  model: PrinterModel;
  matchScore: number; // 0-100
  matchReasons: string[]; // translation keys
  costPerPrint: number | null; // estimated cost per print in cents
}

// Map UV max size selections to minimum print area dimensions (cm)
const sizeMinDimensions: Record<string, { w: number; l: number }> = {
  a4: { w: 21, l: 29.7 },
  a3: { w: 29.7, l: 42 },
  '60x90': { w: 60, l: 90 },
  '100x160': { w: 100, l: 160 },
};

// Map investment ranges to price ranges
const investmentRanges: Record<string, { min: number; max: number }> = {
  under5k: { min: 0, max: 5000 },
  '5to15k': { min: 5000, max: 15000 },
  '15to40k': { min: 15000, max: 40000 },
  over40k: { min: 40000, max: Infinity },
  financing: { min: 0, max: Infinity },
};

export function getRecommendations(state: WizardState): Recommendation[] {
  // Only UV printing has actual products right now
  if (state.productionType !== 'uvPrinting') {
    return [];
  }

  const activeModels = printerModels.filter(m => m.category !== 'discontinued');

  return activeModels
    .map(model => scoreModel(model, state))
    .filter(r => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

function scoreModel(model: PrinterModel, state: WizardState): Recommendation {
  let score = 0;
  const reasons: string[] = [];

  const printArea = parsePrintArea(model.specs.printArea);
  const maxHeight = parseMaxHeight(model.specs.maxHeight);
  const price = parsePrice(model.price);

  // Size compatibility
  if (state.uvMaxSize && printArea) {
    const required = sizeMinDimensions[state.uvMaxSize];
    if (required) {
      const fitsNormal = printArea.width >= required.w && printArea.length >= required.l;
      const fitsRotated = printArea.width >= required.l && printArea.length >= required.w;
      if (fitsNormal || fitsRotated) {
        score += 30;
        reasons.push('recMatchSize');
      }
    }
  }

  // Surface type
  if (state.uvSurfaceType === 'cylindrical') {
    const hasRotary = model.accessories.some(
      a => a.id.includes('rotary') || a.name.toLowerCase().includes('rotativ')
    );
    if (hasRotary) {
      score += 15;
      reasons.push('recMatchRotary');
    } else {
      score -= 20;
    }
  } else if (state.uvSurfaceType === 'flat' || state.uvSurfaceType === 'irregular') {
    score += 10;
    reasons.push('recMatchSurface');
  }

  // Special effects
  if (state.uvSpecialEffects.length > 0 && !state.uvSpecialEffects.includes('none')) {
    // Models with varnish ink support special effects better
    if (model.specs.inkType.toLowerCase().includes('barniz')) {
      score += 15;
      reasons.push('recMatchEffects');
    }
  }

  // Head type quality
  if (state.uvMaterials.some(m => ['glass', 'ceramic', 'metal'].includes(m))) {
    // I3200 heads are better for hard materials
    if (model.specs.headType === 'I3200') {
      score += 10;
      reasons.push('recMatchPrecision');
    }
  }

  // Investment range
  if (state.investmentRange && price) {
    const range = investmentRanges[state.investmentRange];
    if (range && price >= range.min && price <= range.max) {
      score += 20;
      reasons.push('recMatchBudget');
    } else if (range && price < range.min) {
      score += 5; // under budget is ok
    }
  }

  // Production volume
  if (state.uvProductionVolume > 0) {
    const heads = parseInt(model.specs.heads) || 1;
    if (state.uvProductionVolume > 50 && heads >= 3) {
      score += 10;
      reasons.push('recMatchVolume');
    } else if (state.uvProductionVolume <= 50) {
      score += 5;
    }
  }

  // Priority bonuses
  if (state.priorities.includes('quality') && model.specs.headType === 'I3200') {
    score += 5;
  }
  if (state.priorities.includes('versatility') && model.specs.inkType.includes('Barniz')) {
    score += 5;
  }
  if (state.priorities.includes('price') && price && price < 10000) {
    score += 5;
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Estimate cost per print (very rough: ink cost / prints per liter)
  const costPerPrint = estimateCostPerPrint(model);

  return { model, matchScore: score, matchReasons: reasons, costPerPrint };
}

function estimateCostPerPrint(model: PrinterModel): number | null {
  // Rough estimate: ~5ml ink per A4 print, ink is ~85€/L
  // So ~0.425€ per A4 print for colors + ~0.15€ for white
  const area = parsePrintArea(model.specs.printArea);
  if (!area) return null;

  const printAreaCm2 = area.width * area.length;
  const a4Cm2 = 21 * 29.7;
  const ratio = printAreaCm2 / a4Cm2;

  // Base cost per A4 equivalent: ~0.40€ for CMYK, ~0.20€ for white
  const baseCost = 0.40;
  const whiteCost = model.specs.inkType.includes('W') ? 0.20 : 0;

  return Math.round((baseCost + whiteCost) * ratio * 100) / 100;
}

export function calculateROI(
  modelPrice: number,
  costPerPrint: number,
  sellingPricePerUnit: number,
  unitsPerDay: number
): { monthsToRecover: number; dailyProfit: number; yearlyProfit: number } {
  const profitPerUnit = sellingPricePerUnit - costPerPrint;
  const dailyProfit = profitPerUnit * unitsPerDay;
  const monthsToRecover = dailyProfit > 0 ? Math.ceil(modelPrice / (dailyProfit * 22)) : Infinity; // 22 working days

  return {
    monthsToRecover,
    dailyProfit,
    yearlyProfit: dailyProfit * 22 * 12,
  };
}
