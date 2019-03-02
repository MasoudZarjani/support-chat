import dotenv from 'dotenv'
dotenv.config()

export default {
    app: {
        port: process.env.PORT || 4000,
        host: process.env.HOST || 'localhost'
    },
    mongodb: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 27017,
        name: process.env.DB_DATABASE || 'chat',
        connection: process.env.DB_CONNECTION || 'mongodb',
    }
}