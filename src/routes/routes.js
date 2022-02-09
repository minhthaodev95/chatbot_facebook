import express from "express";
import path from "path";
import indexController from "../controllers/index.controller";
import chatbotController from "../controllers/chatbot.controller";

let router = express.Router();

let initRoutes = (app) => {
    router.get('/', indexController.getHomePage);

    router.post('/webhook', chatbotController.postWebhook);
    router.get('/webhook', chatbotController.getWebhook);

    return app.use("/", router);
}

module.exports = initRoutes;