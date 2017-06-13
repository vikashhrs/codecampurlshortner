var mongoose = require('mongoose');
var UrlSchema = mongoose.Schema({
    original_url:{
        type : String,
        required : true
    },
    short_url:{
        type : String,
        required : true
    }

});
module.exports = mongoose.model('ShortUrl',UrlSchema); 