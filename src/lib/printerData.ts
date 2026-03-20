// Importaciones de imágenes
import mbo3050Image from '@/assets/printers/mbo-3050.png';
import mbo4060PlusImage from '@/assets/printers/mbo-4060-plus.png';
import mbo4060MaxImage from '@/assets/printers/mbo-4060-max.png';
import mbo4060PlusI3200Image from '@/assets/printers/mbo-4060-plus-i3200.jpg';
import mbo6090Image from '@/assets/printers/mbo-6090.jpg';
import mbo1015Image from '@/assets/printers/mbo-1015.webp';
import artisjetYoungImage from '@/assets/printers/artisjet-young.jpg';
import artisjetA3000proImage from '@/assets/printers/artisjet-a3000pro.png';
import artisjetA5000Image from '@/assets/printers/artisjet-a5000.png';
import artisjetTrustImage from '@/assets/printers/artisjet-trust.png';

export type PrinterCategory = 'mbo' | 'artisjet' | 'discontinued';

export interface PrinterModel {
  id: string;
  brand: string;
  name: string;
  fullName: string;
  category: PrinterCategory;
  image?: string;
  price?: string;
  priceWithVat?: string;
  specs: {
    printArea: string;
    maxHeight: string;
    resolution: string;
    inkType: string;
    heads: string;
    headType: string;
    printSpeed?: string;
    connectivity?: string;
    power?: string;
    dimensions: string;
    weight: string;
  };
  manualUrl?: string;
  consumables: Consumable[];
  accessories: Accessory[];
}

export interface Consumable {
  id: string;
  type: 'printhead' | 'damper' | 'capping' | 'wiper' | 'cleanStation' | 'tubes' | 'ink';
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: string;
  lifespan?: string; // Vida útil estimada
}

export interface Accessory {
  id: string;
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: string;
}

// ============ MODELOS MBO PRINTERS ============

const mboConsumablesI3200: Consumable[] = [
  {
    id: 'printhead-i3200',
    type: 'printhead',
    name: 'Cabezal Epson I3200-U1',
    description: 'Cabezal de impresión original Epson I3200-U1 para tinta UV. Alta resolución 600 dpi, 3200 boquillas.',
    url: 'https://www.boprint.net/producto/cabezal-epson-i3200/',
    price: '320€',
    lifespan: '12-18 meses / 500-800 litros de tinta',
  },
  {
    id: 'damper-i3200',
    type: 'damper',
    name: 'Damper para I3200',
    description: 'Damper con filtro especial compatible con cabezal Epson I3200. Resistente a corrosión.',
    url: 'https://www.boprint.net/producto/damper-i3200/',
    price: '15€',
    lifespan: '3-6 meses',
  },
  {
    id: 'capping-i3200',
    type: 'capping',
    name: 'Capping Station I3200',
    description: 'Estación de capping para cabezal I3200. Mantiene la humedad del cabezal.',
    url: 'https://www.boprint.net/producto/capping-i3200/',
    price: '45€',
    lifespan: '6-12 meses',
  },
  {
    id: 'wiper-i3200',
    type: 'wiper',
    name: 'Wiper Blade I3200',
    description: 'Cuchilla de limpieza para sistema de mantenimiento. Material resistente a UV.',
    url: 'https://www.boprint.net/producto/wiper-blade/',
    price: '8€',
    lifespan: '1-3 meses',
  },
  {
    id: 'cleanstation-i3200',
    type: 'cleanStation',
    name: 'Clean Station Completa',
    description: 'Estación de limpieza completa con bomba y sistema de succión para I3200.',
    url: 'https://www.boprint.net/producto/clean-station/',
    price: '180€',
    lifespan: '12-24 meses',
  },
  {
    id: 'tubes-uv',
    type: 'tubes',
    name: 'Kit Tubos Tinta UV',
    description: 'Set completo de tubos para sistema de tinta UV. Resistentes a rayos UV.',
    url: 'https://www.boprint.net/producto/tubos-uv/',
    price: '25€',
    lifespan: '6-12 meses',
  },
  {
    id: 'ink-cyan',
    type: 'ink',
    name: 'Tinta UV Cyan 1L',
    description: 'Tinta UV LED de alta calidad - Cyan. Compatible con cabezales I3200.',
    url: 'https://www.boprint.net/producto/tinta-uv-cyan/',
    price: '85€/L',
  },
  {
    id: 'ink-magenta',
    type: 'ink',
    name: 'Tinta UV Magenta 1L',
    description: 'Tinta UV LED de alta calidad - Magenta. Compatible con cabezales I3200.',
    url: 'https://www.boprint.net/producto/tinta-uv-magenta/',
    price: '85€/L',
  },
  {
    id: 'ink-yellow',
    type: 'ink',
    name: 'Tinta UV Yellow 1L',
    description: 'Tinta UV LED de alta calidad - Yellow. Compatible con cabezales I3200.',
    url: 'https://www.boprint.net/producto/tinta-uv-yellow/',
    price: '85€/L',
  },
  {
    id: 'ink-black',
    type: 'ink',
    name: 'Tinta UV Black 1L',
    description: 'Tinta UV LED de alta calidad - Black. Compatible con cabezales I3200.',
    url: 'https://www.boprint.net/producto/tinta-uv-black/',
    price: '85€/L',
  },
  {
    id: 'ink-white',
    type: 'ink',
    name: 'Tinta UV White 1L',
    description: 'Tinta UV LED de alta calidad - White. Para impresión sobre fondos oscuros.',
    url: 'https://www.boprint.net/producto/tinta-uv-white/',
    price: '120€/L',
  },
];

const mboConsumablesTx800: Consumable[] = [
  {
    id: 'printhead-tx800',
    type: 'printhead',
    name: 'Cabezal Epson TX800',
    description: 'Cabezal de impresión Epson TX800 para tinta UV. 6 canales, 180 boquillas por canal.',
    url: 'https://www.boprint.net/producto/cabezal-tx800/',
    price: '180€',
    lifespan: '8-12 meses / 300-500 litros de tinta',
  },
  {
    id: 'damper-tx800',
    type: 'damper',
    name: 'Damper para TX800',
    description: 'Damper compatible con cabezal Epson TX800. Filtro especial para alta velocidad.',
    url: 'https://www.boprint.net/producto/damper-tx800/',
    price: '12€',
    lifespan: '3-6 meses',
  },
  {
    id: 'capping-tx800',
    type: 'capping',
    name: 'Capping Station TX800',
    description: 'Estación de capping para cabezal TX800.',
    url: 'https://www.boprint.net/producto/capping-tx800/',
    price: '35€',
    lifespan: '6-12 meses',
  },
  {
    id: 'wiper-tx800',
    type: 'wiper',
    name: 'Wiper Blade TX800',
    description: 'Cuchilla de limpieza para sistema TX800.',
    url: 'https://www.boprint.net/producto/wiper-blade/',
    price: '6€',
    lifespan: '1-3 meses',
  },
  {
    id: 'cleanstation-tx800',
    type: 'cleanStation',
    name: 'Clean Station TX800',
    description: 'Estación de limpieza completa para TX800.',
    url: 'https://www.boprint.net/producto/clean-station/',
    price: '150€',
    lifespan: '12-24 meses',
  },
  {
    id: 'tubes-uv',
    type: 'tubes',
    name: 'Kit Tubos Tinta UV',
    description: 'Set completo de tubos para sistema de tinta UV.',
    url: 'https://www.boprint.net/producto/tubos-uv/',
    price: '25€',
    lifespan: '6-12 meses',
  },
  {
    id: 'ink-cyan',
    type: 'ink',
    name: 'Tinta UV Cyan 1L',
    description: 'Tinta UV LED de alta calidad - Cyan.',
    url: 'https://www.boprint.net/producto/tinta-uv-cyan/',
    price: '85€/L',
  },
  {
    id: 'ink-white',
    type: 'ink',
    name: 'Tinta UV White 1L',
    description: 'Tinta UV LED de alta calidad - White.',
    url: 'https://www.boprint.net/producto/tinta-uv-white/',
    price: '120€/L',
  },
];

const mboAccessories: Accessory[] = [
  {
    id: 'rotary',
    name: 'Dispositivo Rotativo',
    description: 'Módulo para impresión 360º en objetos cilíndricos: botellas, vasos, bolígrafos.',
    url: 'https://boprint.net/tienda/',
  },
  {
    id: 'silicone-base',
    name: 'Base de Silicona para mesa',
    description: 'Base de silicona para mesa de impresión.',
    url: 'https://boprint.net/producto/base-de-silicona/',
  },
  {
    id: 'templates',
    name: 'Plantillas y moldes a medida',
    description: 'Moldes standard o personalizados para todo tipo de productos.',
    url: 'https://boprint.net/producto/moldes-plantillas/',
  },
];

// Consumibles Artisjet (cabezal I3200)
const artisjetConsumables: Consumable[] = [
  {
    id: 'printhead-i3200',
    type: 'printhead',
    name: 'Cabezal Epson I3200-U1',
    description: 'Cabezal piezoeléctrico Epson I3200 original. Alta resolución hasta 2880x1440 dpi.',
    url: 'https://www.boprint.net/producto/cabezal-epson-i3200/',
    price: '320€',
    lifespan: '12-18 meses / 500-800 litros de tinta',
  },
  {
    id: 'damper-i3200',
    type: 'damper',
    name: 'Damper para I3200',
    description: 'Damper UV con filtro especial para alta velocidad de impresión.',
    url: 'https://www.boprint.net/producto/damper-i3200/',
    price: '15€',
    lifespan: '3-6 meses',
  },
  {
    id: 'capping-i3200',
    type: 'capping',
    name: 'Capping Station',
    description: 'Estación de capping original Artisjet.',
    url: 'https://www.boprint.net/producto/capping-artisjet/',
    price: '65€',
    lifespan: '6-12 meses',
  },
  {
    id: 'cleanstation-artisjet',
    type: 'cleanStation',
    name: 'Kit Mantenimiento Artisjet',
    description: 'Kit completo de mantenimiento con depósito de fácil acceso.',
    url: 'https://www.boprint.net/producto/kit-mantenimiento-artisjet/',
    price: '220€',
    lifespan: '12-24 meses',
  },
  {
    id: 'ink-dts3-cyan',
    type: 'ink',
    name: 'Tinta DTS3 Cyan 150ml',
    description: 'Tinta artisink DTS3 UV LED - Cyan. Libre de toxinas, inodora.',
    url: 'https://www.boprint.net/producto/tinta-dts3-cyan/',
    price: '35€',
  },
  {
    id: 'ink-dts3-white',
    type: 'ink',
    name: 'Tinta DTS3 White 150ml',
    description: 'Tinta artisink DTS3 UV LED - White.',
    url: 'https://www.boprint.net/producto/tinta-dts3-white/',
    price: '45€',
  },
  {
    id: 'ink-dts3-varnish',
    type: 'ink',
    name: 'Tinta DTS3 Barniz 150ml',
    description: 'Barniz UV LED para efectos brillante/mate y textura 3D.',
    url: 'https://www.boprint.net/producto/tinta-dts3-barniz/',
    price: '35€',
  },
];

// Consumibles Artisjet DX7
const artisjetConsumablesDX7: Consumable[] = [
  {
    id: 'printhead-dx7',
    type: 'printhead',
    name: 'Cabezal Epson DX7',
    description: 'Cabezal piezoeléctrico Epson DX7 original. Fabricado en Japón.',
    url: 'https://www.boprint.net/producto/cabezal-dx7/',
    price: '280€',
    lifespan: '10-14 meses',
  },
  {
    id: 'damper-dx7',
    type: 'damper',
    name: 'Kit Damper DX7',
    description: 'Kit de recambio de dampers para cabezal DX7.',
    url: 'https://www.boprint.net/producto/damper-dx7/',
    price: '18€',
    lifespan: '3-6 meses',
  },
  {
    id: 'capping-dx7',
    type: 'capping',
    name: 'Capping Station DX7',
    description: 'Estación de capping para Artisjet Young.',
    url: 'https://www.boprint.net/producto/capping-dx7/',
    price: '55€',
    lifespan: '6-12 meses',
  },
  {
    id: 'ink-dts3-set',
    type: 'ink',
    name: 'Set Tintas DTS3 CMYKWW',
    description: 'Set completo de tintas UV LED DTS3.',
    url: 'https://www.boprint.net/producto/set-tintas-dts3/',
    price: '180€',
  },
];

const artisjetAccessories: Accessory[] = [
  {
    id: 'rotary-artisjet',
    name: 'Módulo Rotatorio ROT 360',
    description: 'Conversión rápida para impresión 360º en objetos cilíndricos.',
    url: 'https://boprint.net/tienda/',
  },
  {
    id: 'cleaning-agent',
    name: 'Líquido de limpieza Flush',
    description: 'Líquido de limpieza para cabezales y tintas UV LED.',
    url: 'https://boprint.net/tienda/',
  },
  {
    id: 'alcohol',
    name: 'Alcohol isopropílico 1L',
    description: 'Perfecto para la limpieza de partes de impresora.',
    url: 'https://boprint.net/producto/alcohol-isopropilico-1-litro/',
  },
  {
    id: 'primer-set',
    name: 'Primers UV',
    description: 'Imprimaciones para cristal, metal, cerámica y polipropilenos.',
    url: 'https://boprint.net/producto/primers-uv/',
  },
  {
    id: 'bottle-system',
    name: 'Sistema Botellero de Tinta',
    description: 'Sistema de botellas con estante para tintas UV LED.',
    url: 'https://boprint.net/producto/sistema-botellero-tinta/',
  },
  {
    id: 'templates',
    name: 'Plantillas y moldes a medida',
    description: 'Moldes standard o personalizados para todo tipo de productos.',
    url: 'https://boprint.net/producto/moldes-plantillas/',
  },
];

export const printerModels: PrinterModel[] = [
  // ============ MBO PRINTERS ============
  {
    id: 'mbo-3050-uv-led-pro',
    brand: 'MBO PRINTERS',
    name: 'MBO 3050 UV LED PRO',
    fullName: 'MBO 3050 UV LED PRO',
    category: 'mbo',
    image: mbo3050Image,
    price: '6.495€',
    priceWithVat: '7.859€',
    specs: {
      printArea: '30 x 50 cm',
      maxHeight: '10 cm',
      resolution: '720 x 1440 dpi',
      inkType: 'UV LED CMYK + W',
      heads: '1',
      headType: 'TX800',
      connectivity: 'USB 2.0',
      power: '220V AC 50/60Hz',
      dimensions: '780 x 550 x 420 mm',
      weight: '60 kg',
    },
    consumables: mboConsumablesTx800,
    accessories: mboAccessories,
  },
  {
    id: 'mbo-4060-plus',
    brand: 'MBO PRINTERS',
    name: 'MBO 4060 PLUS',
    fullName: 'MBO 4060 PLUS UV LED',
    category: 'mbo',
    image: mbo4060PlusImage,
    price: '8.995€',
    priceWithVat: '10.884€',
    specs: {
      printArea: '35 x 55 cm',
      maxHeight: '22 cm',
      resolution: '720 x 1440 dpi',
      inkType: 'UV LED CMYK + W',
      heads: '1',
      headType: 'TX800',
      connectivity: 'USB 2.0',
      power: '220V AC 50/60Hz',
      dimensions: '800 x 858 x 566 mm',
      weight: '70 kg',
    },
    consumables: mboConsumablesTx800,
    accessories: mboAccessories,
  },
  {
    id: 'mbo-4060-max',
    brand: 'MBO PRINTERS',
    name: 'MBO 4060 MAX',
    fullName: 'MBO 4060 MAX UV LED',
    category: 'mbo',
    image: mbo4060MaxImage,
    price: '9.495€',
    priceWithVat: '11.489€',
    specs: {
      printArea: '45 x 65 cm',
      maxHeight: '22 cm',
      resolution: '720 x 1440 dpi',
      inkType: 'UV LED CMYK + W',
      heads: '1',
      headType: 'TX800',
      connectivity: 'USB 2.0',
      power: '220V AC 50/60Hz',
      dimensions: '920 x 1030 x 610 mm',
      weight: '90 kg',
    },
    consumables: mboConsumablesTx800,
    accessories: mboAccessories,
  },
  {
    id: 'mbo-4060-plus-i3200',
    brand: 'MBO PRINTERS',
    name: 'MBO 4060 PLUS I3200',
    fullName: 'MBO 4060 PLUS I3200 UV LED',
    category: 'mbo',
    image: mbo4060PlusI3200Image,
    price: '10.995€',
    priceWithVat: '13.304€',
    specs: {
      printArea: '35 x 55 cm',
      maxHeight: '22 cm',
      resolution: '1200 x 1800 dpi',
      inkType: 'UV LED CMYK + W',
      heads: '1',
      headType: 'I3200',
      connectivity: 'USB 2.0',
      power: '220V AC 50/60Hz',
      dimensions: '800 x 858 x 566 mm',
      weight: '75 kg',
    },
    consumables: mboConsumablesI3200,
    accessories: mboAccessories,
  },
  {
    id: 'mbo-6090-uv-led',
    brand: 'MBO PRINTERS',
    name: 'MBO 6090',
    fullName: 'MBO 6090 UV LED',
    category: 'mbo',
    image: mbo6090Image,
    price: '14.500€',
    priceWithVat: '17.545€',
    specs: {
      printArea: '60 x 90 cm',
      maxHeight: '15 cm',
      resolution: '720 x 1080 dpi',
      inkType: 'UV LED CMYK + LC + LM + W + Barniz',
      heads: '3',
      headType: 'TX800',
      connectivity: 'USB 2.0',
      power: '220V AC 50/60Hz',
      dimensions: '1670 x 1760 x 1120 mm',
      weight: '295 kg',
    },
    consumables: mboConsumablesTx800,
    accessories: [...mboAccessories, {
      id: 'rotary-integrated',
      name: 'Dispositivo Rotativo Integrado',
      description: 'Módulo rotativo integrado para impresión 360º en objetos cilíndricos.',
      url: 'https://boprint.net/tienda/',
      price: 'Incluido',
    }, {
      id: 'vacuum-pro',
      name: 'Mesa de Vacío Pro',
      description: 'Mesa de vacío profesional de alta potencia incluida.',
      url: 'https://www.boprint.net/producto/mesa-vacio-pro/',
      price: 'Incluida',
    }],
  },
  {
    id: 'mbo-1015-uv-led-i3200',
    brand: 'MBO PRINTERS',
    name: 'MBO 1015 I3200',
    fullName: 'MBO 1015 UV LED I3200',
    category: 'mbo',
    image: mbo1015Image,
    price: '22.500€',
    priceWithVat: '27.225€',
    specs: {
      printArea: '100 x 150 cm',
      maxHeight: '20 cm',
      resolution: '1200 x 1800 dpi',
      inkType: 'UV LED CMYK + W + Barniz',
      heads: '4',
      headType: 'I3200',
      connectivity: 'USB 2.0',
      power: '220V AC 50/60Hz',
      dimensions: '2100 x 2200 x 1200 mm',
      weight: '450 kg',
    },
    consumables: mboConsumablesI3200,
    accessories: [...mboAccessories, {
      id: 'rotary-integrated',
      name: 'Dispositivo Rotativo Integrado',
      description: 'Módulo rotativo integrado para impresión 360º en objetos cilíndricos.',
      url: 'https://boprint.net/tienda/',
      price: 'Incluido',
    }, {
      id: 'vacuum-industrial',
      name: 'Mesa de Vacío Industrial',
      description: 'Sistema de vacío industrial de alta potencia.',
      url: 'https://www.boprint.net/producto/mesa-vacio-industrial/',
      price: 'Incluida',
    }],
  },

  // ============ ARTISJET ============
  {
    id: 'artisjet-young',
    brand: 'ARTISJET',
    name: 'artisJet Young',
    fullName: 'artisJet Young UV LED',
    category: 'artisjet',
    image: artisjetYoungImage,
    price: '8.900€',
    priceWithVat: '10.769€',
    specs: {
      printArea: '20 x 30 cm',
      maxHeight: '5 cm',
      resolution: '720 x 2880 dpi',
      inkType: 'UV LED CMYK + W',
      heads: '1',
      headType: 'DX7',
      connectivity: 'USB 2.0',
      power: '100V-240V 50/60Hz',
      dimensions: '760 x 740 x 460 mm',
      weight: '60 kg',
    },
    consumables: artisjetConsumablesDX7,
    accessories: artisjetAccessories.filter(a => a.id !== 'rotary-artisjet'),
  },
  {
    id: 'artisjet-a3000pro-freebird',
    brand: 'ARTISJET',
    name: 'artis 3000U Pro',
    fullName: 'artisJet A3000 PRO FREEBIRD',
    category: 'artisjet',
    image: artisjetA3000proImage,
    price: '13.900€',
    priceWithVat: '16.819€',
    specs: {
      printArea: '36 x 50 cm',
      maxHeight: '17 cm',
      resolution: '2880 x 1440 dpi',
      inkType: 'UV LED CMYK + W + Barniz',
      heads: '1',
      headType: 'I3200',
      connectivity: 'USB 2.0',
      power: '100V-240V 50/60Hz',
      dimensions: '940 x 840 x 540 mm',
      weight: '120 kg',
    },
    consumables: artisjetConsumables,
    accessories: artisjetAccessories,
  },
  {
    id: 'artisjet-a5000-freebird',
    brand: 'ARTISJET',
    name: 'artis A5000',
    fullName: 'artisJet A5000 FREEBIRD',
    category: 'artisjet',
    image: artisjetA5000Image,
    price: '18.900€',
    priceWithVat: '22.869€',
    specs: {
      printArea: '50 x 70 cm',
      maxHeight: '25 cm',
      resolution: '2880 x 1440 dpi',
      inkType: 'UV LED CMYK + W + Barniz',
      heads: '1',
      headType: 'I3200',
      connectivity: 'USB 2.0',
      power: '100V-240V 50/60Hz',
      dimensions: '1060 x 980 x 730 mm',
      weight: '190 kg',
    },
    consumables: artisjetConsumables,
    accessories: artisjetAccessories,
  },
  {
    id: 'artisjet-trust-freebird',
    brand: 'ARTISJET',
    name: 'artisJet Trust',
    fullName: 'artisJet TRUST FREEBIRD',
    category: 'artisjet',
    image: artisjetTrustImage,
    price: '20.900€',
    priceWithVat: '25.289€',
    specs: {
      printArea: '60 x 90 cm',
      maxHeight: '25 cm',
      resolution: '2880 x 1440 dpi',
      inkType: 'UV LED CMYK + W + Barniz',
      heads: '1',
      headType: 'I3200',
      connectivity: 'USB 2.0',
      power: '100V-240V 50/60Hz',
      dimensions: '1260 x 1430 x 825 mm',
      weight: '250 kg',
    },
    consumables: artisjetConsumables,
    accessories: [...artisjetAccessories, {
      id: 'vacuum-trust',
      name: 'Mesa de Vacío',
      description: 'Sistema de vacío para sujeción de materiales incluido.',
      url: 'https://www.boprint.net/producto/mesa-vacio/',
      price: 'Incluida',
    }],
  },

  // ============ MODELOS DESCATALOGADOS ============
  {
    id: 'artisjet-a2100',
    brand: 'ARTISJET',
    name: 'Artisjet A2100',
    fullName: 'Artisjet A2100 UV LED',
    category: 'discontinued',
    specs: {
      printArea: '21 x 30 cm',
      maxHeight: '5 cm',
      resolution: '720 x 1440 dpi',
      inkType: 'UV LED CMYK + W',
      heads: '1',
      headType: 'DX5',
      dimensions: '600 x 500 x 400 mm',
      weight: '45 kg',
    },
    consumables: [],
    accessories: [],
  },
  {
    id: 'artisjet-a3000u',
    brand: 'ARTISJET',
    name: 'Artisjet A3000U',
    fullName: 'Artisjet A3000U UV LED',
    category: 'discontinued',
    specs: {
      printArea: '30 x 42 cm',
      maxHeight: '10 cm',
      resolution: '720 x 1440 dpi',
      inkType: 'UV LED CMYK + W',
      heads: '1',
      headType: 'DX5',
      dimensions: '750 x 650 x 500 mm',
      weight: '75 kg',
    },
    consumables: [],
    accessories: [],
  },
  {
    id: 'mbo-3020-uv-led',
    brand: 'MBO PRINTERS',
    name: 'MBO 3020',
    fullName: 'MBO 3020 UV LED',
    category: 'discontinued',
    specs: {
      printArea: '30 x 20 cm',
      maxHeight: '8 cm',
      resolution: '720 x 1440 dpi',
      inkType: 'UV LED CMYK + W',
      heads: '1',
      headType: 'XP600',
      dimensions: '600 x 450 x 380 mm',
      weight: '40 kg',
    },
    consumables: [],
    accessories: [],
  },
];

// Helpers
export const getMboModels = () => printerModels.filter(m => m.category === 'mbo');
export const getArtisjetModels = () => printerModels.filter(m => m.category === 'artisjet');
export const getDiscontinuedModels = () => printerModels.filter(m => m.category === 'discontinued');
