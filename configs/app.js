import dotenv from 'dotenv'
dotenv.config()

export default {
    app: {
        port: process.env.PORT || 4000,
        host: process.env.HOST || 'localhost'
    },
    mongodb: {
        host: process.env.MONGO_DB_HOST || 'localhost',
        port: process.env.MONGO_DB_PORT || 27017,
        name: process.env.MONGO_DB_DATABASE || 'chat',
        connection: process.env.MONGO_DB_CONNECTION || 'mongodb',
    },
    mysql: {
        host: process.env.MYSQL_DB_HOST,
        database: process.env.MYSQL_DB_DATABASE,
        user: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PASSWORD
    }
}