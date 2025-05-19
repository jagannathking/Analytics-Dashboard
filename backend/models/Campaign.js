const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    campaignIdString: { type: String, required: true, unique: true }, // User-friendly ID
    name: { type: String, required: true },
    channel: { type: String, enum: ['Paid Ads', 'Email', 'Social Media', 'Organic'], required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    budget: { type: Number }
});

module.exports = mongoose.model('Campaign', CampaignSchema);