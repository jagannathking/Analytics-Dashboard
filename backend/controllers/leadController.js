const Lead = require('../models/Lead');
const Campaign = require('../models/Campaign');

exports.createLead = async (req, res) => {
    const { email, campaignIdString, score, status, source, cost, notes } = req.body;
    try {
        const campaign = await Campaign.findOne({ campaignIdString });
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found with the provided campaignIdString' });
        }

        const newLead = await Lead.create({
            email,
            campaign: campaign._id,
            score,
            status,
            source,
            cost,
            notes
        });
        res.status(201).json(newLead);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Duplicate lead: Email already exists for this campaign.' });
        }
        res.status(500).json({ message: 'Error creating lead', error: error.message });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const { page = 1, limit = 10, campaignId, scoreMin, scoreMax, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc', status } = req.query;
        let query = {};

        if (campaignId && campaignId !== 'all') {
            const campaignDoc = await Campaign.findById(campaignId); // Assuming frontend sends Campaign._id
            if (campaignDoc) query.campaign = campaignDoc._id;
        }
        if (status && status !== 'all') query.status = status;
        if (scoreMin) query.score = { ...query.score, $gte: Number(scoreMin) };
        if (scoreMax) query.score = { ...query.score, $lte: Number(scoreMax) };

        if (startDate) query.createdAt = { ...query.createdAt, $gte: new Date(startDate) };
        if (endDate) {
            let endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            query.createdAt = { ...query.createdAt, $lte: endOfDay };
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const leads = await Lead.find(query)
            .populate('campaign', 'name campaignIdString channel')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort(sortOptions)
            .lean();

        const totalLeads = await Lead.countDocuments(query);

        res.json({
            leads,
            totalPages: Math.ceil(totalLeads / Number(limit)),
            currentPage: Number(page),
            totalLeads
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error fetching leads', error: err.message });
    }
};

exports.getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate('campaign', 'name campaignIdString');
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lead', error: error.message });
    }
};

exports.updateLead = async (req, res) => {
    try {
        const { campaignIdString, ...updateData } = req.body;
        if (campaignIdString) {
            const campaign = await Campaign.findOne({ campaignIdString });
            if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
            updateData.campaign = campaign._id;
        }

        const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
            .populate('campaign', 'name campaignIdString');
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lead', error: error.message });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.json({ message: 'Lead removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting lead', error: error.message });
    }
};

// --- Campaign Specific Controllers (can be moved to campaignController.js) ---
exports.createCampaign = async (req, res) => {
    try {
        const newCampaign = await Campaign.create(req.body);
        res.status(201).json(newCampaign);
    } catch (error) {
        res.status(500).json({ message: 'Error creating campaign', error: error.message });
    }
};

exports.getCampaignOptions = async (req, res) => {
    try {
        const campaigns = await Campaign.find().select('name campaignIdString _id channel').sort({ name: 1 });
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ message: 'Server Error fetching campaign options', error: err.message });
    }
};