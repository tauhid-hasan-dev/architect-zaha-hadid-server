const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
/* var jwt = require('jsonwebtoken'); */

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.BB_USER}:${process.env.DB_PASSWORD}@cluster0.jjvuikj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('architectTauhid').collection('services');
        const sliderCollection = client.db('architectTauhid').collection('sliders');
        const reviewCollection = client.db('architectTauhid').collection('reviews');

        //3 services to show in home page
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).sort({ dateField: -1 }).toArray();
            res.send(services)
        })

        //all services to load service page
        app.get('/allservices', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).sort({ dateField: -1 });
            const services = await cursor.toArray();
            res.send(services)
        })

        //api for load data in slider in home page
        app.get('/sliders', async (req, res) => {
            const query = {};
            const cursor = sliderCollection.find(query);
            const sliders = await cursor.toArray();
            res.send(sliders)
        })

        //api for specific service to show of that specific service
        app.get('/servicedetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //post api to create and store customer review 
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log(review)
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        //query by service id to load review in the service details page
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.serviceId) {
                query = {
                    serviceId: req.query.serviceId
                }
            }

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const result = reviewCollection.find(query).sort({ dateField: -1 });
            const reviews = await result.toArray()
            res.send(reviews)
        })

        //getting reviews by id
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.findOne(query);
            res.send(result);
        })


        //api created for inserting service 
        app.post('/allservices', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })


        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            //console.log(id)
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            console.log(review);

            const option = { upsert: true };
            const updatedReview = {
                $set: {
                    reviewMessage: review.reviewMessage
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedReview, option);
            res.send(result);
        })



    } finally {


    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server running for Architect Zaha Hadid');
})

app.listen(port, () => {
    console.log(`Server running for Architect Zaha Hadid on port ${port}`);
})