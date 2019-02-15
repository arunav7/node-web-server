const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

app.set('view engine', 'hbs');
// app.use is a middleware which tweaks thw working of an express i.e we can host our own html pages


hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('currentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.use((req,res,next) => {
    var now = new Date().toDateString();
    var log = `${now} ,${req.method} ,${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log  + '\n', (err) => {
        if(err) {
            console.log(err);
        }
    });
    next();
});

// app.use((req, res, next) => {
//     res.render('maintainence.hbs');
// });

app.use(express.static(__dirname + '/public'));  // this is addedd below the maintainenece page because node will run code sequentially,due to this static page willbe rendered as it was but not according to maintainence.hbs

app.get('/',(req, res) => {
    //res.send('<h2>Hey Express is Sending Data</h2>');
    res.render('home.hbs',{
        welcomeMessage: 'My Home Page',
        pageTitle: 'Home Page',
        someText: 'some text here....'
    });
});

// when object is sent through response to the page then express automatically parse it into json format

// this will create an another route to localhost:3010/about page/url
app.get('/about',(req, res) => {
    res.render('about.hbs',{
        welcomeMessage: 'Welcome to About Page',
        pageTitle: 'About Page',
        someText: 'some text here....'
    });
});

app.get('/bad',(req, res) => {
    res.send({
        error: 'Sorry something gone wrong...'
    });
});

// for website to deploy on heroku we have to set the port dynamically because everytime heroku deploys website ,port changes
// and we need to add script in package.json file as start, because heroku doesnt know our file name, instead it will run start sript to deploy

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});