let db = require('./db');
setTimeout(() => db.emit('get', {collectionName: 'user'}), 2000); // just for test