const express = require('express');
const path = require('path')
const app = express();
const db = require('./db');

const port = process.env.PORT || 3000;

app.get('/', (req, res, next)=>res.sendFile(path.join(__dirname, './index.html')))

app.get('/api/people', (req, res, next) => {
    db.models.People.findAll()
        .then( people => res.send(people))
        .catch(next)
})

app.get('/api/places', (req, res, next) => {
    db.models.Place.findAll()
        .then( places => res.send(places))
        .catch(next)
})

app.get('/api/things', (req, res, next) => {
    db.models.Thing.findAll()
        .then( things => res.send(things))
        .catch(next)
})


db.syncAndSeed()
    .then( () => {
        app.listen(port, ()=>console.log(`listening on PORT ${port}`))
    })
    .catch(ex => console.log(ex))
