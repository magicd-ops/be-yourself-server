let DB = require('magic-mongodb');
let {v4: uuidv4} = require('uuid');
let app = require('express')();

let url = false;//'mongodb://localhost:27017';
let options = false;//{ useUnifiedTopology: true };
// name of db
let dbName = 'life';
// name of tables
let collections = [
    'user'
];

let db = new DB({dbName, collections});

app.get('/', (req, res) => {
    let code = uuidv4(); // unique code for every request
    db.getEv({code ,collectionName: 'user', query: {address: 'test'}})
    db.on(code, (data) => {
        data ? res.send(data) : res.status(404).send('error in fetch data');
    });
});

app.listen(8080, () => {
    console.log('app start');
});