let mongoose = require('mongoose');

let patientSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    age: {
        type: Number,
        min: 0,
        max:120
    },
    dateOfVisit: {
        type: Date,
        default: Date.now,
    },
    caseDescription: {
        type: String,
        validate: {
            validator: (caseDescriptionValue) => {
                return caseDescriptionValue.length > 10
            },
            message: "caseDescription needs to be minimum of 10 letters"
        }
    }    
});

module.exports = mongoose.model('Patient', patientSchema);