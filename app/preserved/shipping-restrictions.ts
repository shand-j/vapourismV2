// Countries where vaping products cannot be shipped
export const VAPING_RESTRICTED_COUNTRIES = [
  'AD', // Andorra
  'AG', // Antigua and Barbuda
  'AR', // Argentina
  'AU', // Australia
  'BT', // Bhutan
  'BR', // Brazil
  'BN', // Brunei
  'KH', // Cambodia
  'CN', // China
  'CU', // Cuba
  'DK', // Denmark
  'DM', // Dominica
  'TL', // East Timor
  'ET', // Ethiopia
  'FI', // Finland
  'GM', // Gambia
  'GH', // Ghana
  'IN', // India
  'IR', // Iran
  'IQ', // Iraq
  'JP', // Japan
  'LB', // Lebanon
  'MY', // Malaysia
  'MV', // Maldives
  'MU', // Mauritius
  'MX', // Mexico
  'NL', // Netherlands
  'NI', // Nicaragua
  'KP', // North Korea
  'OM', // Oman
  'PS', // Palestine
  'QA', // Qatar
  'WS', // Samoa
  'SC', // Seychelles
  'SG', // Singapore
  'SB', // Solomon Islands
  'ZA', // South Africa
  'LK', // Sri Lanka
  'SY', // Syria
  'TW', // Taiwan
  'TH', // Thailand
  'TO', // Tonga
  'TR', // Turkey
  'TM', // Turkmenistan
  'UG', // Uganda
  'UY', // Uruguay
  'VU', // Vanuatu
  'VE', // Venezuela
  'EH', // Western Sahara
];

// Countries where CBD products cannot be shipped
export const CBD_RESTRICTED_COUNTRIES = [
  'AF', // Afghanistan
  'AL', // Albania
  'DZ', // Algeria
  'AD', // Andorra
  'AO', // Angola
  'AZ', // Azerbaijan
  'BH', // Bahrain
  'BD', // Bangladesh
  'BB', // Barbados
  'BY', // Belarus
  'BE', // Belgium
  'BJ', // Benin
  'BT', // Bhutan
  'BO', // Bolivia
  'BW', // Botswana
  'BN', // Brunei
  'BF', // Burkina Faso
  'BI', // Burundi
  'KH', // Cambodia
  'CM', // Cameroon
  'CV', // Cape Verde
  'CF', // Central African Republic
  'TD', // Chad
  'CL', // Chile
  'CN', // China
  'KM', // Comoros
  'CG', // Congo
  'CU', // Cuba
  'DJ', // Djibouti
  'DM', // Dominica
  'DO', // Dominican Republic
  'CD', // DR Congo
  'TL', // East Timor
  'EG', // Egypt
  'SV', // El Salvador
  'GQ', // Equatorial Guinea
  'ER', // Eritrea
  'SZ', // Eswatini
  'ET', // Ethiopia
  'FJ', // Fiji
  'GA', // Gabon
  'GM', // Gambia
  'GE', // Georgia
  'GL', // Greenland
  'GD', // Grenada
  'GN', // Guinea
  'GW', // Guinea-Bissau
  'GY', // Guyana
  'HT', // Haiti
  'HN', // Honduras
  'IN', // India
  'ID', // Indonesia
  'IR', // Iran
  'IQ', // Iraq
  'CI', // Ivory Coast
  'JO', // Jordan
  'KZ', // Kazakhstan
  'KE', // Kenya
  'KI', // Kiribati
  'XK', // Kosovo
  'KW', // Kuwait
  'KG', // Kyrgyzstan
  'LA', // Laos
  'LB', // Lebanon
  'LS', // Lesotho
  'LR', // Liberia
  'LY', // Libya
  'MG', // Madagascar
  'MW', // Malawi
  'MY', // Malaysia
  'MV', // Maldives
  'ML', // Mali
  'MH', // Marshall Islands
  'MR', // Mauritania
  'FM', // Micronesia
  'MD', // Moldova
  'MC', // Monaco
  'MN', // Mongolia
  'MZ', // Mozambique
  'MM', // Myanmar
  'NA', // Namibia
  'NP', // Nepal
  'NZ', // New Zealand
  'NI', // Nicaragua
  'NE', // Niger
  'NG', // Nigeria
  'KP', // North Korea
  'NO', // Norway
  'OM', // Oman
  'PK', // Pakistan
  'PG', // Papua New Guinea
  'PH', // Philippines
  'QA', // Qatar
  'RU', // Russia
  'KN', // Saint Kitts and Nevis
  'LC', // Saint Lucia
  'VC', // Saint Vincent and the Grenadines
  'WS', // Samoa
  'ST', // São Tomé and Príncipe
  'SA', // Saudi Arabia
  'SN', // Senegal
  'SC', // Seychelles
  'SL', // Sierra Leone
  'SG', // Singapore
  'SB', // Solomon Islands
  'SO', // Somalia
  'KR', // South Korea
  'SS', // South Sudan
  'LK', // Sri Lanka
  'SD', // Sudan
  'SR', // Suriname
  'SY', // Syria
  'TW', // Taiwan
  'TJ', // Tajikistan
  'TZ', // Tanzania
  'TG', // Togo
  'TO', // Tonga
  'TT', // Trinidad and Tobago
  'TN', // Tunisia
  'TM', // Turkmenistan
  'TV', // Tuvalu
  'UG', // Uganda
  'AE', // United Arab Emirates
  'UZ', // Uzbekistan
  'VU', // Vanuatu
  'VA', // Vatican City
  'VE', // Venezuela
  'VN', // Vietnam
  'EH', // Western Sahara
  'YE', // Yemen
  'ZM', // Zambia
  'ZW', // Zimbabwe
];

// Product categories that have shipping restrictions
export enum ProductType {
  VAPING = 'vaping',
  CBD = 'cbd',
  GENERAL = 'general'
}

// Interface for shipping restriction result
export interface ShippingRestriction {
  canShip: boolean;
  restrictedProducts: string[];
  restrictedCategories: ProductType[];
  message?: string;
}

/**
 * Determines product type based on product data
 */
export function getProductType(product: any): ProductType {
  const title = product.title?.toLowerCase() || '';
  const tags = product.tags?.map((tag: string) => tag.toLowerCase()) || [];
  const vendor = product.vendor?.toLowerCase() || '';
  const productType = product.productType?.toLowerCase() || '';
  
  // Check for CBD products
  if (
    title.includes('cbd') || 
    tags.includes('cbd') || 
    vendor.includes('cbd') ||
    productType.includes('cbd')
  ) {
    return ProductType.CBD;
  }
  
  // Check for vaping products (including reusables and prefilled systems)
  if (
    title.includes('vape') || 
    title.includes('e-liquid') || 
    title.includes('reusable') ||
    title.includes('prefilled') ||
    tags.includes('vaping') || 
    tags.includes('e-liquid') || 
    tags.includes('reusables') ||
    tags.includes('prefilled') ||
    vendor.includes('vape') ||
    productType.includes('vaping') ||
    productType.includes('e-liquid') ||
    productType.includes('reusables') ||
    productType.includes('prefilled')
  ) {
    return ProductType.VAPING;
  }
  
  return ProductType.GENERAL;
}

/**
 * Checks if a product can be shipped to a specific country
 */
export function canShipProductToCountry(product: any, countryCode: string): boolean {
  const productType = getProductType(product);
  
  switch (productType) {
    case ProductType.VAPING:
      return !VAPING_RESTRICTED_COUNTRIES.includes(countryCode.toUpperCase());
    case ProductType.CBD:
      return !CBD_RESTRICTED_COUNTRIES.includes(countryCode.toUpperCase());
    case ProductType.GENERAL:
      return true;
    default:
      return true;
  }
}

/**
 * Checks shipping restrictions for a cart with multiple products
 */
export function checkCartShippingRestrictions(
  cartItems: any[], 
  countryCode: string
): ShippingRestriction {
  if (!countryCode) {
    return { canShip: true, restrictedProducts: [], restrictedCategories: [] };
  }
  
  const restrictedProducts: string[] = [];
  const restrictedCategories: Set<ProductType> = new Set();
  
  for (const item of cartItems) {
    const product = item.merchandise?.product || item.product || item;
    
    if (!canShipProductToCountry(product, countryCode)) {
      restrictedProducts.push(product.title || product.name || 'Unknown Product');
      restrictedCategories.add(getProductType(product));
    }
  }
  
  const canShip = restrictedProducts.length === 0;
  
  let message = '';
  if (!canShip) {
    const categories = Array.from(restrictedCategories);
    if (categories.includes(ProductType.VAPING) && categories.includes(ProductType.CBD)) {
      message = `Vaping and CBD products cannot be shipped to ${getCountryName(countryCode)}. Please remove these items from your cart to continue.`;
    } else if (categories.includes(ProductType.VAPING)) {
      message = `Vaping products cannot be shipped to ${getCountryName(countryCode)}. Please remove these items from your cart to continue.`;
    } else if (categories.includes(ProductType.CBD)) {
      message = `CBD products cannot be shipped to ${getCountryName(countryCode)}. Please remove these items from your cart to continue.`;
    }
  }
  
  return {
    canShip,
    restrictedProducts,
    restrictedCategories: Array.from(restrictedCategories),
    message
  };
}

/**
 * Helper function to get country name from country code
 */
export function getCountryName(countryCode: string): string {
  const countryNames: Record<string, string> = {
    'AD': 'Andorra',
    'AG': 'Antigua and Barbuda',
    'AR': 'Argentina',
    'AU': 'Australia',
    'BT': 'Bhutan',
    'BR': 'Brazil',
    'BN': 'Brunei',
    'KH': 'Cambodia',
    'CN': 'China',
    'CU': 'Cuba',
    'DK': 'Denmark',
    'DM': 'Dominica',
    'TL': 'East Timor',
    'ET': 'Ethiopia',
    'FI': 'Finland',
    'GM': 'Gambia',
    'GH': 'Ghana',
    'IN': 'India',
    'IR': 'Iran',
    'IQ': 'Iraq',
    'JP': 'Japan',
    'LB': 'Lebanon',
    'MY': 'Malaysia',
    'MV': 'Maldives',
    'MU': 'Mauritius',
    'MX': 'Mexico',
    'NL': 'Netherlands',
    'NI': 'Nicaragua',
    'KP': 'North Korea',
    'OM': 'Oman',
    'PS': 'Palestine',
    'QA': 'Qatar',
    'WS': 'Samoa',
    'SC': 'Seychelles',
    'SG': 'Singapore',
    'SB': 'Solomon Islands',
    'ZA': 'South Africa',
    'LK': 'Sri Lanka',
    'SY': 'Syria',
    'TW': 'Taiwan',
    'TH': 'Thailand',
    'TO': 'Tonga',
    'TR': 'Turkey',
    'TM': 'Turkmenistan',
    'UG': 'Uganda',
    'UY': 'Uruguay',
    'VU': 'Vanuatu',
    'VE': 'Venezuela',
    'EH': 'Western Sahara',
    'US': 'United States',
    'CA': 'Canada',
    'GB': 'United Kingdom',
    'DE': 'Germany',
    'FR': 'France',
    'IT': 'Italy',
    'ES': 'Spain',
    // Add more as needed
  };
  
  return countryNames[countryCode.toUpperCase()] || countryCode;
} 