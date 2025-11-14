/**
 * IndexedDB Database Initialization and Connection Manager
 */

import { DB_NAME, DB_VERSION, STORES, SCHEMA } from './schema';

let dbInstance = null;

/**
 * Initialize the IndexedDB database
 * Creates object stores and indexes if they don't exist
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create clients store
      if (!db.objectStoreNames.contains(STORES.CLIENTS)) {
        const clientStore = db.createObjectStore(STORES.CLIENTS, {
          keyPath: SCHEMA.clients.keyPath,
        });

        // Create indexes for clients
        SCHEMA.clients.indexes.forEach(index => {
          clientStore.createIndex(index.name, index.keyPath, { unique: index.unique });
        });
      }

      // Create estimates store
      if (!db.objectStoreNames.contains(STORES.ESTIMATES)) {
        const estimateStore = db.createObjectStore(STORES.ESTIMATES, {
          keyPath: SCHEMA.estimates.keyPath,
        });

        // Create indexes for estimates
        SCHEMA.estimates.indexes.forEach(index => {
          estimateStore.createIndex(index.name, index.keyPath, { unique: index.unique });
        });
      }

      // Create invoices store
      if (!db.objectStoreNames.contains(STORES.INVOICES)) {
        const invoiceStore = db.createObjectStore(STORES.INVOICES, {
          keyPath: SCHEMA.invoices.keyPath,
        });

        // Create indexes for invoices
        SCHEMA.invoices.indexes.forEach(index => {
          invoiceStore.createIndex(index.name, index.keyPath, { unique: index.unique });
        });
      }
    };
  });
};

/**
 * Get the database instance
 * Initializes if not already initialized
 */
export const getDB = async () => {
  if (!dbInstance) {
    await initDB();
  }
  return dbInstance;
};

/**
 * Generic function to perform a transaction
 */
export const performTransaction = async (storeName, mode, operation) => {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);

    const request = operation(store);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * Generate a unique ID (simple UUID v4 implementation)
 */
export const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Close the database connection
 */
export const closeDB = () => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
};

/**
 * Delete the entire database (useful for testing or reset)
 */
export const deleteDatabase = () => {
  return new Promise((resolve, reject) => {
    closeDB();
    const request = indexedDB.deleteDatabase(DB_NAME);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};
