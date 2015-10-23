var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), 
    bodyParser = require('body-parser'), 
    methodOverride = require('method-override');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

//build the REST operations at the base for deliveries
//this will be accessible from http://127.0.0.1:3000/deliveries if the default route for / is left unchanged
router.route('/')
    //GET all deliveries
    .get(function(req, res, next) {
        //retrieve all deliveries from Monogo
        mongoose.model('Delivery').find({}, function (err, deliveries) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/deliveries folder. 
                      //We are also setting "deliveries" to be an accessible variable in our jade view
                    html: function(){
                        res.render('deliveries/index', {
                              title: 'All my Deliveries',
                              "deliveries" : deliveries
                          });
                    },
                    //JSON response will show all deliveries in JSON format
                    json: function(){
                        res.json(deliveries);
                    }
                });
              }     
        });
    })
    //POST a new delivery
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var orderid = req.body.orderid;
        var clientid = req.body.clientid;
        var receivername = req.body.receivername;
        var receivercpf = req.body.receivercpf;
        var isreceiverthebuyer = req.body.isreceiverthebuyer;
        var deliverydate = req.body.deliverydate;
        var geolocation = req.body.geolocation;
        //call the create function for our database
        mongoose.model('Delivery').create({
            orderid : orderid,
            clientid : clientid,
            receivername : receivername,
            receivercpf : receivercpf,
            isreceiverthebuyer : isreceiverthebuyer,
            deliverydate : deliverydate,
            geolocation : geolocation
        }, function (err, delivery) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Delivery has been created
                  console.log('POST creating new delivery: ' + delivery);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. 
                      //You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("deliveries");
                        // And forward to success page
                        res.redirect("/deliveries");
                    },
                    //JSON response will show the newly created delivery
                    json: function(){
                        res.json(delivery);
                    }
                });
              }
        })
    });

/* GET New Delivery page. */
router.get('/new', function(req, res) {
    res.render('deliveries/new', { title: 'Add New Delivery' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Delivery').findById(id, function (err, delivery) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Delivery').findById(req.id, function (err, delivery) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + delivery._id);
        try{
            var deliverydate = delivery.deliverydate.toISOString();
            deliverydate = deliverydate.substring(0, deliverydate.indexOf('T'));
        }catch(e){
            console.error(e);
        }
        
        
        res.format({
          html: function(){
              res.render('deliveries/show', {
                "deliverydate" : deliverydate,
                "delivery" : delivery
              });
          },
          json: function(){
              res.json(delivery);
          }
        });
      }
    });
  });

//GET the individual delivery by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the delivery within Mongo
    mongoose.model('Delivery').findById(req.id, function (err, delivery) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the delivery
            console.log('GET Retrieving ID: ' + delivery._id);
            //format the date properly for the value to show correctly in our edit form
        try{
            var deliverydate = delivery.deliverydate.toISOString();
            deliverydate = deliverydate.substring(0, deliverydate.indexOf('T'));
        }catch(e){
            console.error(e);
        }
          
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('deliveries/edit', {
                          title: 'Delivery' + delivery._id,
                        "deliverydate" : deliverydate,
                          "delivery" : delivery
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(delivery);
                 }
            });
        }
    });
});

//PUT to update a delivery by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var orderid = req.body.orderid;
    var clientid = req.body.clientid;
    var receivername = req.body.receivername;
    var receivercpf = req.body.receivercpf;
    var isreceiverthebuyer = req.body.isreceiverthebuyer;
    var deliverydate = req.body.deliverydate;
    var geolocation = req.body.geolocation;

   //find the document by ID
        mongoose.model('Delivery').findById(req.id, function (err, delivery) {
            //update it
            delivery.update({
                orderid : orderid,
                clientid : clientid,
                receivername : receivername,
                receivercpf : receivercpf,
                isreceiverthebuyer : isreceiverthebuyer,
                deliverydate : deliverydate,
                geolocation : geolocation
            }, function (err, deliveryID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              } 
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/deliveries/" + delivery._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(delivery);
                         }
                      });
               }
            })
        });
});

//DELETE a Delivery by ID
router.delete('/:id/edit', function (req, res){
    //find delivery by ID
    mongoose.model('Delivery').findById(req.id, function (err, delivery) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            delivery.remove(function (err, delivery) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + delivery._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/deliveries");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : delivery
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;