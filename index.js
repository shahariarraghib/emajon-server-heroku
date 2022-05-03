// for server connection step1
const express = require('express')
// MongoDB connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config()

// for server connection step2
const app = express();
// for server connection step3
const port = process.env.port || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wz4lj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)

async function run() {
    try {

        await client.connect();
        console.log('mongodb connected');
        const database = client.db('emajon_online_shop');
        const productCollection = database.collection('products');
        const orderCollection = database.collection('orders');

        // get products API
        app.get('/products', async (req, res) => {
            console.log(req.query)
            const cursor = productCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);

            let products;
            const count = await cursor.count();
            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }


            res.send({
                count,
                products

            });
        });

        // use post to get data by keys
        app.post('/products/keys', async (req, res) => {
            const keys = req.body;
            const query = { key: { $in: keys } }
            const products = await productCollection.find(query).toArray();
            console.log(req.body);
            res.json(products)

        })

        // add order API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            console.log('oeder', order);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

// for server connection step4
app.get('/', (req, res) => {
    res.send('Ema jon server is running');
})

app.get('/hello', (req, res) => {
    res.send('Ema');
})
app.get('/hello2', (req, res) => {
    res.send('Ema');
})


// for server connection step5
app.listen(port, () => {
    console.log('server running at port', port);
})
