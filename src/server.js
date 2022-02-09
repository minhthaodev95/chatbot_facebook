import express from 'express';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/routes';
const bodyParser = require('body-parser')



require('dotenv').config();

let app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))



configViewEngine(app);

initRoutes(app);


app.listen(process.env.PORT, () => { console.log('listening on port ' + process.env.PORT) })