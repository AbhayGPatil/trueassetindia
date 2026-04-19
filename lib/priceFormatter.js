/**
 * Format price from raw numbers to Indian numbering shorthand
 * e.g., 26500000 -> "2.65 Cr"
 * e.g., 550000 -> "55 L"
 */
export function formatPrice(price) {
  if (!price || price === 0) return "₹0";
  
  if (price >= 10000000) {
    // Crores (≥ 1 Cr)
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    // Lakhs (≥ 1 L)
    return `₹${(price / 100000).toFixed(2)} L`;
  } else if (price >= 1000) {
    // Thousands (≥ 1K)
    return `₹${(price / 1000).toFixed(2)} K`;
  } else {
    return `₹${price.toLocaleString('en-IN')}`;
  }
}

/**
 * Format area in sq.ft. or sq.m.
 */
export function formatArea(area, unit = 'sq.ft') {
  if (!area) return '0 ' + unit;
  return `${area.toLocaleString('en-IN')} ${unit}`;
}

/**
 * Generate property header string
 * e.g., "2.65 Cr | 3 BHK, 1200 sq.ft Flat for Sale in Prestige Somerville, Whitefield, Bangalore"
 */
export function generatePropertyHeader(property) {
  const price = formatPrice(property.price);
  const bhk = property.bedrooms ? `${property.bedrooms} BHK` : '';
  const area = property.area ? formatArea(property.area) : '';
  const type = property.type === 'sell' ? 'for Sale' : 'for Rent';
  const project = property.projectName || '';
  const location = property.location || '';
  
  const specs = [bhk, area].filter(Boolean).join(', ');
  const flatType = property.propertyType || 'Property';
  
  return `${price} | ${specs} ${flatType} ${type} in ${project ? project + ', ' : ''}${location}`;
}
