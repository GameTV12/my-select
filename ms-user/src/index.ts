require('dotenv').config()
import {Express} from "express";


const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./router/index')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const version = require('../package.json').version


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "User-ms docs",
            version: version,
            description: "API for ms-user"
        },
        servers: [
            {
                url: "http://localhost:8001/api"
            }
        ]
    },
    apis: ["src/router/index.ts"]
}


const swaggerDocs = swaggerJsdoc(options)
const app: Express = express()
const PORT: number = Number(process.env.PORT) || 8001


app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)
app.use('/api/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocs, { explorer: true }))

const start = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server start on PORT = ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()