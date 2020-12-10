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
    }
    /**
     * this function will check if db is ready and then call current func
     * @param {function} func It will return selected function
     */
    dbReady(func, data){
        setTimeout(() => {
            if(!this.dbo){
                this.dbReady(func, data);
            } else {
                func.call(this, data);
            }
        }, 100);
    }
    async dbConnect(){
        await this.connect({}, err => {
            if(err) throw err;
        });
        this.dbo = this.db(dbName); // select db and set to this.dbo
        // create tables from table list if not exist
        collections.forEach(async collect => {
            const exists = await this.checkExist(collect);
            // check if table is not exist and create {collect} name of table
            if(!exists){
                await this.dbo.createCollection(collect, (err, res) => {
                    // create table successfully
                });
            }
        });
    }
    // check if table exist
    async checkExist(collectionName){
        return await(await this.dbo.listCollections().toArray()).findIndex((item) => item.name === collectionName) !== -1;
    }
    /**
     * get data from db table ( this.dbo )
     * @param {string} collectionName Name of table
     * @param {object} query selected Query
    */
    async getEv(data){
        if(this.dbo){
            let { code, collectionName, query } = data;
            const exists = await this.checkExist(collectionName);
            if(exists){
                // get data from selected table with query ( use {} when should get all data)
                await this.dbo.collection(collectionName).find(query).toArray((err, result) => {
                    if(err) throw err;
                    this.emit(code, result);
                });
            } else {
                // if table does not exist return false;
                this.emit(code, false);
            }
        } else {
            // if db is not ready yet , will call dbReady until this.dbo is ready
            this.dbReady(this.getEv, data);
        }
    }
}

const db = new DB();

module.exports = db;