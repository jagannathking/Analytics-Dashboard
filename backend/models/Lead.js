const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true }, // Consider unique index combined with campaign if leads can re-enter
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    score: { type: Number, default: 0, index: true },
    status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'], default: 'New' },
    source: { type: String }, // e.g., 'Facebook Ad C1', 'Google Search KWD'
    cost: { type: Number, default: 0 }, // Cost to acquire this specific lead
    createdAt: { type: Date, default: Date.now, index: true },
    notes: { type: String }
});

LeadSchema.index({ campaign: 1, createdAt: -1 });
LeadSchema.index({ email: 1, campaign: 1 }, { unique: true }); // A lead from same campaign should be unique by email

module.exports = mongoose.model('Lead', LeadSchema);