var mongoose = require('mongoose');  
var deliverySchema = new mongoose.Schema({  
    id: Number,
    orderid: Number,
    clientid: Number,
    receivername: String,
    receivercpf: String,
    isreceiverthebuyer: Boolean,
    deliverydate: { type: Date, default: Date.now },
    geolocation: String
});
mongoose.model('Delivery', deliverySchema);