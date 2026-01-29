/**
 * Parse ISO 8601 duration (PT2H30M) to human readable format (2h 30m)
 * @param {string} duration - ISO 8601 duration string
 * @returns {string} Human readable duration
 */
export const parseDuration = (duration) => {
  if (!duration) return '';
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;
  const hours = match[1] || '0';
  const minutes = match[2] || '0';
  return `${hours}h ${minutes}m`;
};

/**
 * Parse human readable duration (2h 30m) to minutes
 * @param {string} duration - Human readable duration string
 * @returns {number} Duration in minutes
 */
export const getDurationMinutes = (duration) => {
  if (!duration) return 0;
  const match = duration.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return 0;
  return parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
};

/**
 * Format ISO datetime to time string (2024-01-15T10:30:00 -> 10:30)
 * @param {string} dateTime - ISO datetime string
 * @returns {string} Time in HH:MM format
 */
export const formatTime = (dateTime) => {
  if (!dateTime) return '';
  return dateTime.split('T')[1]?.substring(0, 5) || '';
};

/**
 * Format price with currency symbol
 * @param {number} price - Price value
 * @param {string} currencyCode - Currency code (USD, EUR, etc.)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currencyCode = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format date to display format
 * @param {Date|string} date - Date object or ISO string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = { month: 'short', day: 'numeric' }) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Get stops label from number of stops
 * @param {number} stops - Number of stops
 * @returns {string} Human readable stops label
 */
export const getStopsLabel = (stops) => {
  if (stops === 0) return 'Nonstop';
  if (stops === 1) return '1 stop';
  return `${stops} stops`;
};

