const db = require('./db');
const  client = db.client
const createTables = db.createTables;
const createCustomer = db.createCustomer;
const createRestaurant = db.createRestaurant;
const fetchCustomers = db.fetchCustomers;
const fetchRestaurants = db.fetchRestaurants;
const createReservation = db.createReservation;
const fetchReservations = db.fetchReservations;
const destroyReservation = db.destroyReservation;
const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/customers', async( req, res, next)=> {
    try {
        res.send(await fetchCustomers());
    }
    catch(ex){
        next(ex);
    }
});

app.get('/api/restaurants', async( req, res, next)=> {
    try {
        res.send(await fetchRestaurants());
    }
    catch(ex){
        next(ex);
    }
});

app.get('/api/customers/:id/reservations', async( req, res, next)=> {
    try {
        res.send(await fetchReservations(req.params.id));
    }
    catch(ex){
        next(ex);
    }
});

app.post('/api/customers/:customer_id/reservations', async( req, res, next)=> {
    try {
        res.status(201).send(await createReservation({
            customer_id: req.params.customer_id, 
            restaurant_id: req.body.restaurant_id,
            reservation_date: req.body.reservation_date
            
        }));
    }
    catch(ex){
        next(ex);
    }
});


app.delete('/api/customers/:customer_id/reservations/:id', async (req, res, next) => {
    try {
        await destroyReservation({ customer_id: req.params.customer_id, id: req.params.id });
        res.sendStatus(204);
    } catch (ex) {
        next(ex);
    }
});

app.use((err, req, res, next)=> {
    res.status(err.status || 500).send({error: err.message || err});
});

const init = async()=> {
  console.log('connecting to database');  
  await client.connect();
 console.log('connected to database');
 await createTables();
 console.log('tables created');
 const [moe, lucy, ethyl, Bocchi, Risckys, Kura, Gen]= await Promise.all([
    createCustomer({ name: 'moe'}),
     createCustomer({ name: 'lucy'}),
      createCustomer({ name: 'ethyl'}),
      createRestaurant({ name: 'Bocchi'}),
      createRestaurant({ name: 'Risckys'}),
      createRestaurant({ name: 'Kura'}),
      createRestaurant({ name: 'Gen'}),
     ]);
     console.log(await fetchCustomers());
     console.log(await fetchRestaurants());
     let reservation = await createReservation({
         reservation_date: '04/13/2024',
         restaurant_id:Kura.id,
         customer_id:moe.id
     });
     console.log( await fetchReservations(moe.id));
     await destroyReservation(reservation);
    console.log( await fetchReservations(moe.id));
    reservation = await createReservation({
         reservation_date: '04/19/2024',
         restaurant_id:Bocchi.id,
         customer_id:moe.id
    });
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> {
        console.log(`listening on port ${port}`);
        console.log(`curl localhost:${port}/api/customers`);
        console.log(`curl localhost:${port}/api/restaurants`);
        console.log(`curl localhost:${port}/api/customers/${moe.id}/reservations`);
        console.log(`curl -X DELETE localhost:${port}/api/customers/${moe.id}/reservations/${reservation.id}`);
        console.log(`curl localhost:${port}/api/customers/${lucy.id}/reservations`);
        console.log(`curl -X POST localhost:${port}/api/customers/${lucy.id}/reservations -d '{"restaurant_id":"${Gen.id}","reservation_date":"04/01/2024"}' -H "Content-Type:application/json"-v`);
    })
};

init ();