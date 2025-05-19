const express = require('express');
const router = express.Router();
const {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    createCampaign, // Added for convenience, can be a separate campaign route
    getCampaignOptions
} = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Campaign specific routes (can be in their own file: campaignRoutes.js)
router.post('/campaigns', protect, authorize('admin', 'manager'), createCampaign);
router.get('/campaigns/options', protect, getCampaignOptions); // For filter dropdowns

// Lead specific routes
router.route('/')
    .post(protect, authorize('admin', 'manager'), createLead)
    .get(protect, getLeads);

router.route('/:id')
    .get(protect, getLeadById)
    .put(protect, authorize('admin', 'manager'), updateLead)
    .delete(protect, authorize('admin', 'manager'), deleteLead);

module.exports = router;