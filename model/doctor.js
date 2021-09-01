let mongoose = require('mongoose');

let doctorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName: {
        firstName: {
            type: String,
            require: true,
        },
        lastName: String
    },
    dateOfBirth: {
        type: Date, 
    },
    address: {
        state: {
            type: String,
            validate: {
                validator: (stateValue) => {
                    return stateValue.length >= 2 && stateValue.length <= 3
                },
                message: "State needs to be minimum of 2 letters and maximum of 3 letters"
            }
        },
        suburb: String,
        street: String,
        unit: Number
    },
    numPatients: {
        type: Number,
        min: 1
    }
})

module.exports = mongoose.model("Doctor", doctorSchema)