var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RideInfo = new Schema({
    _owner: {
        type: Schema.ObjectId,
        ref: 'accounts'
    },
    seats: Number,
    time_start: Date,
    type_cost: String,
    cost: Number,
    name: String,
    ride_type: String,
    homeLocation: {
        district: String,
        municipality: String,
        street: String,
        info: String
    },
    _workLocation: {
        type: Schema.ObjectId,
        ref: 'worklocations'
    }

});

module.exports = mongoose.model('RideInfo', RideInfo);
