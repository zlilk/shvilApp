var mongoose = require('mongoose');
var schema = mongoose.Schema;

var segmentSchema = new schema({
    indx: {type:Number, index:1, required:true, unique:true},
    seg_start: String,
    seg_end: String,
    sleep_place:[{
        family_name: String,
        phone: String
    }]
}, {collection: 'segments'});

var Segment = mongoose.model('Segment', segmentSchema);

module.exports = Segment;
