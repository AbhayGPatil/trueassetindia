/**
 * Format price to Indian currency format
 * Converts: 10000000 -> "₹1.00 Cr"
 *           850000 -> "₹85.0 Lac"
 *           500000 -> "₹5.00 Lac"
 */
export const formatIndianCurrency = (price) => {
  if (!price || price === 0) return '₹0';

  const crore = 10000000;
  const lakh = 100000;

  if (price >= crore) {
    const croreValue = (price / crore).toFixed(2);
    return `₹${croreValue} Cr`;
  }

  if (price >= lakh) {
    const lakhValue = (price / lakh).toFixed(1);
    return `₹${lakhValue} Lac`;
  }

  return `₹${price.toLocaleString('en-IN')}`;
};

/**
 * Format area with proper units
 */
export const formatArea = (area, unit = 'sqft') => {
  if (!area) return '—';
  return `${area.toLocaleString('en-IN')} ${unit}`;
};

/**
 * Create clean specs string for list view
 * Example: "3 BHK • 2 Baths • 1,199 sqft"
 */
export const createSpecsString = (beds, baths, area) => {
  const specs = [];
  if (beds > 0) specs.push(`${beds} BHK`);
  if (baths > 0) specs.push(`${baths} Bath${baths > 1 ? 's' : ''}`);
  if (area > 0) specs.push(`${area.toLocaleString('en-IN')} sqft`);
  return specs.join(' • ');
};
