// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth ---
export const login = (credentials) => apiClient.post('/auth/login', credentials);
export const register = (userData) => apiClient.post('/auth/register', userData);
export const getMe = () => apiClient.get('/auth/me');

// --- Dashboard ---
export const getSummaryStats = (params) => apiClient.get('/dashboard/summary', { params });
export const getLeadsOverTime = (params) => apiClient.get('/dashboard/leads-over-time', { params });
export const getCampaignPerformance = (params) => apiClient.get('/dashboard/campaign-performance', { params });

// --- Leads ---
export const getLeads = (params) => apiClient.get('/leads', { params });
export const createLead = (leadData) => apiClient.post('/leads', leadData);
export const getLeadById = (id) => apiClient.get(`/leads/${id}`);
export const updateLead = (id, leadData) => apiClient.put(`/leads/${id}`, leadData);
export const deleteLead = (id) => apiClient.delete(`/leads/${id}`);

// --- Campaigns ---
// For dropdowns
export const getCampaignOptions = () => apiClient.get('/leads/campaigns/options');

// For CampaignsPage.jsx - **TEMPORARILY use the options route if you haven't made /api/campaigns yet**
// This will fetch all campaigns but without pagination from backend. Frontend can do basic display.
// NOTE: `params` passed to this function will be IGNORED by the current backend '/leads/campaigns/options' endpoint.
export const getCampaigns = (params) => {
  console.warn("Using /api/leads/campaigns/options for getCampaigns. Pagination/filtering from backend not supported on this endpoint.", params);
  return apiClient.get('/leads/campaigns/options'); // Using existing endpoint
}

// For creating campaigns (still uses the route under /api/leads)
export const createCampaign = (campaignData) => apiClient.post('/leads/campaigns', campaignData);

// **TODO for full Campaign Management Page:**
// You will need to implement dedicated backend routes like /api/campaigns for GET (with pagination), PUT, DELETE
// and then update these functions accordingly:
// export const getCampaignById = (id) => apiClient.get(`/campaigns/${id}`);
// export const updateCampaign = (id, campaignData) => apiClient.put(`/campaigns/${id}`, campaignData);
// export const deleteCampaign = (id) => apiClient.delete(`/campaigns/${id}`);


export default apiClient;