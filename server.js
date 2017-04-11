const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
MongoClient.connect(config.mongodb.connectionUrl, (err, database)=>{
    if (err) return console.log(err);
    db = database;
    // Now that we are connected to DB, start the server
    app.listen(3000, function(){
        console.log('listening on 3000')
    });
});


const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/index.html');
    db.collection('quotes').find().toArray((err, results)=>{
        if (err) return console.log(err);
        res.render('index.ejs', {quotes: results})
    });
    // Note: __dirname is directory that contains the JavaScript source code.
    //console.log(__dirname);
});

app.post('/quotes', (req, res)=>{
    db.collection('quotes').save(req.body, (err, result)=>{
        if (err) return console.log(err);
        console.log('Saved to DB');
        res.redirect('/');
    })
});

app.put('/quotes', (req, res) => {
    db.collection('quotes').findOneAndUpdate(
        {name: 'Yoda'}, {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        }, {
            sort: {_id: -1},
            upsert: true
        }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        }
    )
})

app.delete('/quotes', (req, res) => {
    db.collection('quotes').findOneAndDelete(
        {name: req.body.name},
        (err, result) => {
            if (err) return res.send(500, err)
            res.send(result)
        }
    )
})
