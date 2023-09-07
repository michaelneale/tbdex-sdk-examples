// server.mjs
import express from 'express';
import bodyParser from 'body-parser';

import { Message, OrderStatus, Rfq, PfiRestClient } from "@tbd54566975/tbdex"


const app = express();
const PORT = 3000;

// Using the JSON body parser middleware to handle JSON payloads
app.use(bodyParser.json());

app.post('/', async (req, res) => {
    const body = req.body;    
    const msg = await Message.parse(body);
    console.log(msg);

    if (msg.isRfq()) {
        // cast to Rfq
        const { data: rfq } = msg
        rfq.verifyVcs(offering)

    }

    res.json(body);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
