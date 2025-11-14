/**
 * Database Schema Definition for Invoice App
 * Using IndexedDB for offline-first capability
 */

export const DB_NAME = 'InvoiceAppDB';
export const DB_VERSION = 1;

/**
 * Database structure definition
 */
export const STORES = {
  CLIENTS: 'clients',
  ESTIMATES: 'estimates',
  INVOICES: 'invoices',
};

/**
 * Schema definition for each object store
 */
export const SCHEMA = {
  clients: {
    keyPath: 'clientId',
    autoIncrement: false, // We'll generate UUIDs
    indexes: [
      { name: 'name', keyPath: 'name', unique: false },
      { name: 'email', keyPath: 'email', unique: false },
      { name: 'phone', keyPath: 'phone', unique: false },
    ],
    structure: {
      clientId: 'string (UUID)',
      name: 'string',
      phone: 'string',
      email: 'string',
      address: 'string',
    },
  },
  estimates: {
    keyPath: 'estimateId',
    autoIncrement: false,
    indexes: [
      { name: 'clientId', keyPath: 'clientId', unique: false },
      { name: 'status', keyPath: 'status', unique: false },
      { name: 'createdAt', keyPath: 'createdAt', unique: false },
    ],
    structure: {
      estimateId: 'string (UUID)',
      clientId: 'string (foreign key to clients)',
      items: 'array of { description, quantity, price }',
      total: 'number',
      createdAt: 'timestamp',
      status: 'string (draft|sent|approved|rejected)',
    },
  },
  invoices: {
    keyPath: 'invoiceId',
    autoIncrement: false,
    indexes: [
      { name: 'clientId', keyPath: 'clientId', unique: false },
      { name: 'estimateId', keyPath: 'estimateId', unique: false },
      { name: 'status', keyPath: 'status', unique: false },
      { name: 'createdAt', keyPath: 'createdAt', unique: false },
    ],
    structure: {
      invoiceId: 'string (UUID)',
      clientId: 'string (foreign key to clients)',
      estimateId: 'string (optional, foreign key to estimates)',
      items: 'array of { description, quantity, price }',
      total: 'number',
      createdAt: 'timestamp',
      status: 'string (draft|sent|paid)',
    },
  },
};

/**
 * Valid status values for estimates and invoices
 */
export const STATUS = {
  ESTIMATE: {
    DRAFT: 'draft',
    SENT: 'sent',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },
  INVOICE: {
    DRAFT: 'draft',
    SENT: 'sent',
    PAID: 'paid',
  },
};
