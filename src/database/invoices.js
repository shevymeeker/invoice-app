/**
 * CRUD Operations for Invoices
 */

import { performTransaction, generateId } from './db';
import { STORES, STATUS } from './schema';
import { BUSINESS_INFO } from '../config/business.js';

/**
 * Calculate invoice totals including tax
 * @param {Array} items - Array of items with quantity and price
 * @returns {Object} Object with subtotal, taxRate, taxAmount, and total
 */
const calculateInvoiceTotals = (items) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity * item.price);
  }, 0);

  const taxRate = BUSINESS_INFO.salesTaxRate || 0;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxRate,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

/**
 * Create a new invoice
 * @param {Object} invoiceData - Invoice information
 * @param {string} invoiceData.clientId - Client ID (required)
 * @param {string} invoiceData.estimateId - Estimate ID (optional)
 * @param {Array} invoiceData.items - Array of line items
 * @param {string} invoiceData.status - Status (optional, defaults to 'draft')
 * @returns {Promise<Object>} The created invoice with generated invoiceId
 */
export const createInvoice = async (invoiceData) => {
  if (!invoiceData.clientId) {
    throw new Error('clientId is required to create an invoice');
  }

  if (!invoiceData.items || !Array.isArray(invoiceData.items)) {
    throw new Error('items array is required');
  }

  const totals = calculateInvoiceTotals(invoiceData.items);

  const invoice = {
    invoiceId: generateId(),
    clientId: invoiceData.clientId,
    estimateId: invoiceData.estimateId || null,
    items: invoiceData.items,
    subtotal: totals.subtotal,
    taxRate: totals.taxRate,
    taxAmount: totals.taxAmount,
    total: totals.total,
    createdAt: Date.now(),
    status: invoiceData.status || STATUS.INVOICE.DRAFT,
  };

  await performTransaction(STORES.INVOICES, 'readwrite', (store) => {
    return store.add(invoice);
  });

  return invoice;
};

/**
 * Get an invoice by ID
 * @param {string} invoiceId - The invoice ID
 * @returns {Promise<Object|null>} The invoice object or null if not found
 */
export const getInvoice = async (invoiceId) => {
  return performTransaction(STORES.INVOICES, 'readonly', (store) => {
    return store.get(invoiceId);
  });
};

/**
 * Get all invoices
 * @returns {Promise<Array>} Array of all invoices
 */
export const getAllInvoices = async () => {
  return performTransaction(STORES.INVOICES, 'readonly', (store) => {
    return store.getAll();
  });
};

/**
 * Update an invoice
 * @param {string} invoiceId - The invoice ID to update
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} The updated invoice
 */
export const updateInvoice = async (invoiceId, updates) => {
  const invoice = await getInvoice(invoiceId);

  if (!invoice) {
    throw new Error(`Invoice with ID ${invoiceId} not found`);
  }

  const updatedInvoice = {
    ...invoice,
    ...updates,
    invoiceId, // Ensure ID doesn't change
    createdAt: invoice.createdAt, // Preserve creation date
  };

  // Recalculate totals if items were updated
  if (updates.items) {
    const totals = calculateInvoiceTotals(updates.items);
    updatedInvoice.subtotal = totals.subtotal;
    updatedInvoice.taxRate = totals.taxRate;
    updatedInvoice.taxAmount = totals.taxAmount;
    updatedInvoice.total = totals.total;
  }

  await performTransaction(STORES.INVOICES, 'readwrite', (store) => {
    return store.put(updatedInvoice);
  });

  return updatedInvoice;
};

/**
 * Delete an invoice
 * @param {string} invoiceId - The invoice ID to delete
 * @returns {Promise<void>}
 */
export const deleteInvoice = async (invoiceId) => {
  return performTransaction(STORES.INVOICES, 'readwrite', (store) => {
    return store.delete(invoiceId);
  });
};

/**
 * Get all invoices for a specific client
 * @param {string} clientId - The client ID
 * @returns {Promise<Array>} Array of invoices for the client
 */
export const getInvoicesByClient = async (clientId) => {
  const allInvoices = await getAllInvoices();

  return allInvoices.filter(invoice => invoice.clientId === clientId);
};

/**
 * Get invoices by status
 * @param {string} status - The status to filter by (draft|sent|paid)
 * @returns {Promise<Array>} Array of invoices with the specified status
 */
export const getInvoicesByStatus = async (status) => {
  const allInvoices = await getAllInvoices();

  return allInvoices.filter(invoice => invoice.status === status);
};

/**
 * Update invoice status
 * @param {string} invoiceId - The invoice ID
 * @param {string} newStatus - The new status
 * @returns {Promise<Object>} The updated invoice
 */
export const updateInvoiceStatus = async (invoiceId, newStatus) => {
  const validStatuses = Object.values(STATUS.INVOICE);

  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}. Must be one of: ${validStatuses.join(', ')}`);
  }

  return updateInvoice(invoiceId, { status: newStatus });
};

/**
 * Get invoices created from a specific estimate
 * @param {string} estimateId - The estimate ID
 * @returns {Promise<Array>} Array of invoices linked to the estimate
 */
export const getInvoicesByEstimate = async (estimateId) => {
  const allInvoices = await getAllInvoices();

  return allInvoices.filter(invoice => invoice.estimateId === estimateId);
};

/**
 * Mark an invoice as paid
 * @param {string} invoiceId - The invoice ID
 * @returns {Promise<Object>} The updated invoice
 */
export const markInvoiceAsPaid = async (invoiceId) => {
  return updateInvoiceStatus(invoiceId, STATUS.INVOICE.PAID);
};

/**
 * Get unpaid invoices
 * @returns {Promise<Array>} Array of unpaid invoices (draft or sent status)
 */
export const getUnpaidInvoices = async () => {
  const allInvoices = await getAllInvoices();

  return allInvoices.filter(invoice =>
    invoice.status === STATUS.INVOICE.DRAFT ||
    invoice.status === STATUS.INVOICE.SENT
  );
};

/**
 * Get paid invoices
 * @returns {Promise<Array>} Array of paid invoices
 */
export const getPaidInvoices = async () => {
  return getInvoicesByStatus(STATUS.INVOICE.PAID);
};
