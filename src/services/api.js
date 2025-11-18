import axios from 'axios';

// Determine the base URL based on environment
// Production (Vercel) backend URL
const PRODUCTION_API_URL = 'https://heart-smiles-backend-deployment-ipk2dq43h-sara-devis-projects.vercel.app';
// Local development URL
const LOCAL_API_URL = 'http://localhost:5001/api';

// Helper function to normalize URL (remove duplicate https://, remove trailing slashes)
const normalizeURL = (url) => {
  if (!url) return url;
  // Remove duplicate https://
  let normalized = url.replace(/https?:\/\/https?:\/\//g, 'https://');
  // Ensure it starts with http:// or https://
  if (!normalized.match(/^https?:\/\//)) {
    normalized = 'https://' + normalized.replace(/^https?:\/\//, '');
  }
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');
  return normalized;
};

// Use environment variable if set, otherwise use production URL in production, localhost in development
const envURL = process.env.REACT_APP_API_BASE_URL;
const baseURL = envURL ? normalizeURL(envURL) : 
  (process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : LOCAL_API_URL);

console.log('API Base URL configured as:', baseURL);
console.log('Environment:', process.env.NODE_ENV);

const api = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  timeout: 10000 // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hs_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log('API Request:', config.method?.toUpperCase(), `${config.baseURL}${config.url}`, config.data);
  return config;
}, (error) => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    console.error('API Error Code:', error.code);
    console.error('API Error Message:', error.message);
    console.error('API Request URL:', error.config?.baseURL, error.config?.url);
    
    // Log network errors specifically
    if (!error.response) {
      console.error('Network Error - No response from server');
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        config: error.config
      });
    }
    
    // Handle authentication errors (401)
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.error || '';
      
      // Check if it's a token-related error (expired, invalid, etc.)
      if (errorMessage.includes('expired') || 
          errorMessage.includes('Token expired') || 
          errorMessage.includes('Invalid token') ||
          errorMessage.includes('Access token required')) {
        // Clear token and user data
        localStorage.removeItem('hs_token');
        localStorage.removeItem('hs_user');
        
        // Dispatch custom event to notify AuthContext
        window.dispatchEvent(new CustomEvent('auth:token-expired'));
        
        // Redirect to login page (only if not already on login/landing)
        if (window.location.pathname !== '/login' && window.location.pathname !== '/landing') {
          const redirectParam = errorMessage.includes('expired') ? '?expired=true' : '?invalid=true';
          window.location.href = `/login${redirectParam}`;
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const loginUser = (email, password) => api.post('/api/auth/login', { email, password });
export const registerUser = (payload) => {
  console.log('API: Making registration request to:', api.defaults.baseURL + '/api/auth/register');
  console.log('API: Payload:', payload);
  return api.post('/api/auth/register', payload);
};

// Participants
export const fetchParticipants = () => api.get('/api/participants');
export const fetchParticipantById = (id) => api.get(`/api/participants/${id}`);
export const createParticipant = (payload) => api.post('/api/participants', payload);
export const updateParticipant = (id, payload) => api.put(`/api/participants/${id}`, payload);
export const deleteParticipant = (id) => api.delete(`/api/participants/${id}`);
export const addParticipantNote = (id, noteData) => api.post(`/api/participants/${id}/notes`, noteData);
export const deleteParticipantNote = (id, noteId) => api.delete(`/api/participants/${id}/notes/${noteId}`);
export const uploadImage = (formData) => api.post('/api/upload/single', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const addParticipantPhoto = async (id, { type, imageData, uploadedAt, caption, activity, programName }) => {
  if (type === 'headshot') {
    return api.put(`/api/participants/${id}/profile-photo`, { imageData });
  } else {
    return api.post(`/api/participants/${id}/program-photo`, { imageData, uploadedAt, caption, activity, programName });
  }
};
export const deleteParticipantPhoto = (id, photoId) => api.delete(`/api/participants/${id}/program-photo/${photoId}`);

// Programs
export const fetchPrograms = () => api.get('/api/programs');
// Fetch single program by ID
export const fetchProgramById = (id) => api.get(`/api/programs/${id}`);
// Fetch single program by name
export const fetchProgramByName = (name) =>
  api.get(`/api/programs/name/${encodeURIComponent(name)}`);
// Create new program
export const createProgram = (payload) => api.post('/api/programs', payload);
// Update program by ID
export const updateProgramById = (id, payload) => api.put(`/api/programs/${id}`, payload);
// Update program by name
export const updateProgram = (name, payload) =>
  api.put(`/api/programs/name/${encodeURIComponent(name)}`, payload);
// Delete program by ID
export const deleteProgramById = (id) => api.delete(`/api/programs/${id}`);
// Delete program by name (fetches by name first, then deletes by ID)
export const deleteProgram = async (name) => {
  // First fetch the program by name to get its ID
  const programResponse = await fetchProgramByName(name);
  const programId = programResponse.data.program.id;
  // Then delete by ID
  return api.delete(`/api/programs/${programId}`);
};
// Add a participant to a program by name
export const addParticipant = (programName, participantData) =>
  api.post(`/api/programs/name/${encodeURIComponent(programName)}/participants`, participantData);
// Remove a participant from a program by name
export const removeParticipant = (programName, participantId) =>
  api.delete(`/api/programs/name/${encodeURIComponent(programName)}/participants/${participantId}`);
// Remove participant from program (for participant edit)
export const removeParticipantFromProgram = (participantId, programId) =>
  api.delete(`/api/participants/${participantId}/programs/${programId}`);
// Add participant to program (for participant edit)
export const addParticipantToProgram = (participantId, programId) =>
  api.post(`/api/participants/${participantId}/programs/${programId}`);

// Staff
export const fetchStaff = () => api.get('/api/staff');
export const deleteStaff = (id) => api.delete(`/api/staff/${id}`);

// Import/Export
export const exportParticipantsCsv = () => api.get('/api/export/participants', { responseType: 'blob' });
export const importParticipantsFile = (file, dryRun = true) => {
  const form = new FormData();
  form.append('file', file);
  form.append('dryRun', String(dryRun));
  return api.post('/api/import/participants', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};