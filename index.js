const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
/* var jwt = require('jsonwebtoken'); */

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server running for Architect Zaha Hadid');
})

app.listen(port, () => {
    console.log(`Server running for Architect Zaha Hadid on port ${port}`);
})