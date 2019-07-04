const {MongoClient, ObjectID} = require('mongodb');
const dbname = "taskmgr";
const url = `mongodb://localhost:27017/${dbname}`;

const state = {
    db: null,
    client: null
}

const connect = (cb) => {
    if(state.db)
        cb();
    
    else {
        MongoClient.connect(url, undefined, (err, client)=> {
            if (err)
                cb(err);
            else {
                state.db = client.db(dbname);
                state.client = client;
                cb();
            }
        })
    }
}

const getDB = () => {
    return state.db;
}

const close = () => {
    state.client.close();
}

const getObjectID = (_id) => {
    return ObjectID(_id);
}

module.exports = {connect, getDB, getObjectID, close};