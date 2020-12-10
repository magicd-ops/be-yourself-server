/**
 * Create Class instance extends from MongoClient
 * Use url , options to connect to mongodb
 */
let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017';
let options = { useUnifiedTopology: true };
// name of db
let dbName = 'life';
// name of tables
let collections = [
    'user'
];

class DB extends MongoClient {
    constructor(){
        super();
        // update this.s with new url and options to use on db connect
        this.s.url = url;
        this.s.options = options;
        this.dbo = null;
        this.dbConnect();
        this.events();
    }
    async dbConnect(){
        await this.connect({}, err => {
            if(err) throw err;
        });
        this.dbo = this.db(dbName); // select db and set to this.dbo
        // create tables from table list if not exist
        collections.forEach(async collect => {
            const exists = await this.checkExist(collect);
            if(!exists){
                await this.dbo.createCollection(collect, (err, res) => {
                    console.log(`create "${collect}" table`);
                });
            } else console.log(`"${collect}" table created before`);
        });
    }
    // check if table exist
    async checkExist(collectionName){
        return await(await this.dbo.listCollections().toArray()).findIndex((item) => item.name === collectionName) !== -1;
    }
    // selected db events ( this.dbo )
    events(){
        this.on('get', async ({collectionName}) => {
            if(this.dbo){
                const exists = await this.checkExist(collectionName);
                if(exists){
                    console.log(`Collection "${collectionName}" is selected`)
                } else console.log(`Collection "${collectionName}" not exist`);
                /*this.dbo.collection('user').findOne({}, function(err, result) {
                    console.log('sss');
                });*/
                /*this.dbo.createCollection('user', (err, res) => {
                    console.log('create');
                });*/
            }
        });
    }
}

const db = new DB();

module.exports = db;