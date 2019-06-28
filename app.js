import express from 'express';
import bodyParser from 'body-parser';
import parseInput from './parsefun';

const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/v1/parse', (req, res) => {
    if(!req.body.content) {
        return res.status(400).send({
            success: 'false',
            message: 'title is required'
        });
    }
    let content = req.body.content;
    const parsed = parseInput(content);
    return res.status(201).send({
        success: 'true',
        message: 'parsed message: ' + parsed
    })
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});