export const API_BASE = import.meta.env.VITE_API_BASE_URL as string;


export const APP_CONFIG = {
  name: 'Civic Reporter',
  description: 'Report & track community issues',
  version: '1.0.0',
} as const;

// backend: these are the api endpoints you need to create
// update the base url when you deploy your backend server
export const API_ENDPOINTS = {
  issues: '/api/issues', // crud operations for issues
  auth: '/api/auth', // login/logout/register endpoints
  users: '/api/users', // user management endpoints
} as const;

// add your backend base url here when ready
// export const API_BASE_URL = 'https://backendurl.com';

export const STORAGE_KEYS = {
  user: 'civic-user',
  issues: 'civic-issues',
} as const;

export const ISSUE_CATEGORIES = [
  'Roads & Potholes',
  'Street Lighting',
  'Sanitation',
  'Public Transportation',
  'Parks & Recreation',
  'Traffic Signals',
  'Sidewalks',
  'Drainage',
  'Other'
] as const;

export const ISSUE_STATUSES = {
  SUBMITTED: 'submitted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 60000,
} as const;