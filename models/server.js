//Importaciones de terceros
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

//Importaciones del codigo
const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        //atributos
        this.app = express();
        this.port = process.env.PORT;

        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        this.ordenesPath = '/api/ordenes';
        this.categoriasPath = '/api/categorias';
        this.productosPath = '/api/productos';
        this.buscarPath = '/api/buscar';
        this.uploadsPath = '/api/uploads';

        //conectar a base de datos
        this.conectarDB();

        //middlewares
        this.middlewares();

        //metodos, rutas de aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        //Cors
        this.app.use(cors());

        //Tratamiento del request body como json
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'));

        //fileupload-express libreria para cargar archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.ordenesPath, require('../routes/ordenes'))
        this.app.use(this.categoriasPath, require('../routes/categorias'))
        this.app.use(this.productosPath, require('../routes/productos'))
        this.app.use(this.buscarPath, require('../routes/buscar'))
        this.app.use(this.uploadsPath, require('../routes/uploads'))

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log(`Estamos corriendo en el puerto ${this.port}`)
        })
    }
}


module.exports = Server;