//importaciones de terceros
const dotenv = require('dotenv');

//importaciones del codigo propio
const Server = require('./models/server');

dotenv.config();


const server = new Server();

server.listen();






