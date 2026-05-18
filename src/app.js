import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import productsRouter from './routes/products.router.js';


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlendoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use('/api/products', productsRouter);

const MONGO_URI = 'mongoose://localhost:27017/ecommerce';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado con exito a MongoDB (Base: ecommerce)'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado a WebSockets');


  });

