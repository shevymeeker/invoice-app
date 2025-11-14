/**
 * CRUD Operations for Estimates
 */

import { performTransaction, generateId } from './db';
import { STORES, STATUS } from './schema';

/**
 * Calculate total from items array
 * @param {Array} items - Array of items with quantity and price
 * @returns {number} Total amount
 */
const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    return sum + (item.quantity * item.price);
  }, 0);
};

/**
 * Create a new estimate
 * @param {Object} estimateData - Estimate information
 * @param {string} estimateData.clientId - Client ID (required)
 * @param {Array} estimateData.items - Array of line items
 * @param {string} estimateData.status - Status (optional, defaults to 'draft')
 * @returns {Promise<Object>} The created estimate with generated estimateId
 */
export const createEstimate = async (estimateData) => {
  if (!estimateData.clientId) {
    throw new Error('clientId is required to create an estimate');
  }

  if (!estimateData.items || !Array.isArray(estimateData.items)) {
    throw new Error('items array is required');
  }

  const estimate = {
    estimateId: generateId(),
    clientId: estimateData.clientId,
    items: estimateData.items,
    total: calculateTotal(estimateData.items),
    createdAt: Date.now(),
    status: estimateData.status || STATUS.ESTIMATE.DRAFT,
  };

  await performTransaction(STORES.ESTIMATES, 'readwrite', (store) => {
    return store.add(estimate);
  });

  return estimate;
};

/**
 * Get an estimate by ID
 * @param {string} estimateId - The estimate ID
 * @returns {Promise<Object|null>} The estimate object or null if not found
 */
export const getEstimate = async (estimateId) => {
  return performTransaction(STORES.ESTIMATES, 'readonly', (store) => {
    return store.get(estimateId);
  });
};

/**
 * Get all estimates
 * @returns {Promise<Array>} Array of all estimates
 */
export const getAllEstimates = async () => {
  return performTransaction(STORES.ESTIMATES, 'readonly', (store) => {
    return store.getAll();
  });
};

/**
 * Update an estimate
 * @param {string} estimateId - The estimate ID to update
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} The updated estimate
 */
export const updateEstimate = async (estimateId, updates) => {
  const estimate = await getEstimate(estimateId);

  if (!estimate) {
    throw new Error(`Estimate with ID ${estimateId} not found`);
  }

  const updatedEstimate = {
    ...estimate,
    ...updates,
    estimateId, // Ensure ID doesn't change
    createdAt: estimate.createdAt, // Preserve creation date
  };

  // Recalculate total if items were updated
  if (updates.items) {
    updatedEstimate.total = calculateTotal(updates.items);
  }

  await performTransaction(STORES.ESTIMATES, 'readwrite', (store) => {
    return store.put(updatedEstimate);
  });

  return updatedEstimate;
};

/**
 * Delete an estimate
 * @param {string} estimateId - The estimate ID to delete
 * @returns {Promise<void>}
 */
export const deleteEstimate = async (estimateId) => {
  return performTransaction(STORES.ESTIMATES, 'readwrite', (store) => {
    return store.delete(estimateId);
  });
};

/**
 * Get all estimates for a specific client
 * @param {string} clientId - The client ID
 * @returns {Promise<Array>} Array of estimates for the client
 */
export const getEstimatesByClient = async (clientId) => {
  const allEstimates = await getAllEstimates();

  return allEstimates.filter(estimate => estimate.clientId === clientId);
};

/**
 * Get estimates by status
 * @param {string} status - The status to filter by (draft|sent|approved|rejected)
 * @returns {Promise<Array>} Array of estimates with the specified status
 */
export const getEstimatesByStatus = async (status) => {
  const allEstimates = await getAllEstimates();

  return allEstimates.filter(estimate => estimate.status === status);
};

/**
 * Update estimate status
 * @param {string} estimateId - The estimate ID
 * @param {string} newStatus - The new status
 * @returns {Promise<Object>} The updated estimate
 */
export const updateEstimateStatus = async (estimateId, newStatus) => {
  const validStatuses = Object.values(STATUS.ESTIMATE);

  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}. Must be one of: ${validStatuses.join(', ')}`);
  }

  return updateEstimate(estimateId, { status: newStatus });
};

/**
 * Convert an estimate to an invoice
 * @param {string} estimateId - The estimate ID to convert
 * @returns {Promise<Object>} The estimate data ready for invoice creation
 */
export const convertEstimateToInvoice = async (estimateId) => {
  const estimate = await getEstimate(estimateId);

  if (!estimate) {
    throw new Error(`Estimate with ID ${estimateId} not found`);
  }

  return {
    clientId: estimate.clientId,
    estimateId: estimate.estimateId,
    items: estimate.items,
  };
};
