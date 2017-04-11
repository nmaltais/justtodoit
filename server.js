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
        res.render('index.ejs', {items: results, currentCookie: currentCookie})
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
