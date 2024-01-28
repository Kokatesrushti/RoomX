const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    users: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date, 
    },
    endDate: {
        type: Date, 
    },
    startTime: {
        type: Date, // For hourly bookings
    },
    endTime: {
        type: Date, 
    }
});

const BookingModel = mongoose.model("Booking", BookingSchema);

module.exports = BookingModel;
