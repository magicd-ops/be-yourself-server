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

let db = DB({dbName, collections});

app.get('/', (req, res) => {
    let code = uuidv4(); // unique code for every request
    db.getData('user'); //, {query: {address: 'test'}}
    db.response((data) => {
        data ? res.send(data) : res.status(404).send('error in fetch data');
    });
});

app.get('/create', (req, res) => {
    db.createData('user', { username: "test", firstname: "test", lastName: "test" });
    db.response((result) => {
        result ? res.send(result) : res.status(404).send('error in create data');
    });
});

app.get('/update', (req, res) => {
    db.updateData('user', {firstname: 'test222'}, { query: { username: 'test' }/** , type='many' */ });
    db.response((result) => {
        result ? res.send(result) : res.status(404).send('error in update data');
    });
});

app.get('/delete', (req, res) => {
    db.deleteData('user', {query: { firstname: 'test222' }});
    db.response((result) => {
        result ? res.send(result) : res.status(404).send('error in update data');
    });
});

app.listen(8080, () => {
    console.log('app start');
});