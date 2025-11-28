/**
 * Business Information for Owensboro Mowing Company
 * This information is permanent and will always appear on invoices and estimates
 */

export const BUSINESS_INFO = {
  name: 'Owensboro Mowing Company',
  address: 'Owensboro, Kentucky 42303',
  phone: '270.222.9613 or 270.499.7758',
  website: 'owensboromowingcompany.com',
  email: '', // Add email if available
  ein: '93-2058075',
  salesTaxRate: 0.06, // 6% sales tax rate - update this to match your local tax rate
};

/**
 * Get the complete business information
 * @returns {Object} Business information object
 */
export const getBusinessInfo = () => {
  return { ...BUSINESS_INFO };
};

/**
 * Format business info for PDF display
 * @returns {Object} Formatted business info
 */
export const getFormattedBusinessInfo = () => {
  return {
    name: BUSINESS_INFO.name,
    addressLine1: BUSINESS_INFO.address,
    phone: BUSINESS_INFO.phone,
    website: BUSINESS_INFO.website,
    ein: `EIN: ${BUSINESS_INFO.ein}`,
  };
};
