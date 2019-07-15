const mongoose = require('mongoose');
const { Schema } = mongoose;

const timingSchema = new Schema({
    userId: Schema.Types.ObjectId,
    timestamp: { type: Date, default: Date.now },
    state: {
        type: String,
        enum: ['IN_PROGRESS', 'PAUSE', 'BORDERS', 'COMPLETE'],
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
    createdBy: {type : Schema.Types.ObjectId, ref:'User'},
    goosh: { type: Number, required: true, trim: true },
    helka: { type: String, required: true },
    isDeleted: { tyep: Boolean, default: false },
    address: {
        city: String,
        streetName: String,
        houseNumber: Number,
        zip: Number
    },
    timing: [timingSchema],
    tags: { type: [String], index: true }
});

module.exports = mongoose.model('Project', projectSchema);
