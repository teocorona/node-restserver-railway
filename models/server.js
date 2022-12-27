const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../db/config');
const fileUpload = require('express-fileupload');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        // this.usersPath = '/api/users'
        // this.authPath = '/api/auth'
        // this.categoriesPath = '/api/categories'
        this.paths ={
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            users: '/api/users',
            uploads: '/api/uploads',
        }

        //Conectar a BD
        this.connectDB();

        // Middlewares
        this.middlewares();

        // rutas de mi app
        this.routes();
    }

    connectDB() {
        dbConnection()
    }

    middlewares() {
        //CORS
        this.app.use(cors());
        //Lectura y Parseo del body de la peticion
        this.app.use(express.json());
        //directorio publico
        this.app.use(express.static('public'));
        //carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true,
        }));
    }

    routes() {
        // this.app.use(this.authPath, require('../routes/auth'))
        // this.app.use(this.usersPath, require('../routes/users'))
        // this.app.use(this.categoriesPath, require('../routes/categories'))
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.users, require('../routes/users'))
        this.app.use(this.paths.categories, require('../routes/categories'))
        this.app.use(this.paths.products, require('../routes/products'))
        this.app.use(this.paths.search, require('../routes/search'))
        this.app.use(this.paths.uploads, require('../routes/uploads'))
    }

    listen() {
        this.app.listen(this.port,()=>{
            console.log(`Servidor corriendo en el puerto ${this.port}`)
        })
    }


}


module.exports = Server;