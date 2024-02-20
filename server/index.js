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
     const reservation = await createReservation({
         reservation_date: '04/13/2024',
         restaurant_id:Kura.id,
         customer_id:moe.id
     });
     console.log( await fetchReservations(moe.id));
     await destroyReservation(reservation);
    console.log( await fetchReservations(moe.id));
};

init ();