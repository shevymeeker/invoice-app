/**
 * CRUD Operations for Clients
 */

import { performTransaction, generateId } from './db';
import { STORES } from './schema';

/**
 * Create a new client
 * @param {Object} clientData - Client information
 * @param {string} clientData.name - Client name
 * @param {string} clientData.phone - Client phone number
 * @param {string} clientData.email - Client email
 * @param {string} clientData.address - Client address
 * @returns {Promise<Object>} The created client with generated clientId
 */
export const createClient = async (clientData) => {
  const client = {
    clientId: generateId(),
    name: clientData.name || '',
    phone: clientData.phone || '',
    email: clientData.email || '',
    address: clientData.address || '',
  };

  await performTransaction(STORES.CLIENTS, 'readwrite', (store) => {
    return store.add(client);
  });

  return client;
};

/**
 * Get a client by ID
 * @param {string} clientId - The client ID
 * @returns {Promise<Object|null>} The client object or null if not found
 */
export const getClient = async (clientId) => {
  return performTransaction(STORES.CLIENTS, 'readonly', (store) => {
    return store.get(clientId);
  });
};

/**
 * Get all clients
 * @returns {Promise<Array>} Array of all clients
 */
export const getAllClients = async () => {
  return performTransaction(STORES.CLIENTS, 'readonly', (store) => {
    return store.getAll();
  });
};

/**
 * Update a client
 * @param {string} clientId - The client ID to update
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} The updated client
 */
export const updateClient = async (clientId, updates) => {
  const client = await getClient(clientId);

  if (!client) {
    throw new Error(`Client with ID ${clientId} not found`);
  }

  const updatedClient = {
    ...client,
    ...updates,
    clientId, // Ensure ID doesn't change
  };

  await performTransaction(STORES.CLIENTS, 'readwrite', (store) => {
    return store.put(updatedClient);
  });

  return updatedClient;
};

/**
 * Delete a client
 * @param {string} clientId - The client ID to delete
 * @returns {Promise<void>}
 */
export const deleteClient = async (clientId) => {
  return performTransaction(STORES.CLIENTS, 'readwrite', (store) => {
    return store.delete(clientId);
  });
};

/**
 * Search clients by name (case-insensitive)
 * @param {string} searchTerm - The search term
 * @returns {Promise<Array>} Array of matching clients
 */
export const searchClientsByName = async (searchTerm) => {
  const allClients = await getAllClients();
  const term = searchTerm.toLowerCase();

  return allClients.filter(client =>
    client.name.toLowerCase().includes(term)
  );
};

/**
 * Get clients by phone number
 * @param {string} phone - The phone number to search for
 * @returns {Promise<Array>} Array of matching clients
 */
export const getClientsByPhone = async (phone) => {
  const allClients = await getAllClients();

  return allClients.filter(client => client.phone === phone);
};

/**
 * Get clients by email
 * @param {string} email - The email to search for
 * @returns {Promise<Array>} Array of matching clients
 */
export const getClientsByEmail = async (email) => {
  const allClients = await getAllClients();

  return allClients.filter(client => client.email === email);
};
