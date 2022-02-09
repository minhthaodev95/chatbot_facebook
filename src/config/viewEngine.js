import express from 'express';
import path from 'path';


let configViewEngine = (app) => {
    app.use(express.static(path.join(__dirname, '../src/public')));
    app.set('views', './src/views');
    app.set('view engine', 'ejs');
}

module.exports = configViewEngine;