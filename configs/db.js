import mongoose from 'mongoose';
import config from './app'

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

export const mongodb = () => mongoose.connect(connectionString, {
    useNewUrlParser: true
}, (err) => {
    if (!err)
        console.log('MongoDB Connection Succeeded');
    else
        console.log('Error in DB Connection: '.JSON.stringify(err, undefined, 2));
});