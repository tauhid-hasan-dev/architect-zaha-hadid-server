const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
/* var jwt = require('jsonwebtoken'); */

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.BB_USER}:${process.env.DB_PASSWORD}@cluster0.jjvuikj.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('architectTauhid').collection('services');
        const sliderCollection = client.db('architectTauhid').collection('sliders');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = await serviceCollection.find(query);
            const services = cursor.limit(3).toArray();
            res.send(services)
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