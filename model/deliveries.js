var mongoose = require('mongoose');  
var deliverySchema = new mongoose.Schema({      
    orderid: Number,
    clientid: Number,
    receivername: String,
    receivercpf: String,
    isreceiverthebuyer: Boolean,
    deliverydate: { type: Date, default: Date.now },
    geolocation: String
});
mongoose.model('Delivery', deliverySchema);