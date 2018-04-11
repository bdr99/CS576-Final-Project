const MongoClient = require("mongodb").MongoClient;

const settings = {
    mongoConfig: {
        serverUrl: "mongodb://localhost:27017/",
        database: "cs576"
    }
};

let fullMongoUrl = settings.mongoConfig.serverUrl;
let _connection = undefined;

let connectDb = () => {
    if (!_connection) {
        _connection = MongoClient.connect(fullMongoUrl)
            .then((client) => {
                return client.db(settings.mongoConfig.database);
            });
    }

    return _connection;
};

module.exports = connectDb;