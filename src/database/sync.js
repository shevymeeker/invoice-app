/**
 * Data Export/Import Utilities for Device Synchronization
 */

import { getAllClients } from './clients';
import { getAllEstimates } from './estimates';
import { getAllInvoices } from './invoices';
import { performTransaction } from './db';
import { STORES } from './schema';

/**
 * Export all data from the database
 * @returns {Promise<Object>} All database data in JSON format
 */
export const exportAllData = async () => {
  const [clients, estimates, invoices] = await Promise.all([
    getAllClients(),
    getAllEstimates(),
    getAllInvoices(),
  ]);

  const exportData = {
    version: 1,
    exportDate: new Date().toISOString(),
    data: {
      clients,
      estimates,
      invoices,
    },
    metadata: {
      clientCount: clients.length,
      estimateCount: estimates.length,
      invoiceCount: invoices.length,
    },
  };

  return exportData;
};

/**
 * Export data as a downloadable JSON file
 * @param {string} filename - Optional filename (defaults to invoice-app-backup-YYYY-MM-DD.json)
 */
export const downloadDataAsJSON = async (filename) => {
  const data = await exportAllData();
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const defaultFilename = `invoice-app-backup-${new Date().toISOString().split('T')[0]}.json`;
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import data into the database
 * @param {Object} importData - Data object to import
 * @param {string} mode - Import mode: 'merge' or 'replace'
 * @returns {Promise<Object>} Import results with counts
 */
export const importData = async (importData, mode = 'merge') => {
  if (!importData || !importData.data) {
    throw new Error('Invalid import data format');
  }

  const { clients = [], estimates = [], invoices = [] } = importData.data;

  let results = {
    clients: { imported: 0, skipped: 0, errors: 0 },
    estimates: { imported: 0, skipped: 0, errors: 0 },
    invoices: { imported: 0, skipped: 0, errors: 0 },
  };

  // If replace mode, clear existing data first
  if (mode === 'replace') {
    await clearAllData();
  }

  // Import clients
  for (const client of clients) {
    try {
      await performTransaction(STORES.CLIENTS, 'readwrite', (store) => {
        return mode === 'merge' ? store.put(client) : store.add(client);
      });
      results.clients.imported++;
    } catch (error) {
      if (error.name === 'ConstraintError') {
        results.clients.skipped++;
      } else {
        results.clients.errors++;
        console.error('Error importing client:', error);
      }
    }
  }

  // Import estimates
  for (const estimate of estimates) {
    try {
      await performTransaction(STORES.ESTIMATES, 'readwrite', (store) => {
        return mode === 'merge' ? store.put(estimate) : store.add(estimate);
      });
      results.estimates.imported++;
    } catch (error) {
      if (error.name === 'ConstraintError') {
        results.estimates.skipped++;
      } else {
        results.estimates.errors++;
        console.error('Error importing estimate:', error);
      }
    }
  }

  // Import invoices
  for (const invoice of invoices) {
    try {
      await performTransaction(STORES.INVOICES, 'readwrite', (store) => {
        return mode === 'merge' ? store.put(invoice) : store.add(invoice);
      });
      results.invoices.imported++;
    } catch (error) {
      if (error.name === 'ConstraintError') {
        results.invoices.skipped++;
      } else {
        results.invoices.errors++;
        console.error('Error importing invoice:', error);
      }
    }
  }

  return results;
};

/**
 * Import data from a JSON file
 * @param {File} file - The JSON file to import
 * @param {string} mode - Import mode: 'merge' or 'replace'
 * @returns {Promise<Object>} Import results
 */
export const importDataFromFile = async (file, mode = 'merge') => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        const results = await importData(importData, mode);
        resolve(results);
      } catch (error) {
        reject(new Error(`Failed to import data: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Clear all data from the database
 * @returns {Promise<void>}
 */
export const clearAllData = async () => {
  await Promise.all([
    performTransaction(STORES.CLIENTS, 'readwrite', (store) => store.clear()),
    performTransaction(STORES.ESTIMATES, 'readwrite', (store) => store.clear()),
    performTransaction(STORES.INVOICES, 'readwrite', (store) => store.clear()),
  ]);
};

/**
 * Get database statistics
 * @returns {Promise<Object>} Database statistics
 */
export const getDatabaseStats = async () => {
  const [clients, estimates, invoices] = await Promise.all([
    getAllClients(),
    getAllEstimates(),
    getAllInvoices(),
  ]);

  return {
    totalClients: clients.length,
    totalEstimates: estimates.length,
    totalInvoices: invoices.length,
    totalRecords: clients.length + estimates.length + invoices.length,
  };
};

/**
 * Create a shareable backup string (base64 encoded)
 * Useful for sharing via SMS or QR code
 * @returns {Promise<string>} Base64 encoded backup string
 */
export const createShareableBackup = async () => {
  const data = await exportAllData();
  const jsonString = JSON.stringify(data);
  return btoa(jsonString);
};

/**
 * Restore from a shareable backup string
 * @param {string} backupString - Base64 encoded backup string
 * @param {string} mode - Import mode: 'merge' or 'replace'
 * @returns {Promise<Object>} Import results
 */
export const restoreFromShareableBackup = async (backupString, mode = 'merge') => {
  try {
    const jsonString = atob(backupString);
    const importData = JSON.parse(jsonString);
    return await importData(importData, mode);
  } catch (error) {
    throw new Error(`Failed to restore backup: ${error.message}`);
  }
};
