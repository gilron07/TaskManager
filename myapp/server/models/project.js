const mongoose = require('mongoose');
const { Schema } = mongoose;

const statusSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    state: {
        type: String,
        enum: ['IN_PROGRESS', 'PAUSE', 'BORDERS', 'COMPLETE', 'USER_CHANGE'],
        required: true
    },
    manualEdits: [{
        userId: Schema.Types.ObjectId,
        timestamp: { type: Date, require: true },
        note: String
    }]
});

const projectSchema = new Schema({
    serialNumber: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedUser: { type: Schema.Types.ObjectId, ref: 'User' },
    goosh: { type: Number, required: true, trim: true },
    helka: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    address: {
        city: String,
        streetName: String,
        houseNumber: Number,
        zip: Number
    },
    status: [statusSchema],
    tags: { type: [String], index: true }
});

module.exports = mongoose.model('Project', projectSchema);
