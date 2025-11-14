# Invoice App Database

This module provides an offline-first database solution for the Invoice App using IndexedDB. It includes complete CRUD operations for clients, estimates, and invoices, plus data sync capabilities.

## Database Schema

### Clients Table
- `clientId` (string, UUID) - Auto-generated unique identifier
- `name` (string) - Client name
- `phone` (string) - Phone number
- `email` (string) - Email address
- `address` (string) - Physical address

### Estimates Table
- `estimateId` (string, UUID) - Auto-generated unique identifier
- `clientId` (string) - Links to the client
- `items` (array) - Array of `{ description, quantity, price }`
- `total` (number) - Auto-calculated total
- `createdAt` (timestamp) - Creation timestamp
- `status` (string) - One of: `'draft'`, `'sent'`, `'approved'`, `'rejected'`

### Invoices Table
- `invoiceId` (string, UUID) - Auto-generated unique identifier
- `clientId` (string) - Links to the client
- `estimateId` (string, optional) - Links to original estimate
- `items` (array) - Array of `{ description, quantity, price }`
- `total` (number) - Auto-calculated total
- `createdAt` (timestamp) - Creation timestamp
- `status` (string) - One of: `'draft'`, `'sent'`, `'paid'`

## Usage

### Initialize the Database

```javascript
import { initDB } from './database';

// Initialize on app startup
await initDB();
```

### Client Operations

```javascript
import {
  createClient,
  getAllClients,
  updateClient,
  searchClientsByName
} from './database';

// Create a new client
const client = await createClient({
  name: 'John Doe',
  phone: '555-1234',
  email: 'john@example.com',
  address: '123 Main St'
});

// Get all clients
const clients = await getAllClients();

// Search clients by name
const results = await searchClientsByName('John');

// Update a client
await updateClient(client.clientId, {
  phone: '555-5678'
});
```

### Estimate Operations

```javascript
import {
  createEstimate,
  getEstimatesByClient,
  updateEstimateStatus,
  convertEstimateToInvoice,
  STATUS
} from './database';

// Create a new estimate
const estimate = await createEstimate({
  clientId: 'client-uuid',
  items: [
    { description: 'Lawn Mowing', quantity: 1, price: 50.00 },
    { description: 'Edging', quantity: 1, price: 25.00 }
  ],
  status: STATUS.ESTIMATE.DRAFT
});

// Get all estimates for a client
const clientEstimates = await getEstimatesByClient('client-uuid');

// Update estimate status
await updateEstimateStatus(estimate.estimateId, STATUS.ESTIMATE.SENT);

// Convert estimate to invoice
const invoiceData = await convertEstimateToInvoice(estimate.estimateId);
```

### Invoice Operations

```javascript
import {
  createInvoice,
  getInvoicesByClient,
  markInvoiceAsPaid,
  getUnpaidInvoices,
  STATUS
} from './database';

// Create a new invoice
const invoice = await createInvoice({
  clientId: 'client-uuid',
  estimateId: 'estimate-uuid', // optional
  items: [
    { description: 'Lawn Mowing', quantity: 1, price: 50.00 },
    { description: 'Trimming', quantity: 1, price: 30.00 }
  ],
  status: STATUS.INVOICE.DRAFT
});

// Get all invoices for a client
const clientInvoices = await getInvoicesByClient('client-uuid');

// Mark invoice as paid
await markInvoiceAsPaid(invoice.invoiceId);

// Get all unpaid invoices
const unpaid = await getUnpaidInvoices();
```

### Data Export/Import

```javascript
import {
  exportAllData,
  downloadDataAsJSON,
  importDataFromFile,
  createShareableBackup,
  restoreFromShareableBackup
} from './database';

// Export all data as JSON
const data = await exportAllData();

// Download as file
await downloadDataAsJSON(); // Uses default filename
await downloadDataAsJSON('my-backup.json'); // Custom filename

// Import from file (merge mode)
const results = await importDataFromFile(file, 'merge');

// Import from file (replace mode - clears existing data first)
const results = await importDataFromFile(file, 'replace');

// Create shareable backup (base64 string for SMS/QR code)
const backupString = await createShareableBackup();

// Restore from shareable backup
await restoreFromShareableBackup(backupString, 'merge');
```

## Business Information

The business information for Owensboro Mowing Company is stored in `/src/config/business.js` and includes:

```javascript
import { getBusinessInfo, getFormattedBusinessInfo } from '../config/business';

// Get business info
const business = getBusinessInfo();
// Returns:
// {
//   name: 'Owensboro Mowing Company',
//   address: 'Owensboro, Kentucky 42303',
//   phone: '270.222.9613 or 270.499.7758',
//   website: 'owensboromowingcompany.com',
//   ein: '93-2058075'
// }

// Get formatted business info (for PDFs)
const formatted = getFormattedBusinessInfo();
```

## Status Constants

Use the provided status constants instead of string literals:

```javascript
import { STATUS } from './database';

// Estimate statuses
STATUS.ESTIMATE.DRAFT      // 'draft'
STATUS.ESTIMATE.SENT       // 'sent'
STATUS.ESTIMATE.APPROVED   // 'approved'
STATUS.ESTIMATE.REJECTED   // 'rejected'

// Invoice statuses
STATUS.INVOICE.DRAFT       // 'draft'
STATUS.INVOICE.SENT        // 'sent'
STATUS.INVOICE.PAID        // 'paid'
```

## Error Handling

All database operations return Promises. Always use try/catch or .catch() for error handling:

```javascript
try {
  const client = await createClient({ name: 'Test Client' });
} catch (error) {
  console.error('Failed to create client:', error);
}
```

## Database Utilities

```javascript
import {
  getDatabaseStats,
  clearAllData,
  deleteDatabase
} from './database';

// Get database statistics
const stats = await getDatabaseStats();
// Returns: { totalClients, totalEstimates, totalInvoices, totalRecords }

// Clear all data (keeps database structure)
await clearAllData();

// Delete entire database
await deleteDatabase();
```

## Integration with React

Example usage in a React component:

```javascript
import React, { useState, useEffect } from 'react';
import { initDB, getAllClients, createClient } from './database';

function ClientList() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Initialize database and load clients
    const loadClients = async () => {
      await initDB();
      const data = await getAllClients();
      setClients(data);
    };

    loadClients();
  }, []);

  const handleAddClient = async (clientData) => {
    const newClient = await createClient(clientData);
    setClients([...clients, newClient]);
  };

  return (
    <div>
      {/* Your component UI */}
    </div>
  );
}
```

## Offline-First Architecture

This database module is designed for offline-first operation:

- All data is stored locally in IndexedDB
- No internet connection required
- Works perfectly for PWA installation
- Data can be exported/imported for device sync
- Optional: Can be integrated with Firebase for cloud backup

## Future Enhancements

Potential additions:
- Firebase real-time sync
- Automatic backup scheduling
- Conflict resolution for multi-device sync
- Search and filtering improvements
- Full-text search capabilities
