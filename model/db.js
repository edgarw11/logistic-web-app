var mongoose = require('mongoose');
var db_name = 'logisticwebapp2';
var username = 'admin';
var password = 'aWuSUIIFMhfx';

//mongoose.connect('mongodb://localhost/logisticdb');
mongodb://username:password@host:port/database?options...
//provide a sensible default for local development
mongodb_connection_string = 'mongodb://' + username + ':' + password +'@127.0.0.1:27017/' + db_name;
//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
}

mongoose.connect(mongodb_connection_string);