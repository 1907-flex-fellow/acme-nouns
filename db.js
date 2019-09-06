const Sequelize = require('sequelize')

const conn = new Sequelize('postgres://localhost/acme-nouns')

const validId = {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
}
const validName = {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
        notEmpty: true,
        notNull: true
    }
}

const People = conn.define('people', {
    id: validId,
    name: validName
})
const Place = conn.define('place', {
    id: validId,
    name: validName,
})
const Thing = conn.define('thing', {
    id: validId,
    name: validName
})

const acmePlaces = [
    { name: 'FooPlace' },
    { name: 'BarPlace' },
    { name: 'BazzPlace'}
]

const acmePeople = [
    { name: 'Foo' },
    { name: 'Bar' },
    { name: 'Bazz' }
]

const acmeThings = [
    { name: 'FooThing' },
    { name: 'BarThing' },
    { name: 'BazzThing' }
]


People.belongsTo(Place)
Thing.belongsTo(People)

const syncAndSeed = () => {
    return conn.sync({ force: true})
        .then( () => {
            return Promise.all(acmePlaces.map( place => Place.create(place)))
        })
        .then( (places) => {
            return Promise.all(acmePeople.map( (people,idx) => People.create({...people, placeId: places[idx].id})))
        })
        .then( (people) => {
            return Promise.all(acmeThings.map( (thing, idx) => Thing.create({...thing, personId: people[idx].id})))
        })

}

module.exports = {
    syncAndSeed,
    models: {
        People,
        Place,
        Thing
    }
}