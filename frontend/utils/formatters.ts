/**
 * Format number to Indian currency format (₹)
 */
export const formatCurrency = (value: number, decimals: number = 0): string => {
  if (isNaN(value) || !isFinite(value)) return '₹0';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  // Convert to Indian numbering system
  const formatted = absValue.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
  
  return `${sign}₹${formatted}`;
};

/**
 * Format number with commas (Indian system)
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  if (isNaN(value) || !isFinite(value)) return '0';
  
  return value.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
};

/**
 * Parse formatted currency string to number
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[₹,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  if (isNaN(value) || !isFinite(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
