import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ExpressGraphQL = require('express-graphql').graphqlHTTP;
import mongoose from 'mongoose';
import socket from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import CheckJWTRoute from './Routes/check-jwt.js';
import LoginRoute from './Routes/login.js';
import RegisterRoute from './Routes/register.js';
import DeleteRouter from './Routes/deleter.js';
import MainSchema from './GraphQL/graphql.js';

const app = express();
const server = http.createServer(app);
const io = socket(server);
const PORT = process.env.PORT || 8000;

// middleware
app.use(cors({
    origin: ['https://localhost:3000', 'https://192.168.56.1:3000']
}));
app.use(express.json({limit: '50mb'}))

// socket
io.on('connection', socket => {
    socket.on('disconnect', () => {});
})

// graphql endpoint
app.use('/graphql', ExpressGraphQL({
    schema: MainSchema,
    graphiql: true
}));

// REST api endpoints
app.use('/check-jwt', CheckJWTRoute);
app.use('/login', LoginRoute);
app.use('/signup', RegisterRoute);
app.use('/delete', DeleteRouter);

// DB connection
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('connected to mongoDB');
}).catch(() => {
    console.log('didnot connect to mongoDB');
})

// main listener
server.listen(PORT, () => {
    console.log('connected to localhost:8000')
})