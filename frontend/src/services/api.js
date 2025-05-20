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
export const register = (userData) => apiClient.post('/auth/register', userData); // This is for self-registration
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
// For dropdowns in FilterBar
export const getCampaignOptions = () => apiClient.get('/leads/campaigns/options');

// For CampaignsPage.jsx - lists all campaigns (can be paginated on backend later)
// Currently, this uses the same endpoint as options; for a real Campaigns CRUD page,
// you'd want a dedicated /api/campaigns endpoint with GET (all, paginated), GET by ID, PUT, DELETE.
export const getCampaigns = (params) => {
  // console.warn("API: getCampaigns is using /api/leads/campaigns/options. For full features, implement dedicated /api/campaigns routes.", params);
  return apiClient.get('/leads/campaigns/options', { params }); // For now, use the options endpoint
}

// For creating campaigns (still uses the route under /api/leads as per backend setup)
export const createCampaign = (campaignData) => apiClient.post('/leads/campaigns', campaignData);

// Future dedicated campaign routes (backend needs to implement these at /api/campaigns/...)
// export const getCampaignById = (id) => apiClient.get(`/campaigns/${id}`);
// export const updateCampaign = (id, campaignData) => apiClient.put(`/campaigns/${id}`, campaignData);
// export const deleteCampaign = (id) => apiClient.delete(`/campaigns/${id}`);

export default apiClient;