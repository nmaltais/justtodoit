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
    //Get cookie is existant
    var currentCookie = ""
    if(req.headers.cookie)
        currentCookie = req.headers.cookie.substring(7);

    //Get all items from DB and send-to/render index.ejs
    db.collection('to-do-items').find().toArray((err, results)=>{
        if (err) return console.log(err);
        var items_deleted = [], items = [];
        results.forEach((item, index, arr)=>{
            if(item.cookie == currentCookie){
                if(item.deleted == "false")
                    items.push(item);
                else if(item.deleted == "true")
                    items_deleted.push(item);
            }
        });

        res.render('index.ejs', {items: items, items_deleted: items_deleted})
    });
});

app.post('/addItem', (req, res)=>{
    console.log("Adding" + req.body);
    db.collection('to-do-items').save(req.body, (err, result)=>{
        if (err) return console.log(err);
        console.log('Saved to DB');
        res.redirect('/');
    })
});

app.put('/crossOffItem', (req, res) => {
    console.log(req.body);
    db.collection('to-do-items').findOneAndUpdate(
        {item: req.body.item,
        cookie: req.body.cookie}, {
            $set: {
                deleted: 'true'
            }
        }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        }
    )
})

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
