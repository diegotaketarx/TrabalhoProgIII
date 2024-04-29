import express from 'express'
import mongoose from 'mongoose'
import { routes } from './routes'

class App {
    public express: express.Application

    constructor() {
        this.express = express()
        this.middleware()
     
        this.routes()
        this.database()
    }
    public middleware() {
        this.express.use(express.json())
    }

    public async database() {
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/todolist');
            console.log('A conexão foi realizada com sucesso')
        } catch (error) {
            console.error('Não há conexão estabelecida com o banco')
        }
    }

    public routes() {
        this.express.use(routes)
    }
}

export default new App().express