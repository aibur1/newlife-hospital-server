const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wsmmh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log("database connected successfully", uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
     try{
       await client.connect();
       const database = client.db('hospital');
       const servicesCollection = database.collection("services");
       const homeService = database.collection("HomeService");
       const Orders = database.collection("Orders");
       const Reviews = database.collection("Reviews");
       const user = database.collection("User");

    //    ===================CRUD OPERATION START=====================


     // home service start
     app.get(`/homeService`,async(req,res)=>{
        const cursor=homeService.find({})
        const result=await cursor.toArray()
        res.json(result)
     })

    app.get(`/homeService/:id`,async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)}
        const result=await homeService.findOne(query)
        res.json(result)
    })
   

    app.post(`/homeService`,async(req,res)=>{
        const newProduct=req.body;
        const result=await homeService.insertOne(newProduct)
        res.json(result)
    })

    app.delete(`/homeService/:id`,async(req,res)=>{
      const id=req.params.id;
      const query={_id:ObjectId(id)}
      const result=await homeService.deleteOne(query)
      res.json(result)
    })

    // home service end

      app.post(`/services`,async(req,res)=>{
        const service=req.body;
        console.log('hitting post api for services', service);
        const result=await servicesCollection.insertOne(service)
        res.json(result)
      })

      
      // app.get(`/services`,async(req,res)=>{
      //   const cursor=servicesCollection.find({});
      //   const result=await cursor.toArray(service)
      //   res.json(result)
      // })


       //GET API
       app.get('/services', async (req, res) => {
        const email = req.query.email;
        const query = { email: email }
        const cursor = servicesCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
    });

     //GET Single service
     app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        console.log('getting specific service', id);
        const query = { _id: ObjectId(id) };
        const services = await servicesCollection.findOne(query);
        res.json(services);
    });
    
      //  user start

   app.post(`/user`,async(req,res)=>{
    const newuser=req.body;
    const result=await user.insertOne(newuser)
    res.json(result)
  })

  app.get(`/user/:email`,async(req,res)=>{
     const email=req.params.email;
    const cursor=await user.findOne({email:email})
    let Admin = false
    if(cursor?.roles==='admin'){
      Admin=true
    }
   res.json({admin:Admin})
  })

  app.put(`/user`,async(req,res)=>{
    const specificUser=req.body;
    const cursor={email:specificUser.email}
    const options = { upsert: true };
    const updateDoc = {
     $set: {
       roles:'admin'
     },
   };
   const result=await user.updateOne(cursor,updateDoc,options)
   res.json(result)


  })

   //  user end


     // review start
     app.get(`/reviews`,async(req,res)=>{
        const cursor=Reviews.find({})
        const result=await cursor.toArray()
        res.json(result)
      })
  
     app.post(`/reviews`,async(req,res)=>{
      const newReview=req.body;
      const result=await Reviews.insertOne(newReview)
      res.json(result)
     })
      // review end
     
      //  orders start
   app.post(`/orders`,async(req,res)=>{
    const newOrder=req.body;
    const result=await Orders.insertOne(newOrder)
    res.json(result)
})

 app.get(`/orders/:email`,async(req,res)=>{
   const email=req.params.email;
   const cursor=Orders.find({email:email})
   const result=await cursor.toArray()
   res.json(result)
 })

 app.delete(`/orders/:id`,async(req,res)=>{
   const id=req.params.id;
   const query={_id:ObjectId(id)}
   const result=await Orders.deleteOne(query)
   console.log(result);
   res.json(result)
 })

 app.get(`/orders`,async(req,res)=>{
   const cursor=Orders.find({})
   const result=await cursor.toArray()
   res.json(result)
 })

 app.put(`/orders/:id`,async(req,res)=>{
   const id=req.params.id;
   const query={_id:ObjectId(id)}
   const options = { upsert: true };
   const updateDoc = {
     $set: {
      status:'shipped'
     },
   };

  const result=await Orders.updateOne(query,updateDoc,options)
  res.json(result)
 })
 //  orders end


     }
     finally {
         //await client.close();
     }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to newlife hospital.')
});

app.listen(port, () => {
    console.log(`listening at ${port}`)
})