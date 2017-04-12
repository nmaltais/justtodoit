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
        var items_done = [], items = [];
        results.forEach((item, index, arr)=>{
            if(item.cookie == currentCookie && item.deleted == "false"){
                if(item.done == "false")
                    items.push(item);
                else if(item.done == "true")
                    items_done.push(item);
            }
        });

        res.render('index.ejs', {items: items, items_done: items_done})
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
    console.log("Cross-off" + req.body);
    db.collection('to-do-items').findOneAndUpdate(
        {item: req.body.item,
        cookie: req.body.cookie}, {
            $set: {
                done: 'true'
            }
        }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        }
    )
});

app.put('/deleteItem', (req, res) => {
    console.log("Deleted: " + req.body);
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

// app.put('/quotes', (req, res) => {
//     db.collection('quotes').findOneAndUpdate(
//         {name: 'Yoda'}, {
//             $set: {
//                 name: req.body.name,
//                 quote: req.body.quote
//             }
//         }, {
//             sort: {_id: -1},
//             upsert: true
//         }, (err, result) => {
//             if (err) return res.send(err)
//             res.send(result)
//         }
//     )
// })
//
// app.delete('/quotes', (req, res) => {
//     db.collection('quotes').findOneAndDelete(
//         {name: req.body.name},
//         (err, result) => {
//             if (err) return res.send(500, err)
//             res.send(result)
//         }
//     )
// })
