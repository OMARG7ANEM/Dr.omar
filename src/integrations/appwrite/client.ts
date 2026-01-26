import { Client, Account, Databases, Storage } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6977a612001b04e10dd8');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// IDs established in the plan
export const DB_ID = 'stats-hub';
export const COLLECTION_PROJECTS = 'projects';
export const COLLECTION_CONTACTS = 'contact_submissions';
export const BUCKET_IMAGES = 'project-assets';
