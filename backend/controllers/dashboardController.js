const Lead = require('../models/Lead');
const Campaign = require('../models/Campaign');

const buildDateFilter = (startDate, endDate) => {
    const filter = {};
    if (startDate) filter.$gte = new Date(startDate);
    if (endDate) {
        let endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        filter.$lte = endOfDay;
    }
    return Object.keys(filter).length ? filter : null;
};

exports.getSummaryStats = async (req, res) => {
    try {
        const { startDate, endDate, campaignId } = req.query;
        let query = {};

        const dateFilter = buildDateFilter(startDate, endDate);
        if (dateFilter) query.createdAt = dateFilter;

        if (campaignId && campaignId !== 'all') {
            const campaignDoc = await Campaign.findById(campaignId);
            if (campaignDoc) query.campaign = campaignDoc._id;
        }

        const totalLeads = await Lead.countDocuments(query);
        const convertedLeads = await Lead.countDocuments({ ...query, status: 'Converted' });

        const aggregationPipeline = [];
        if (Object.keys(query).length > 0) {
            aggregationPipeline.push({ $match: query });
        }
        aggregationPipeline.push({
            $group: {
                _id: null,
                totalCost: { $sum: '$cost' },
                averageScore: { $avg: '$score' }
            }
        });
        if (aggregationPipeline.length === 1 && Object.keys(aggregationPipeline[0].$group).length === 1) { // only _id: null
            aggregationPipeline.unshift({ $match: {} }); // Match all if no other filters
        }


        const costAndScoreData = await Lead.aggregate(aggregationPipeline);

        const totalCost = costAndScoreData.length > 0 ? (costAndScoreData[0].totalCost || 0) : 0;
        const averageScore = costAndScoreData.length > 0 ? (costAndScoreData[0].averageScore || 0) : 0;

        const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
        const costPerLead = totalLeads > 0 ? totalCost / totalLeads : 0;
        const costPerConversion = convertedLeads > 0 ? totalCost / convertedLeads : 0;

        res.json({
            totalLeads,
            conversionRate: parseFloat(conversionRate.toFixed(2)),
            costPerLead: parseFloat(costPerLead.toFixed(2)),
            averageScore: parseFloat(averageScore.toFixed(2)),
            totalCost: parseFloat(totalCost.toFixed(2)),
            convertedLeads,
            costPerConversion: parseFloat(costPerConversion.toFixed(2))
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error fetching summary stats', error: err.message });
    }
};

exports.getLeadsOverTime = async (req, res) => {
    try {
        const { startDate, endDate, campaignId, groupBy = 'day' } = req.query;
        let query = {};
        const dateFilter = buildDateFilter(startDate, endDate);
        if (dateFilter) query.createdAt = dateFilter;

        if (campaignId && campaignId !== 'all') {
            const campaignDoc = await Campaign.findById(campaignId);
            if (campaignDoc) query.campaign = campaignDoc._id;
        }

        let groupFormatId;
        switch (groupBy) {
            case 'week': groupFormatId = { $isoWeek: '$createdAt' }; break; // Could also use $year + $isoWeek for multi-year
            case 'month': groupFormatId = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }; break;
            default: groupFormatId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        }

        const leadsOverTime = await Lead.aggregate([
            { $match: query },
            {
                $group: {
                    _id: groupFormatId,
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(leadsOverTime);
    } catch (err) {
        res.status(500).json({ message: 'Server Error fetching leads over time', error: err.message });
    }
};

exports.getCampaignPerformance = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let matchStage = {};
        const dateFilter = buildDateFilter(startDate, endDate);
        if (dateFilter) matchStage.createdAt = dateFilter;

        const performance = await Lead.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$campaign',
                    totalLeads: { $sum: 1 },
                    convertedLeads: { $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] } },
                    totalCost: { $sum: '$cost' },
                    averageScore: { $avg: '$score' }
                }
            },
            {
                $lookup: {
                    from: 'campaigns',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'campaignDetails'
                }
            },
            { $unwind: '$campaignDetails' },
            {
                $project: {
                    _id: 0,
                    campaignId: '$campaignDetails._id',
                    campaignIdString: '$campaignDetails.campaignIdString',
                    campaignName: '$campaignDetails.name',
                    channel: '$campaignDetails.channel',
                    totalLeads: 1,
                    convertedLeads: 1,
                    totalCost: 1,
                    averageScore: { $ifNull: ["$averageScore", 0] },
                    conversionRate: {
                        $cond: [{ $eq: ['$totalLeads', 0] }, 0, { $multiply: [{ $divide: ['$convertedLeads', '$totalLeads'] }, 100] }]
                    },
                    costPerLead: {
                        $cond: [{ $eq: ['$totalLeads', 0] }, 0, { $divide: ['$totalCost', '$totalLeads'] }]
                    }
                }
            },
            { $sort: { totalLeads: -1 } }
        ]);
        res.json(performance);
    } catch (err) {
        res.status(500).json({ message: 'Server Error fetching campaign performance', error: err.message });
    }
};