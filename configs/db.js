import mongoose from 'mongoose';
import config from './app'
import mysql from 'mysql'

export const mongodb = () => {
    const {
        mongodb: {
            host,
            port,
            name,
            connection
        }
    } = config;

    const connectionString = `${connection}://${host}:${port}/${name}`;
    mongoose.Promise = global.Promise;
    mongoose.connect(connectionString, {
        useNewUrlParser: true
    }, (err) => {
        if (!err)
            console.log('MongoDB Connection Succeeded');
        else
            console.log('Error in DB Connection: '.JSON.stringify(err, undefined, 2));
    });
}

export const mysqldb = () => {
    const {
        mysql: {
            host,
            database,
            user,
            password
        }
    } = config;

    const db = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('Mysql Connection Succeeded');
    });
    global.db = db;
}