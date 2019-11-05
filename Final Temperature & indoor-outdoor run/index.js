const express = require('express');
const Datastore = require('nedb');

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Starting server at ${port}`);
});
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db'); // Creating a database for the data including latitude, longitude, temperature, running, date and time
database.loadDatabase(); // loading the database

app.post('/api', (request, response) => { // Requesting the data, date and time from the database to post into the index.html/chart
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});

app.get('/api', (request, response) => {
    database.find({}).sort({timestamp: 1}).exec(function (err,docs){ // Sorting the time and date so they appear chronologically on the Y axis
        if (err) {
            console.log(err);
            response.end();
            return;
        }
        response.json(docs);
    });
});

