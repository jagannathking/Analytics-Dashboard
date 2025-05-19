const express = require('express');
const router = express.Router();
const {
    getSummaryStats,
    getLeadsOverTime,
    getCampaignPerformance
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All dashboard routes require authentication

router.get('/summary', getSummaryStats);
router.get('/leads-over-time', getLeadsOverTime);
router.get('/campaign-performance', getCampaignPerformance);

module.exports = router;