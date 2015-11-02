# logistic-web-app
DM107 Final Homework

Basic URL: http://eds-dm107.tk/

## Paths

### /deliveries


### POST /deliveries
Creates a new Delivery.

Parameter:

Body:

{      
    orderid: Number,
    clientid: Number,
    receivername: String,
    receivercpf: String,
    isreceiverthebuyer: Boolean,
    deliverydate: { type: Date, default: Date.now },
    geolocation: String
}

### PUT /deliveries/{_id}/edit

Updates an existing delivery.

Parameters:

-id: The id of the delivery to be updated.

Body:

{      
    orderid: Number,
    clientid: Number,
    receivername: String,
    receivercpf: String,
    isreceiverthebuyer: Boolean,
    deliverydate: { type: Date, default: Date.now },
    geolocation: String
}

### DELETE /deliveries/{_id}/edit

Delete the delivery correspondent to the given _id.

Parameters:

-id: The id of the delivery to be deleted.

### GET /deliveries

List all deliveries.

### GET /deliveries/{_id}

Get a delivery by id.

Parameters:

-id: The id of the delivery to be retrieved.

