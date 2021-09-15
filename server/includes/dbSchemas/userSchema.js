const MONGOOSE = require('mongoose');

const SCHEMA = MONGOOSE.Schema;

const _USER_SCHEMA = new SCHEMA({
  login:{
    type:String,
    required:true,
    trim:true
  },

  password:{
    type: String,
    required: true
  },

  salt:{
    type: String,
    required: true
  }
});

module.exports = {
  USER_SCHEMA : _USER_SCHEMA
};