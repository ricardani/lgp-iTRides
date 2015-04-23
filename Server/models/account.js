var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = new Schema({
  _sender: {
    type: Schema.ObjectId,
    ref:'accounts'
  },
  type: String,
  _customRideId: {
    type: Schema.ObjectId,
    ref:'customrides'
  }
});

var Account = new Schema({
  name: String,
  email: String,
  password: String,
  contact: String,
  photo: String,
  activated: {
    type: Boolean,
    default: false
  },
  notifications: [Notification],
  permission: {
    type: String,
    default: 'User'
  }

});

module.exports = mongoose.model('Account', Account);

/* Criação de uma conta (hard-coded)
var small = new AccountFunc({
    "name" : "Jorge",
    "email" : "ei11057@fe.up.pt",
    "password" : "paralgp",
    "contact" : "918978792",
    "photo" : "https://fotoQualquer",
    "activated" : {
        "type" : true
    }
});
small.save(function (err) {
  if (err) return handleError(err);
  // saved!
})*/
