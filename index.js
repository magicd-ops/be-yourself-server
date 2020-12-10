let db = require('./db');
let {v4: uuidv4} = require('uuid');
let app = require('express')();

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