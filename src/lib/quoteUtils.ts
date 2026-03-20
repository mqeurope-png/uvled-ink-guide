import { printerModels, PrinterModel } from './printerData';

// Parse print area from string like "30 x 50 cm" to { width: 30, height: 50 }
export function parsePrintArea(printArea: string): { width: number; length: number } | null {
  const match = printArea.match(/(\d+)\s*x\s*(\d+)/);
  if (!match) return null;
  return {
    width: parseInt(match[1], 10),
    length: parseInt(match[2], 10),
  };
}

// Parse max height from string like "10 cm" to number
export function parseMaxHeight(maxHeight: string): number | null {
  const match = maxHeight.match(/(\d+)/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

// Check if a model is compatible with given object dimensions
export function isModelCompatible(
  model: PrinterModel,
  objectWidth: number,
  objectLength: number,
  objectHeight: number,
  objectType: 'flat' | 'cylindrical'
): boolean {
  // Don't show discontinued models
  if (model.category === 'discontinued') return false;
  
  const printArea = parsePrintArea(model.specs.printArea);
  const maxHeight = parseMaxHeight(model.specs.maxHeight);
  
  if (!printArea || maxHeight === null) return false;
  
  // For flat objects: check if object fits in print area and height
  if (objectType === 'flat') {
    // Check both orientations (width x length and length x width)
    const fitsNormal = objectWidth <= printArea.width && objectLength <= printArea.length;
    const fitsRotated = objectLength <= printArea.width && objectWidth <= printArea.length;
    const fitsHeight = objectHeight <= maxHeight;
    
    return (fitsNormal || fitsRotated) && fitsHeight;
  }
  
  // For cylindrical objects: need rotary accessory and height check
  if (objectType === 'cylindrical') {
    // Check if model has rotary accessory
    const hasRotary = model.accessories.some(
      a => a.id.includes('rotary') || a.name.toLowerCase().includes('rotativo')
    );
    
    // For cylindrical, width is diameter, length is the cylinder length
    // The cylinder length must fit in the print area
    const fitsLength = objectLength <= Math.max(printArea.width, printArea.length);
    const fitsHeight = objectHeight <= maxHeight;
    
    return hasRotary && fitsLength && fitsHeight;
  }
  
  return false;
}

// Get all compatible models for given dimensions
export function getCompatibleModels(
  objectWidth: number,
  objectLength: number,
  objectHeight: number,
  objectType: 'flat' | 'cylindrical'
): PrinterModel[] {
  return printerModels.filter(model =>
    isModelCompatible(model, objectWidth, objectLength, objectHeight, objectType)
  );
}

// Parse price string to number (e.g., "6.495€" -> 6495)
export function parsePrice(price?: string): number | null {
  if (!price) return null;
  const match = price.replace(/\./g, '').match(/(\d+)/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

// Format price number to string with thousands separator
export function formatPrice(price: number): string {
  return price.toLocaleString('es-ES') + '€';
}
