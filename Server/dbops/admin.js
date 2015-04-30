var WorkLocation = require('../models/workLocation');

function getWorkLocations(req, res) {
    WorkLocation.find({}, function(err, data) {
        if (err || data === null) {
            console.log('Can`t find workLocations');
            res.json(err);
        } else {
            res.json(data);
        }});
}

module.exports.workLocations = getWorkLocations;
