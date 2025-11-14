/**
 * Database Module Main Export
 * Centralized exports for all database operations
 */

// Database initialization and utilities
export { initDB, getDB, closeDB, deleteDatabase, generateId } from './db';

// Schema and constants
export { DB_NAME, DB_VERSION, STORES, SCHEMA, STATUS } from './schema';

// Client operations
export {
  createClient,
  getClient,
  getAllClients,
  updateClient,
  deleteClient,
  searchClientsByName,
  getClientsByPhone,
  getClientsByEmail,
} from './clients';

// Estimate operations
export {
  createEstimate,
  getEstimate,
  getAllEstimates,
  updateEstimate,
  deleteEstimate,
  getEstimatesByClient,
  getEstimatesByStatus,
  updateEstimateStatus,
  convertEstimateToInvoice,
} from './estimates';

// Invoice operations
export {
  createInvoice,
  getInvoice,
  getAllInvoices,
  updateInvoice,
  deleteInvoice,
  getInvoicesByClient,
  getInvoicesByStatus,
  getInvoicesByEstimate,
  updateInvoiceStatus,
  markInvoiceAsPaid,
  getUnpaidInvoices,
  getPaidInvoices,
} from './invoices';

// Sync and backup operations
export {
  exportAllData,
  downloadDataAsJSON,
  importData,
  importDataFromFile,
  clearAllData,
  getDatabaseStats,
  createShareableBackup,
  restoreFromShareableBackup,
} from './sync';
