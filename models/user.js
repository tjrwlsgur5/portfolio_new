//유저 스키마

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var userSchema = new Schema({
    id: String,
    password: String,
    passwordcheck: String,
    name: String,
    phonenum: String,
    email: String,
    usertype: String,
    personalagree: String
});
 
module.exports = mongoose.model('user', userSchema);